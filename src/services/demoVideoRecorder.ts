// DesiCraft - 1080p MediaRecorder Video Recording & Download Engine
// Renders 1920x1080 high-definition frames with synchronized Indian instrumental audio
// Generates direct WebM / MP4 video downloads with zero external software needed

import { DEMO_SCENES, DemoScene, TOTAL_DEMO_DURATION, getSceneAtTime, getCurrentCaption } from './demoVideoScenes';
import { indianInstrumentalSynth } from './indianInstrumentalAudio';
import { demoVoiceover } from './demoVoiceoverService';

export interface RecordProgress {
  elapsedSeconds: number;
  totalSeconds: number;
  percent: number;
  currentScene: DemoScene;
  status: string;
}

export interface RecordOptions {
  durationSeconds?: number;
  includeVoiceover?: boolean;
}

export class DemoVideoRecorder {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;
  private isAborted = false;
  private animFrameId: number | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1920;
    this.canvas.height = 1080;
    this.ctx = this.canvas.getContext('2d')!;
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public async startRecording(
    onProgress: (prog: RecordProgress) => void,
    onComplete: (blobUrl: string, fileName: string) => void,
    onError: (err: Error) => void
  ): Promise<void>;
  public async startRecording(
    options: RecordOptions,
    onProgress: (prog: RecordProgress) => void,
    onComplete: (blobUrl: string, fileName: string) => void,
    onError: (err: Error) => void
  ): Promise<void>;
  public async startRecording(
    optionsOrProgress: RecordOptions | ((prog: RecordProgress) => void),
    onProgressOrComplete?: ((prog: RecordProgress) => void) | ((blobUrl: string, fileName: string) => void),
    onCompleteOrError?: ((blobUrl: string, fileName: string) => void) | ((err: Error) => void),
    onErrorFallback?: (err: Error) => void
  ): Promise<void> {
    if (this.isRecording) return;
    this.isRecording = true;
    this.isAborted = false;
    this.recordedChunks = [];

    // Parse overloaded arguments
    let options: RecordOptions = {};
    let onProgress: (prog: RecordProgress) => void;
    let onComplete: (blobUrl: string, fileName: string) => void;
    let onError: (err: Error) => void;

    if (typeof optionsOrProgress === 'function') {
      onProgress = optionsOrProgress;
      onComplete = onProgressOrComplete as (blobUrl: string, fileName: string) => void;
      onError = onCompleteOrError as (err: Error) => void;
    } else {
      options = optionsOrProgress || {};
      onProgress = onProgressOrComplete as (prog: RecordProgress) => void;
      onComplete = onCompleteOrError as (blobUrl: string, fileName: string) => void;
      onError = onErrorFallback || ((err: Error) => console.error(err));
    }

    const targetDuration = Math.max(10, Math.min(TOTAL_DEMO_DURATION, options.durationSeconds || TOTAL_DEMO_DURATION));
    const includeVoiceover = options.includeVoiceover !== false;

    try {
      // 1. Initialize Audio
      indianInstrumentalSynth.start();
      const audioDest = indianInstrumentalSynth.getMediaStreamDestination();

      // 2. Capture 1080p 30fps canvas stream
      const canvasStream = (this.canvas as any).captureStream ? (this.canvas as any).captureStream(30) : null;
      if (!canvasStream) {
        throw new Error('Canvas captureStream is not supported by your browser.');
      }

      // 3. Combine video and audio tracks
      const combinedStream = new MediaStream();
      canvasStream.getVideoTracks().forEach((vt: MediaStreamTrack) => combinedStream.addTrack(vt));
      if (audioDest && audioDest.stream) {
        audioDest.stream.getAudioTracks().forEach((at: MediaStreamTrack) => combinedStream.addTrack(at));
      }

      // 4. Select supported MIME type safely
      const candidateTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4;codecs=avc1,mp4a.40.2',
        'video/mp4',
      ];
      let selectedMimeType = '';
      for (const t of candidateTypes) {
        try {
          if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function' && MediaRecorder.isTypeSupported(t)) {
            selectedMimeType = t;
            break;
          }
        } catch {
          // ignore
        }
      }

      const recorderOptions: MediaRecorderOptions = {
        videoBitsPerSecond: 6000000, // 6 Mbps for pristine 1080p clarity
      };
      if (selectedMimeType) {
        recorderOptions.mimeType = selectedMimeType;
      }

      this.mediaRecorder = new MediaRecorder(combinedStream, recorderOptions);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.isRecording = false;
        indianInstrumentalSynth.stop();
        demoVoiceover.stop();

        if (this.isAborted) {
          this.recordedChunks = [];
          this.isAborted = false;
          return;
        }

        const ext = (selectedMimeType && selectedMimeType.includes('mp4')) ? 'mp4' : 'webm';
        const blobType = selectedMimeType || 'video/webm';
        const blob = new Blob(this.recordedChunks, { type: blobType });
        const blobUrl = URL.createObjectURL(blob);
        const fileName = `DesiCraft_SIH_Official_Demo_1080p.${ext}`;

        onComplete(blobUrl, fileName);
      };

      this.mediaRecorder.start(1000); // chunk every second

      // 5. Render loop at 1080p
      const startTime = performance.now();
      let lastSceneId: number | null = null;

      const renderFrame = () => {
        if (!this.isRecording) return;

        const now = performance.now();
        const elapsedSec = (now - startTime) / 1000;

        if (elapsedSec >= targetDuration) {
          this.stopRecording();
          return;
        }

        // Calculate virtual timeline position
        const virtualElapsed = (elapsedSec / targetDuration) * TOTAL_DEMO_DURATION;
        const scene = getSceneAtTime(virtualElapsed);
        const caption = getCurrentCaption(scene, virtualElapsed);
        const progressPercent = Math.min(100, Math.round((elapsedSec / targetDuration) * 100));

        // Synchronize scene transitions & voiceover narration
        if (lastSceneId !== scene.id) {
          lastSceneId = scene.id;
          indianInstrumentalSynth.playSceneCueTone(scene.id);
          if (includeVoiceover && !demoVoiceover.getMuted()) {
            demoVoiceover.speakScene(scene.narrationText);
          }
        }

        // Draw 1080p frame
        this.drawSceneFrame(scene, virtualElapsed, caption);

        onProgress({
          elapsedSeconds: Math.floor(elapsedSec),
          totalSeconds: Math.floor(targetDuration),
          percent: progressPercent,
          currentScene: scene,
          status: `Recording Scene ${scene.id}/${DEMO_SCENES.length}: ${scene.title}`,
        });

        this.animFrameId = requestAnimationFrame(renderFrame);
      };

      this.animFrameId = requestAnimationFrame(renderFrame);
    } catch (err: any) {
      this.isRecording = false;
      this.stopRecording();
      onError(err);
    }
  }

  public stopRecording() {
    if (!this.isRecording) return;
    this.isRecording = false;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  public cancelRecording() {
    this.isAborted = true;
    this.stopRecording();
    demoVoiceover.stop();
    indianInstrumentalSynth.stop();
  }

  // Draw 1920x1080 frame
  private drawSceneFrame(scene: DemoScene, timeSeconds: number, caption: string) {
    const ctx = this.ctx;
    const w = 1920;
    const h = 1080;

    // Rich Dark Cultural Gradient Background
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 100, w / 2, h / 2, 1100);
    bgGrad.addColorStop(0, '#1E1B18'); // Warm charcoal
    bgGrad.addColorStop(0.6, '#121110'); // Deep earthen dark
    bgGrad.addColorStop(1, '#0A0908'); // Onyx
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Decorative Cultural Border / Golden Corner Filigree
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.25)';
    ctx.lineWidth = 3;
    ctx.strokeRect(40, 40, w - 80, h - 80);

    // Subtle Top Heritage Accent Bar
    const topBarGrad = ctx.createLinearGradient(0, 0, w, 0);
    topBarGrad.addColorStop(0, '#D97706');
    topBarGrad.addColorStop(0.5, '#F59E0B');
    topBarGrad.addColorStop(1, '#D97706');
    ctx.fillStyle = topBarGrad;
    ctx.fillRect(40, 40, w - 80, 8);

    // Header Logo & Branding
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillText('Desi', 80, 110);
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'italic 36px "Cinzel", "Playfair Display", Georgia, serif';
    ctx.fillText('Craft', 165, 110);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px sans-serif';
    ctx.fillText("INDIA'S LIVING HERITAGE & ARTISAN TECHNOLOGY ECOSYSTEM", 280, 108);

    // SIH 2024 / 2026 Champion Badge
    ctx.fillStyle = 'rgba(217, 119, 6, 0.2)';
    ctx.beginPath();
    ctx.roundRect(w - 380, 75, 300, 44, 22);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('★ SMART INDIA HACKATHON ★', w - 350, 103);

    // Scene Badge
    ctx.fillStyle = scene.themeColor;
    ctx.beginPath();
    ctx.roundRect(80, 170, 240, 36, 18);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(scene.badge, 100, 194);

    // Scene Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px "Playfair Display", serif';
    ctx.fillText(scene.title, 80, 260);

    // Scene Subtitle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '22px sans-serif';
    ctx.fillText(scene.subtitle, 80, 305);

    // Main Feature Card Box in Center (1760 x 500)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.roundRect(80, 340, w - 160, 520, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    // Scene Specific Content Rendering
    this.drawSceneGraphic(scene, timeSeconds, 80, 340, w - 160, 520);

    // Subtitles Banner at Bottom
    ctx.fillStyle = 'rgba(10, 9, 8, 0.85)';
    ctx.beginPath();
    ctx.roundRect(80, 890, w - 160, 90, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
    ctx.stroke();

    // Subtitle text
    ctx.fillStyle = '#FEF3C7';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`"${caption}"`, w / 2, 945);
    ctx.textAlign = 'left';

    // Bottom Progress Bar
    const progress = Math.min(1, timeSeconds / TOTAL_DEMO_DURATION);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(80, 1010, w - 160, 8);

    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(80, 1010, (w - 160) * progress, 8);

    // Timestamp & Scene Indicator
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '16px monospace';
    const curMin = Math.floor(timeSeconds / 60);
    const curSec = Math.floor(timeSeconds % 60).toString().padStart(2, '0');
    const totMin = Math.floor(TOTAL_DEMO_DURATION / 60);
    const totSec = Math.floor(TOTAL_DEMO_DURATION % 60).toString().padStart(2, '0');
    ctx.fillText(`${curMin}:${curSec} / ${totMin}:${totSec}`, 80, 1040);

    ctx.textAlign = 'right';
    ctx.fillText(`Scene ${scene.id} of ${DEMO_SCENES.length}`, w - 80, 1040);
    ctx.textAlign = 'left';
  }

  // Draw scene specific infographics, cards, and diagrams
  private drawSceneGraphic(
    scene: DemoScene,
    timeSec: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const ctx = this.ctx;

    // Feature highlights pill cards on the right side
    const cardWidth = 540;
    const cardX = x + width - cardWidth - 40;
    let cardY = y + 50;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(cardX, y + 40, cardWidth, height - 80, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('KEY INNOVATIONS & CAPABILITIES', cardX + 30, cardY + 15);
    cardY += 50;

    scene.highlightFeatures.forEach((feat, idx) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(cardX + 25, cardY, cardWidth - 50, 75, 12);
      ctx.fill();

      // Checkmark icon
      ctx.fillStyle = scene.themeColor;
      ctx.beginPath();
      ctx.arc(cardX + 55, cardY + 38, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('✓', cardX + 50, cardY + 44);

      // Feature text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px sans-serif';
      ctx.fillText(feat, cardX + 85, cardY + 43);

      cardY += 95;
    });

    // Left Visual Area: Interactive Showcase Visuals (width: 1080)
    const visualWidth = width - cardWidth - 80;
    const visualHeight = height - 80;
    const visualX = x + 40;
    const visualY = y + 40;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(visualX, visualY, visualWidth, visualHeight, 18);
    ctx.clip();

    switch (scene.key) {
      case 'opening':
        this.renderOpeningVisual(ctx, visualX, visualY, visualWidth, visualHeight, timeSec);
        break;
      case 'the_problem':
        this.renderProblemVisual(ctx, visualX, visualY, visualWidth, visualHeight);
        break;
      case 'enter_desicraft':
        this.renderArchitectureVisual(ctx, visualX, visualY, visualWidth, visualHeight, timeSec);
        break;
      case 'customer_map':
        this.renderCustomerMapVisual(ctx, visualX, visualY, visualWidth, visualHeight, timeSec);
        break;
      case 'digital_passport':
        this.renderPassportVisual(ctx, visualX, visualY, visualWidth, visualHeight);
        break;
      case 'artisan_mode':
        this.renderArtisanModeVisual(ctx, visualX, visualY, visualWidth, visualHeight);
        break;
      case 'voice_creator':
        this.renderVoiceCreatorVisual(ctx, visualX, visualY, visualWidth, visualHeight, timeSec);
        break;
      case 'fair_price':
        this.renderFairPriceVisual(ctx, visualX, visualY, visualWidth, visualHeight, timeSec);
        break;
      case 'image_studio':
        this.renderImageStudioVisual(ctx, visualX, visualY, visualWidth, visualHeight, timeSec);
        break;
      case 'collaboration':
        this.renderCollaborationVisual(ctx, visualX, visualY, visualWidth, visualHeight, timeSec);
        break;
      case 'opportunities':
        this.renderOpportunitiesVisual(ctx, visualX, visualY, visualWidth, visualHeight);
        break;
      case 'multilingual':
        this.renderMultilingualVisual(ctx, visualX, visualY, visualWidth, visualHeight, timeSec);
        break;
      case 'final_impact':
        this.renderFinalImpactVisual(ctx, visualX, visualY, visualWidth, visualHeight, timeSec);
        break;
      default:
        break;
    }

    ctx.restore();
  }

  // --- Visual Generators for Each Scene ---

  private renderOpeningVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number
  ) {
    // Glowing Mandala / Centerpiece
    const pulse = Math.sin(t * 2) * 10;
    const centerX = x + w / 2;
    const centerY = y + h / 2;

    const grad = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 280 + pulse);
    grad.addColorStop(0, 'rgba(217, 119, 6, 0.4)');
    grad.addColorStop(0.7, 'rgba(217, 119, 6, 0.05)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    // Sacred Heritage Symbols & Heritage Crafts Cards
    const crafts = [
      { name: 'Varanasi Zari Brocade', state: 'Uttar Pradesh', gi: 'GI-2009-UP-0044' },
      { name: 'Pochampally Double Ikat', state: 'Telangana', gi: 'GI-2005-TS-0004' },
      { name: 'Bastar Dhokra Bell Metal', state: 'Chhattisgarh', gi: 'GI-2008-CG-0089' },
      { name: 'Kutch Ajrakh Block Print', state: 'Gujarat', gi: 'GI-2011-GJ-0112' },
    ];

    crafts.forEach((c, idx) => {
      const cx = x + 60 + (idx % 2) * 500;
      const cy = y + 80 + Math.floor(idx / 2) * 170;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(cx, cy, 460, 140, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.5)';
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(c.gi, cx + 25, cy + 38);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px serif';
      ctx.fillText(c.name, cx + 25, cy + 74);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '16px sans-serif';
      ctx.fillText(`📍 ${c.state} • Master Artisan Certified`, cx + 25, cy + 108);
    });
  }

  private renderProblemVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const problems = [
      { title: 'Predatory Middlemen', stat: '70% – 85%', desc: 'Lost value taken by non-producing traders' },
      { title: 'Linguistic Barriers', stat: '90%+', desc: 'Artisans unable to use English-only platforms' },
      { title: 'Disillusioned Youth', stat: '40% Drop', desc: 'Next-generation leaving looms for unorganized labor' },
      { title: 'Zero Collaboration', stat: 'Siloed', desc: 'Crafts unable to modernize through cross-technique fusion' },
    ];

    problems.forEach((p, idx) => {
      const px = x + 50 + (idx % 2) * 500;
      const py = y + 70 + Math.floor(idx / 2) * 180;

      ctx.fillStyle = 'rgba(220, 38, 38, 0.12)';
      ctx.beginPath();
      ctx.roundRect(px, py, 460, 150, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)';
      ctx.stroke();

      ctx.fillStyle = '#EF4444';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(p.stat, px + 25, py + 52);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(p.title, px + 25, py + 92);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '15px sans-serif';
      ctx.fillText(p.desc, px + 25, py + 122);
    });
  }

  private renderArchitectureVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number
  ) {
    // Universal Account Dual Reality Diagram
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(x, y, w, h);

    // Center Unified ID Badge
    const midX = x + w / 2;
    const midY = y + h / 2;

    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.roundRect(midX - 180, midY - 60, 360, 120, 20);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('UNIVERSAL IDENTITY', midX, midY - 15);
    ctx.font = '15px sans-serif';
    ctx.fillText('1 Account ⇋ 2 Synchronized Modes', midX, midY + 18);
    ctx.font = '12px monospace';
    ctx.fillText('Rajeshwar Ansari (Varanasi)', midX, midY + 40);

    // Left: Customer Mode
    ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
    ctx.beginPath();
    ctx.roundRect(x + 50, midY - 140, 320, 280, 20);
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('CUSTOMER MODE', x + 210, midY - 90);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px sans-serif';
    ctx.fillText('• Interactive Heritage Map', x + 210, midY - 40);
    ctx.fillText('• Verified GI Tag Marketplace', x + 210, midY);
    ctx.fillText('• Digital Craft Passports', x + 210, midY + 40);
    ctx.fillText('• Multilingual Story Audio', x + 210, midY + 80);

    // Right: Artisan Mode
    ctx.fillStyle = 'rgba(124, 58, 237, 0.15)';
    ctx.beginPath();
    ctx.roundRect(x + w - 370, midY - 140, 320, 280, 20);
    ctx.fill();
    ctx.strokeStyle = '#8B5CF6';
    ctx.stroke();

    ctx.fillStyle = '#A78BFA';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('ARTISAN MODE', x + w - 210, midY - 90);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px sans-serif';
    ctx.fillText('• AI Voice Product Creator', x + w - 210, midY - 40);
    ctx.fillText('• AI Fair Price Advisor', x + w - 210, midY);
    ctx.fillText('• AI Image Studio Deblur', x + w - 210, midY + 40);
    ctx.fillText('• Cross-Craft Collaboration', x + w - 210, midY + 80);

    ctx.textAlign = 'left';
  }

  private renderCustomerMapVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number
  ) {
    // Map Simulation Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(x, y, w, h);

    // Left: Selected State Card: Telangana
    ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
    ctx.beginPath();
    ctx.roundRect(x + 50, y + 40, 440, 360, 16);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('SELECTED STATE / REGION', x + 80, y + 80);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 30px serif';
    ctx.fillText('Telangana', x + 80, y + 125);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '18px sans-serif';
    ctx.fillText('Pochampally Double Ikat (Telia Rumal)', x + 80, y + 165);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Master Artisan: Gaddam Lakshmi Devi', x + 80, y + 205);
    ctx.fillText('GI Tag: GI-2005-TS-0004', x + 80, y + 235);
    ctx.fillText('Technique: Resist Tie & Dye Warp/Weft', x + 80, y + 265);

    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.roundRect(x + 80, y + 300, 220, 44, 10);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('Open Product Detail →', x + 105, y + 328);

    // Right: Product Preview Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(x + 530, y + 40, 460, 360, 16);
    ctx.fill();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 22px serif';
    ctx.fillText('Telia Rumal Double Ikat Royal Silk', x + 560, y + 90);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px sans-serif';
    ctx.fillText('Price: ₹18,900 • 100% Mulberry Silk', x + 560, y + 130);
    ctx.fillText('Organic Dyes: Indigofera + Madder Root', x + 560, y + 160);
    ctx.fillText('Heritage Lineage: 5 Generations of Looms', x + 560, y + 190);

    ctx.fillStyle = '#2563EB';
    ctx.beginPath();
    ctx.roundRect(x + 560, y + 240, 280, 50, 12);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('🛡 View Digital Craft Passport', x + 580, y + 272);
  }

  private renderPassportVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    // Official Certificate Card
    ctx.fillStyle = 'rgba(37, 99, 235, 0.08)';
    ctx.beginPath();
    ctx.roundRect(x + 80, y + 30, w - 160, 380, 20);
    ctx.fill();
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#3B82F6';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('GOVERNMENT OF INDIA • GI REGISTRY CERTIFIED', x + 120, y + 75);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px serif';
    ctx.fillText('Digital Craft Passport: Pochampally Double Ikat', x + 120, y + 115);

    const specs = [
      { k: 'Master Artisan', v: 'Gaddam Lakshmi Devi (Telangana)' },
      { k: 'GI Tag Number', v: 'GI-2005-TS-0004' },
      { k: 'Technique', v: 'Telia Rumal Double Ikat Handloom Weave' },
      { k: 'Materials', v: 'Organic Mulberry Silk, Natural Indigo Dyes' },
      { k: 'Blockchain Verification', v: '0x8f2a9e3b447c19da82bf610091...verified' },
    ];

    specs.forEach((s, idx) => {
      const sy = y + 160 + idx * 42;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.font = '14px sans-serif';
      ctx.fillText(s.k + ':', x + 120, sy);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(s.v, x + 340, sy);
    });

    // QR Badge
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(x + w - 260, y + 70, 140, 140, 12);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('VERIFIED QR', x + w - 190, y + 145);
    ctx.textAlign = 'left';
  }

  private renderArtisanModeVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    // Artisan Studio Dashboard Metrics
    const metrics = [
      { label: 'Total Sales & Royalties', val: '₹1,42,800', change: '+24% this month' },
      { label: 'Active Handloom Orders', val: '8 Orders', change: '2 In Final Finishing' },
      { label: 'Master Artisan Rating', val: '4.95 ★', change: '142 Verified Reviews' },
      { label: 'GI Certification Status', val: 'VERIFIED', change: 'Govt Awardee' },
    ];

    metrics.forEach((m, idx) => {
      const mx = x + 50 + (idx % 2) * 500;
      const my = y + 60 + Math.floor(idx / 2) * 160;

      ctx.fillStyle = 'rgba(124, 58, 237, 0.12)';
      ctx.beginPath();
      ctx.roundRect(mx, my, 460, 130, 16);
      ctx.fill();
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.4)';
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '15px sans-serif';
      ctx.fillText(m.label, mx + 25, my + 38);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(m.val, mx + 25, my + 78);

      ctx.fillStyle = '#34D399';
      ctx.font = '13px sans-serif';
      ctx.fillText(m.change, mx + 25, my + 108);
    });
  }

  private renderVoiceCreatorVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number
  ) {
    // Spoken Audio Bubble
    ctx.fillStyle = 'rgba(5, 150, 105, 0.15)';
    ctx.beginPath();
    ctx.roundRect(x + 50, y + 30, w - 100, 120, 16);
    ctx.fill();
    ctx.strokeStyle = '#059669';
    ctx.stroke();

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('🎙 ARTISAN SPOKEN VOICE INPUT (NATIVE TELUGU / HINDI / ENGLISH):', x + 80, y + 65);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'italic 18px serif';
    ctx.fillText(
      '"Hand-painted Kalamkari cotton dupatta, made using natural dyes and traditional bamboo pen on organic cotton with sacred Tree of Life and peacock motifs. Suggested price is 4800 rupees."',
      x + 80,
      y + 105,
      w - 160
    );

    // AI Structured Entity Extraction Result Cards
    const fields = [
      { label: 'Title', val: 'Hand-Painted Kalamkari Natural Dye Cotton Dupatta' },
      { label: 'Craft Category', val: 'Srikalahasti Kalamkari (GI-2006-AP-0032)' },
      { label: 'Materials', val: '100% Organic Cotton, Fermented Plant Indigo Dyes' },
      { label: 'Technique', val: 'Freehand Bamboo Pen Drawing & Resist Washing' },
      { label: 'Calculated Price', val: '₹4,800 (18 Days Dedicated Artisan Handcrafting)' },
    ];

    fields.forEach((f, idx) => {
      const fy = y + 170 + idx * 45;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.beginPath();
      ctx.roundRect(x + 50, fy, w - 100, 38, 8);
      ctx.fill();

      ctx.fillStyle = '#10B981';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(f.label + ':', x + 70, fy + 24);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      ctx.fillText(f.val, x + 250, fy + 24);
    });
  }

  private renderFairPriceVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number
  ) {
    // Dynamic Fair Price Calculation Model
    ctx.fillStyle = 'rgba(217, 119, 6, 0.1)';
    ctx.beginPath();
    ctx.roundRect(x + 50, y + 30, w - 100, 380, 20);
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.stroke();

    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 24px serif';
    ctx.fillText('Transparent Living-Wage Pricing Model', x + 90, y + 80);

    const rows = [
      { item: 'Indigenous Raw Materials (Pure Katan Silk & Real Silver Zari)', cost: '₹4,500' },
      { item: 'Artisan Loom Labor (25 Handcrafting Days @ ₹750/day living wage)', cost: '₹18,750' },
      { item: 'Geographical Indication (GI) Heritage & Mastery Premium', cost: '₹3,750' },
    ];

    rows.forEach((r, idx) => {
      const ry = y + 130 + idx * 60;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '17px sans-serif';
      ctx.fillText(r.item, x + 90, ry);

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(r.cost, x + w - 90, ry);
      ctx.textAlign = 'left';
    });

    // Total Fair Value
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.roundRect(x + 90, y + 310, w - 180, 70, 12);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('SUGGESTED FAIR LIVING WAGE PRICE:', x + 120, y + 353);

    ctx.font = 'bold 30px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('₹27,000', x + w - 120, y + 356);
    ctx.textAlign = 'left';
  }

  private renderImageStudioVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number
  ) {
    // Before / After Split Screen Simulation
    const splitX = x + (w * 0.5) + Math.sin(t * 1.5) * (w * 0.25);

    // Left: Before (Blurry raw photo)
    ctx.fillStyle = '#262626';
    ctx.fillRect(x + 40, y + 30, w - 80, h - 60);

    ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('BEFORE (Raw Smartphone Camera)', x + 70, y + 75);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '16px sans-serif';
    ctx.fillText('Blurry focus • Dim workshop lighting • Noise', x + 70, y + 110);

    // Right: Enhanced area
    ctx.save();
    ctx.beginPath();
    ctx.rect(splitX, y + 30, x + w - 40 - splitX, h - 60);
    ctx.clip();

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 40, y + 30, w - 80, h - 60);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('AFTER (DesiCraft AI Deblur & Color Luster)', splitX + 30, y + 75);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px sans-serif';
    ctx.fillText('+60% Sharpness Gain • Color Restoration • Studio Ready', splitX + 30, y + 110);
    ctx.restore();

    // Split Line Divider
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(splitX, y + 30);
    ctx.lineTo(splitX, y + h - 30);
    ctx.stroke();

    // Handle button
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(splitX, y + h / 2, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⇋', splitX, y + h / 2 + 5);
    ctx.textAlign = 'left';
  }

  private renderCollaborationVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number
  ) {
    // Seller-to-Seller Private Chat Simulation
    ctx.fillStyle = 'rgba(2, 132, 199, 0.1)';
    ctx.beginPath();
    ctx.roundRect(x + 50, y + 30, w - 100, 380, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(2, 132, 199, 0.4)';
    ctx.stroke();

    // Header of Chat
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('🤝 Craft Fusion Collaboration: Kadwa Silk & Pochampally Ikat', x + 80, y + 70);

    // Message 1 (Lakshmi Devi)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.roundRect(x + 80, y + 100, 520, 75, 12);
    ctx.fill();
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Gaddam Lakshmi Devi (Telangana):', x + 100, y + 125);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px sans-serif';
    ctx.fillText('Namaskaram! I tied warp clusters for chevron borders with natural indigo.', x + 100, y + 152);

    // Message 2: Location Card Attachment
    ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
    ctx.beginPath();
    ctx.roundRect(x + 80, y + 190, 520, 85, 12);
    ctx.fill();
    ctx.strokeStyle = '#3B82F6';
    ctx.stroke();
    ctx.fillStyle = '#60A5FA';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('📍 WORKSHOP LOCATION ATTACHMENT:', x + 100, y + 215);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px sans-serif';
    ctx.fillText('Pochampally Ikat Weavers Colony, Telangana (17.3486° N, 78.8184° E)', x + 100, y + 240);

    // Message 3: File Attachment & Unsend Action
    ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
    ctx.beginPath();
    ctx.roundRect(x + 80, y + 290, 520, 85, 12);
    ctx.fill();
    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('📎 FILE ATTACHED: Kadwa_Zari_Border_Draft.png (1.8 MB)', x + 100, y + 318);
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('🗑 Unsend / Delete Message action enabled', x + 100, y + 348);
  }

  private renderOpportunitiesVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const schemes = [
      { name: 'PM Vishwakarma Scheme', desc: '₹3,00,000 collateral-free credit @ 5% + ₹15,000 toolkit voucher' },
      { name: 'ODOP Export Incentive Scheme', desc: 'Direct market exposure & 50% air-cargo freight subsidy' },
      { name: 'Surajkund International Crafts Mela', desc: 'Complimentary state-sponsored artisan sales pavilion' },
    ];

    schemes.forEach((s, idx) => {
      const sy = y + 50 + idx * 115;
      ctx.fillStyle = 'rgba(234, 88, 12, 0.12)';
      ctx.beginPath();
      ctx.roundRect(x + 50, sy, w - 100, 95, 14);
      ctx.fill();
      ctx.strokeStyle = '#EA580C';
      ctx.stroke();

      ctx.fillStyle = '#FB923C';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(s.name, x + 80, sy + 38);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '15px sans-serif';
      ctx.fillText(s.desc, x + 80, sy + 70);
    });
  }

  private renderMultilingualVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number
  ) {
    const langs = [
      { en: 'Hindi', native: 'हिन्दी' },
      { en: 'Telugu', native: 'తెలుగు' },
      { en: 'Tamil', native: 'தமிழ்' },
      { en: 'Kannada', native: 'ಕನ್ನಡ' },
      { en: 'Malayalam', native: 'മലയാളം' },
      { en: 'Marathi', native: 'मराठी' },
      { en: 'Bengali', native: 'বাংলা' },
      { en: 'Gujarati', native: 'ગુજરાતી' },
      { en: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
      { en: 'English', native: 'English' },
    ];

    langs.forEach((l, idx) => {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      const lx = x + 50 + col * 190;
      const ly = y + 90 + row * 140;

      ctx.fillStyle = 'rgba(13, 148, 136, 0.18)';
      ctx.beginPath();
      ctx.roundRect(lx, ly, 175, 110, 14);
      ctx.fill();
      ctx.strokeStyle = '#14B8A6';
      ctx.stroke();

      ctx.fillStyle = '#2DD4BF';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.fillText(l.native, lx + 87, ly + 50);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      ctx.fillText(l.en, lx + 87, ly + 85);
      ctx.textAlign = 'left';
    });
  }

  private renderFinalImpactVisual(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    t: number
  ) {
    ctx.fillStyle = 'rgba(217, 119, 6, 0.12)';
    ctx.beginPath();
    ctx.roundRect(x + 50, y + 40, w - 100, 360, 20);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('THE COMPLETE ARTISAN TECHNOLOGY ECOSYSTEM', x + w / 2, y + 100);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px serif';
    ctx.fillText('"Where Heritage is Discovered, Artisans are Empowered,', x + w / 2, y + 160);
    ctx.fillText('Technology Removes Barriers, and Creators Grow Together."', x + w / 2, y + 210);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('DESICRAFT • SMART INDIA HACKATHON', x + w / 2, y + 300);
    ctx.textAlign = 'left';
  }
}

export const demoVideoRecorder = new DemoVideoRecorder();
