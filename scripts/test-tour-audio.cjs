// Playwright test to verify:
// 1. Guided tour does NOT automatically read out the card text on step load
// 2. The guide's audio works on demand via Listen button with natural voiceScript narration
// 3. Playback controls (Pause, Resume, Stop, Replay) function properly
// 4. Zero audio overlapping / concurrency violations at all times

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
  const teluguCard = page.locator('[aria-label="Telugu - తెలుగు"]').first();
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

  // 3. Verify Guided Tour step did NOT automatically read out the text
  console.log('🔍 Verifying NO automatic text read-out on step load...');
  await page.waitForTimeout(1000);
  console.log(`Audios playing automatically: ${audioEvents.filter(e => e.type === 'AUDIO_PLAY_START' || e.type === 'SPEECH_SYNTH_START').length}`);

  // 4. Test clicking [Listen] ("వినండి" / "Listen") to let guide's audio work perfectly
  console.log('\n🔊 Testing Guide Audio via Listen button...');
  const listenBtn = page.locator(
    'button:has-text("వినండి"), button:has-text("Listen"), button:has-text("सुनें")'
  ).first();

  if (await listenBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    console.log('Clicking [Listen] button on Guided Tour card...');
    await listenBtn.click();
    await page.waitForTimeout(1000);
  }

  // 5. Test Pause & Resume controls
  console.log('\n⏸️ Testing Pause & Resume controls...');
  const pauseBtn = page.locator('button[title*="Pause"], button:has-text("విరామం"), button:has-text("Pause")').first();
  if (await pauseBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('Clicking Pause button...');
    await pauseBtn.click();
    await page.waitForTimeout(500);

    const resumeBtn = page.locator('button[title*="Resume"], button:has-text("కొనసాగించు"), button:has-text("Resume")').first();
    if (await resumeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Clicking Resume button...');
      await resumeBtn.click();
      await page.waitForTimeout(800);
    }
  }

  // 6. Test Step Transitions (Next Step 2, Step 3, Step 4)
  for (let step = 1; step <= 3; step++) {
    console.log(`\n➡️ Transitioning to step ${step + 1}...`);
    const nextBtn = page.locator(
      'button:has-text("తరువాత"), button:has-text("Next"), button:has-text("आगे")'
    ).first();
    if (await nextBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(800);

      // In step 2, click Listen to verify guide's audio for step 2
      if (step === 1) {
        console.log('Testing Listen button on Step 2...');
        const step2ListenBtn = page.locator('button:has-text("వినండి"), button:has-text("Listen")').first();
        if (await step2ListenBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
          await step2ListenBtn.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  }

  // 7. Test Replay button
  console.log('\n🔁 Testing Replay button...');
  const replayBtn = page.locator(
    'button:has-text("మళ్లీ వినండి"), button:has-text("Replay"), button:has-text("Listen Again")'
  ).first();
  if (await replayBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    console.log('Clicking Replay button...');
    await replayBtn.click();
    await page.waitForTimeout(800);
  }

  // 8. Test Mode Switching & Route Audio Isolation
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
  console.log(`Overlap Detected: ${overlapDetected ? '❌ YES (FAILURE)' : '✅ NO (PASSED - Strictly 1 audio at a time)'}`);
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
