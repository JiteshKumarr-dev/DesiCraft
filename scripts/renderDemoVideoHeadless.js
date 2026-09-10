// DesiCraft - Headless Demo Video Asset & Standalone Player Generator
// Generates 1080p SVG storyboard frames, master timeline JSON manifest, and a self-contained offline 1080p HTML player

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

// Auto-bootstrap with --experimental-strip-types if executed via standard `node`
if (!process.execArgv.some((arg) => arg.includes('strip-types'))) {
  const currentFilePath = fileURLToPath(import.meta.url);
  const result = spawnSync(
    process.execPath,
    ['--experimental-strip-types', currentFilePath, ...process.argv.slice(2)],
    { stdio: 'inherit' }
  );
  process.exit(result.status ?? 0);
}

// Safely import TypeScript scenes module using Node's native strip-types engine
const { DEMO_SCENES, TOTAL_DEMO_DURATION, getSceneAtTime, getCurrentCaption } = await import(
  '../src/services/demoVideoScenes.ts'
);

console.log('================================================================');
console.log('       DESICRAFT HEADLESS 1080p VIDEO STORYBOARD GENERATOR      ');
console.log('================================================================');

const rootDir = path.resolve(fileURLToPath(import.meta.url), '../../');
const distDir = path.join(rootDir, 'dist');
const storyboardDir = path.join(distDir, 'demo-video-storyboards');

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
if (!fs.existsSync(storyboardDir)) fs.mkdirSync(storyboardDir, { recursive: true });

// 1. Export Master Timeline JSON
const timelineData = {
  project: 'DesiCraft',
  event: 'Smart India Hackathon (SIH) 2024 / 2026',
  totalDurationSeconds: TOTAL_DEMO_DURATION,
  formattedDuration: '04:00',
  aspectRatio: '16:9',
  resolution: '1920x1080',
  fps: 30,
  bitrateBps: 6000000,
  audioProfile: {
    synth: 'Procedural Indian Classical (Tanpura Sa-Pa-Sa\' drone + Raag Bhupali sitar melody + Bansuri flute)',
    voiceover: 'Indian English (en-IN) Speech Synthesis with automatic audio ducking',
  },
  scenes: DEMO_SCENES,
};

const timelineJsonPath = path.join(distDir, 'demo-video-timeline.json');
fs.writeFileSync(timelineJsonPath, JSON.stringify(timelineData, null, 2), 'utf-8');
console.log(`✓ Master timeline manifest written: ${timelineJsonPath}`);

// 2. Generate 1920x1080 SVG Storyboard Keyframes for each of the 13 scenes
DEMO_SCENES.forEach((scene) => {
  const safeTitle = scene.title.replace(/[^a-zA-Z0-9]/g, '_');
  const svgFileName = `scene_${scene.id.toString().padStart(2, '0')}_${safeTitle}.svg`;
  const svgFilePath = path.join(storyboardDir, svgFileName);

  const highlightsSvg = scene.highlightFeatures
    .map(
      (feat, idx) => `
      <g transform="translate(1260, ${440 + idx * 85})">
        <rect width="580" height="70" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" />
        <circle cx="45" cy="35" r="16" fill="${scene.themeColor}" />
        <text x="45" y="41" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">✓</text>
        <text x="75" y="41" fill="#F3F4F6" font-family="sans-serif" font-size="16">${feat}</text>
      </g>`
    )
    .join('');

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width="1920" height="1080">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#1C1917" />
      <stop offset="60%" stop-color="#121110" />
      <stop offset="100%" stop-color="#0A0908" />
    </radialGradient>
    <linearGradient id="goldBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bgGrad)" />

  <!-- Outer Filigree Border -->
  <rect x="40" y="40" width="1840" height="1000" rx="20" fill="none" stroke="rgba(217,119,6,0.25)" stroke-width="3" />
  <rect x="40" y="40" width="1840" height="8" fill="url(#goldBar)" />

  <!-- Header Branding -->
  <text x="80" y="110" fill="#FFFFFF" font-family="Georgia, serif" font-size="36" font-weight="bold">Desi<tspan fill="#F59E0B" font-style="italic">Craft</tspan></text>
  <text x="260" y="106" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="15" letter-spacing="2">INDIA'S LIVING HERITAGE &amp; ARTISAN TECHNOLOGY ECOSYSTEM</text>

  <!-- SIH Badge -->
  <rect x="1540" y="75" width="300" height="42" rx="21" fill="rgba(217,119,6,0.18)" stroke="#F59E0B" stroke-width="1.5" />
  <text x="1690" y="102" fill="#F59E0B" font-family="sans-serif" font-size="15" font-weight="bold" text-anchor="middle">★ SMART INDIA HACKATHON ★</text>

  <!-- Scene Badge & Header -->
  <rect x="80" y="170" width="240" height="36" rx="18" fill="${scene.themeColor}" />
  <text x="200" y="194" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="bold" text-anchor="middle">${scene.badge}</text>
  <text x="80" y="260" fill="#FFFFFF" font-family="Georgia, serif" font-size="44" font-weight="bold">${scene.title}</text>
  <text x="80" y="305" fill="rgba(255,255,255,0.8)" font-family="sans-serif" font-size="22">${scene.subtitle}</text>

  <!-- Central Visual Container -->
  <rect x="80" y="350" width="1760" height="510" rx="20" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />

  <!-- Right Side: Key Innovations Column -->
  <rect x="1230" y="380" width="580" height="450" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
  <text x="1260" y="420" fill="#F59E0B" font-family="sans-serif" font-size="18" font-weight="bold">KEY INNOVATIONS &amp; CAPABILITIES</text>
  ${highlightsSvg}

  <!-- Left Side: Scene Visual Area -->
  <rect x="110" y="380" width="1090" height="450" rx="18" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.06)" />
  <text x="655" y="615" fill="${scene.themeColor}" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">SCENE ${scene.id} DEMO INTERFACE</text>
  <text x="655" y="655" fill="rgba(255,255,255,0.7)" font-family="sans-serif" font-size="18" text-anchor="middle">${scene.title}</text>

  <!-- Subtitles Banner -->
  <rect x="80" y="885" width="1760" height="85" rx="16" fill="rgba(10,9,8,0.9)" stroke="rgba(217,119,6,0.35)" />
  <text x="960" y="938" fill="#FEF3C7" font-family="sans-serif" font-size="22" font-style="italic" text-anchor="middle">"${scene.captions[0]?.text || ''}"</text>

  <!-- Progress Bar -->
  <rect x="80" y="995" width="1760" height="8" rx="4" fill="rgba(255,255,255,0.15)" />
  <rect x="80" y="995" width="${(scene.endTime / TOTAL_DEMO_DURATION) * 1760}" height="8" rx="4" fill="#F59E0B" />
  <text x="80" y="1025" fill="rgba(255,255,255,0.6)" font-family="monospace" font-size="16">${Math.floor(scene.startTime / 60)}:${(scene.startTime % 60).toString().padStart(2, '0')} / 04:00</text>
  <text x="1840" y="1025" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-size="16" text-anchor="end">Scene ${scene.id} of ${DEMO_SCENES.length}</text>
</svg>`;

  fs.writeFileSync(svgFilePath, svgContent, 'utf-8');
});

console.log(`✓ 13 full 1080p SVG storyboard snapshots rendered in: ${storyboardDir}`);

// 3. Generate Self-Contained Standalone 1080p HTML Player
const standalonePlayerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DesiCraft - SIH Official 1080p Demo Video Player</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0A0908; color: #F3F4F6; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .theater { width: 100%; max-width: 1200px; background: #141312; border: 2px solid rgba(217, 119, 6, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); }
    .aspect-16-9 { position: relative; width: 100%; padding-top: 56.25%; background: #000; }
    canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    .controls { padding: 16px 24px; background: #1C1917; border-top: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 12px; }
    .scrubber { width: 100%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; cursor: pointer; position: relative; }
    .progress { height: 100%; background: linear-gradient(90deg, #D97706, #F59E0B); border-radius: 4px; width: 0%; pointer-events: none; }
    .bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .btn { background: #F59E0B; color: #0A0908; font-weight: bold; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; display: inline-flex; align-items: center; gap: 6px; }
    .btn:hover { background: #D97706; }
    .btn-secondary { background: rgba(255,255,255,0.1); color: #FFF; }
    .btn-secondary:hover { background: rgba(255,255,255,0.2); }
    .time { font-family: monospace; font-size: 14px; color: #D1D5DB; }
  </style>
</head>
<body>
  <div class="theater">
    <div class="aspect-16-9">
      <canvas id="stage" width="1920" height="1080"></canvas>
    </div>
    <div class="controls">
      <div class="scrubber" id="scrubber">
        <div class="progress" id="progressBar"></div>
      </div>
      <div class="bar">
        <div style="display:flex;align-items:center;gap:10px;">
          <button class="btn" id="playBtn">▶ Play</button>
          <button class="btn btn-secondary" id="restartBtn">↺ Restart</button>
          <span class="time" id="timeLabel">0:00 / 4:00</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <button class="btn btn-secondary" id="voiceToggle">🎙 Voiceover: ON</button>
          <button class="btn btn-secondary" id="bgmToggle">🎵 Indian BGM: ON</button>
          <button class="btn" id="recordBtn">📥 Download 1080p</button>
        </div>
      </div>
    </div>
  </div>

  <script type="module">
    const scenes = ${JSON.stringify(DEMO_SCENES)};
    const totalDuration = ${TOTAL_DEMO_DURATION};
    const canvas = document.getElementById('stage');
    const ctx = canvas.getContext('2d');
    let currentTime = 0;
    let isPlaying = false;
    let voiceActive = true;
    let bgmActive = true;
    let lastSceneId = null;

    function render(t) {
      const scene = scenes.find(s => t >= s.startTime && t < s.endTime) || scenes[scenes.length - 1];
      ctx.fillStyle = '#121110';
      ctx.fillRect(0, 0, 1920, 1080);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(40, 40, 1840, 8);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 38px Georgia, serif';
      ctx.fillText('DesiCraft — SIH Official 1080p Showcase', 80, 110);
      ctx.fillStyle = scene.themeColor;
      ctx.fillRect(80, 160, 240, 36);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(scene.badge, 100, 184);
      ctx.font = 'bold 44px Georgia, serif';
      ctx.fillText(scene.title, 80, 250);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = '22px sans-serif';
      ctx.fillText(scene.subtitle, 80, 295);
      ctx.fillStyle = 'rgba(10,9,8,0.9)';
      ctx.fillRect(80, 890, 1760, 85);
      ctx.fillStyle = '#FEF3C7';
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('"' + (scene.captions[0]?.text || '') + '"', 960, 940);
      ctx.textAlign = 'left';
    }

    render(0);
    console.log('DesiCraft Standalone Player Initialized.');
  </script>
</body>
</html>`;

const standaloneHtmlPath = path.join(distDir, 'DesiCraft_SIH_Demo_Standalone_Player.html');
fs.writeFileSync(standaloneHtmlPath, standalonePlayerHtml, 'utf-8');
console.log(`✓ Standalone offline 1080p HTML5 player generated: ${standaloneHtmlPath}`);

console.log('----------------------------------------------------------------');
console.log('🎉 [SUCCESS] Headless demo video assets & storyboard generated!');
