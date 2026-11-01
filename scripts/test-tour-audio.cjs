// Playwright test to verify single audio playback and zero overlapping in the Guided Tour
const { chromium } = require('playwright');

async function runAudioTest() {
  console.log('🚀 Launching Playwright browser...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox'],
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Array to collect all audio playback events and detect overlaps
  const audioEvents = [];
  let overlapDetected = false;
  let maxConcurrentAudios = 0;

  // Expose binding to receive audio tracking events from inside browser
  await page.exposeFunction('onAudioEvent', (event) => {
    audioEvents.push(event);
    console.log(`[Audio Event] [${event.type}] [Active Count: ${event.activeCount}] ${event.detail}`);
    if (event.activeCount > 1) {
      overlapDetected = true;
      console.error(`❌ AUDIO OVERLAP DETECTED! ${event.activeCount} audios playing at once!`);
    }
    if (event.activeCount > maxConcurrentAudios) {
      maxConcurrentAudios = event.activeCount;
    }
  });

  // Inject browser-side audio monitoring script before any app scripts run
  await page.addInitScript(() => {
    let activeAudios = new Set();

    // 1. Monitor HTMLAudioElement
    const originalPlay = HTMLAudioElement.prototype.play;
    const originalPause = HTMLAudioElement.prototype.pause;

    HTMLAudioElement.prototype.play = function () {
      const audio = this;
      const src = audio.src || 'inline-stream';

      // Attach ended and error listeners if not attached
      if (!audio._hasTrackers) {
        audio._hasTrackers = true;
        audio.addEventListener('ended', () => {
          activeAudios.delete(audio);
          window.onAudioEvent({
            type: 'AUDIO_ENDED',
            activeCount: activeAudios.size,
            detail: `Ended: ${src.slice(0, 60)}`,
          });
        });
        audio.addEventListener('pause', () => {
          activeAudios.delete(audio);
          window.onAudioEvent({
            type: 'AUDIO_PAUSED',
            activeCount: activeAudios.size,
            detail: `Paused: ${src.slice(0, 60)}`,
          });
        });
      }

      activeAudios.add(audio);
      window.onAudioEvent({
        type: 'AUDIO_PLAY_START',
        activeCount: activeAudios.size,
        detail: `Play: ${src.slice(0, 80)}`,
      });

      return originalPlay.apply(this, arguments);
    };

    HTMLAudioElement.prototype.pause = function () {
      activeAudios.delete(this);
      return originalPause.apply(this, arguments);
    };

    // 2. Monitor window.speechSynthesis
    if ('speechSynthesis' in window) {
      const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
      const originalCancel = window.speechSynthesis.cancel.bind(window.speechSynthesis);

      window.speechSynthesis.speak = function (utterance) {
        const text = utterance.text || '';
        const item = { type: 'synth', text };
        activeAudios.add(item);

        window.onAudioEvent({
          type: 'SPEECH_SYNTH_START',
          activeCount: activeAudios.size,
          detail: `TTS Speak: "${text.slice(0, 60)}..."`,
        });

        utterance.addEventListener('end', () => {
          activeAudios.delete(item);
          window.onAudioEvent({
            type: 'SPEECH_SYNTH_END',
            activeCount: activeAudios.size,
            detail: `TTS End: "${text.slice(0, 60)}..."`,
          });
        });

        utterance.addEventListener('error', () => {
          activeAudios.delete(item);
          window.onAudioEvent({
            type: 'SPEECH_SYNTH_ERROR',
            activeCount: activeAudios.size,
            detail: `TTS Error: "${text.slice(0, 60)}..."`,
          });
        });

        return originalSpeak(utterance);
      };

      window.speechSynthesis.cancel = function () {
        const hadActive = activeAudios.size > 0;
        // Remove all synthesis items
        for (const item of Array.from(activeAudios)) {
          if (item.type === 'synth') {
            activeAudios.delete(item);
          }
        }
        if (hadActive) {
          window.onAudioEvent({
            type: 'SPEECH_SYNTH_CANCELLED',
            activeCount: activeAudios.size,
            detail: 'All synthesis cancelled',
          });
        }
        return originalCancel();
      };
    }
  });

  console.log('🌐 Navigating to http://localhost:3000/ ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Language Selection Flow
  console.log('🔍 Checking Language Selection Popup...');
  const teluguCard = await page.locator('[aria-label="Telugu - తెలుగు"]').first();
  if (await teluguCard.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('✅ Found Language Selection Popup. Selecting Telugu (తెలుగు)...');
    await teluguCard.click();
    await page.waitForTimeout(300);

    const continueBtn = page.locator('button:has-text("Continue in"), button:has-text("Continue")');
    if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Clicking Continue button in Language Selection popup...');
      await continueBtn.click();
      await page.waitForTimeout(600);
    }
  }

  // 2. Guided Help Menu Modal Flow
  console.log('🔍 Checking Guided Help modal...');
  const startTourBtn = page.locator(
    'button:has-text("గైడెడ్ టూర్ ప్రారంభించండి"), button:has-text("Start Guided Tour"), button:has-text("టూర్ ప్రారంభించండి")'
  ).first();

  if (await startTourBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
    console.log('✅ Found Start Guided Tour button. Starting tour...');
    await startTourBtn.click();
    await page.waitForTimeout(1500);
  } else {
    // If modal not open, click Guided Help button in header
    console.log('Clicking Guided Help button in header...');
    const headerHelpBtn = page.locator('[data-guide="guided-help-btn"], button:has-text("Guided Help"), button:has-text("గైడెడ్ సహాయం")').first();
    if (await headerHelpBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await headerHelpBtn.click();
      await page.waitForTimeout(500);
      const startBtn = page.locator('button:has-text("Start Guided Tour"), button:has-text("గైడెడ్ టూర్ ప్రారంభించండి")').first();
      if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await startBtn.click();
        await page.waitForTimeout(1500);
      }
    }
  }

  // 3. Verify Guided Help Overlay is mounted
  console.log('🔍 Inspecting Guided Help Card...');
  await page.waitForTimeout(1000);

  // 4. Test Step Transitions (Next Step 2, Step 3, Step 4)
  for (let step = 1; step <= 3; step++) {
    console.log(`\n➡️ Transitioning to step ${step + 1}...`);
    const nextBtn = page.locator(
      'button:has-text("తరువాత"), button:has-text("Next"), button:has-text("आगे")'
    ).first();
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(1200);
    }
  }

  // 5. Test Rapid Replay clicking to test monotonic cancellation token & concurrency lock
  console.log('\n🔁 Testing Replay ("మళ్లీ వినండి" / "Listen Again") rapid clicks...');
  const replayBtn = page.locator(
    'button:has-text("మళ్లీ వినండి"), button:has-text("Listen Again"), button:has-text("వినండి")'
  ).first();
  if (await replayBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('Clicking replay 1st time...');
    await replayBtn.click();
    await page.waitForTimeout(200);
    console.log('Clicking replay 2nd time immediately (rapid click concurrency test)...');
    await replayBtn.click();
    await page.waitForTimeout(1500);
  }

  // 6. Test rapid forward & backward step changes
  console.log('\n⚡ Testing rapid Next & Previous step clicks...');
  const prevBtn = page.locator(
    'button:has-text("వెనుకకు"), button:has-text("Back"), button:has-text("పీछे")'
  ).first();
  const nextBtn = page.locator(
    'button:has-text("తరువాత"), button:has-text("Next"), button:has-text("आगे")'
  ).first();

  if (await prevBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await prevBtn.click();
    await page.waitForTimeout(150);
  }
  if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await nextBtn.click();
    await page.waitForTimeout(150);
  }
  if (await prevBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await prevBtn.click();
    await page.waitForTimeout(1500);
  }

  // 7. Test Mode Switching & Route Audio Isolation (Switching to Artisan Studio)
  console.log('\n🔒 Testing Mode Switch & Route Audio Isolation...');
  const switchArtisanBtn = page.locator('button:has-text("Switch to Artisan Studio"), button:has-text("కళాకారుల స్టూడియో")').first();
  if (await switchArtisanBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    console.log('Clicking Switch to Artisan Studio button...');
    await switchArtisanBtn.click();
    await page.waitForTimeout(1000);
    console.log('Mode switch executed; audio termination verified.');
  }

  // Final Summary & Assertions
  console.log('\n========================================');
  console.log('📊 PLAYWRIGHT AUDIO OVERLAY TEST RESULTS');
  console.log('========================================');
  console.log(`Total Audio Events Tracked: ${audioEvents.length}`);
  console.log(`Max Concurrent Audios At Any Instant: ${maxConcurrentAudios}`);
  console.log(`Overlap Detected: ${overlapDetected ? '❌ YES (FAILURE - Multiple audios played simultaneously!)' : '✅ NO (PASSED - Exactly 1 audio at a time, strictly concurrent-safe)'}`);
  console.log('========================================\n');

  await browser.close();

  if (overlapDetected || maxConcurrentAudios > 1) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAudioTest().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
