'use client';

import { useRef, useEffect, useCallback } from 'react';

/**
 * HumanMachineVisual: Bold split graphic.
 * Left: warm organic flowing shapes (human/voice).
 * Right: precise geometric circuit grid (machine).
 * They blend in the center. Rich gradients, large, eye-catching.
 */

const WIDTH = 600;
const HEIGHT = 220;

// Perlin-ish noise for organic shapes
function createNoise() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number) => {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return (x: number, y: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = perm[perm[X] + Y];
    const ab = perm[perm[X] + Y + 1];
    const ba = perm[perm[X + 1] + Y];
    const bb = perm[perm[X + 1] + Y + 1];
    return lerp(lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u), lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u), v);
  };
}

export function FaceGearMorph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef(false);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = WIDTH * dpr;
    canvas.height = HEIGHT * dpr;
    ctx.scale(dpr, dpr);

    const noise = createNoise();
    let time = 0;

    // Pre-generate circuit grid points
    const gridCols = 12;
    const gridRows = 5;
    const gridStartX = WIDTH * 0.52;
    const gridW = WIDTH * 0.44;
    const gridH = HEIGHT * 0.75;
    const gridOffY = HEIGHT * 0.12;

    interface GridNode {
      x: number;
      y: number;
      connections: number[];
      pulsePhase: number;
      size: number;
    }

    const gridNodes: GridNode[] = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const x = gridStartX + (c / (gridCols - 1)) * gridW;
        const y = gridOffY + (r / (gridRows - 1)) * gridH;
        const connections: number[] = [];
        const idx = r * gridCols + c;
        if (c > 0) connections.push(idx - 1);
        if (r > 0) connections.push(idx - gridCols);
        // Some diagonal connections for visual interest
        if (c > 0 && r > 0 && Math.random() > 0.6) connections.push(idx - gridCols - 1);
        if (c < gridCols - 1 && r > 0 && Math.random() > 0.7) connections.push(idx - gridCols + 1);
        gridNodes.push({
          x, y,
          connections,
          pulsePhase: Math.random() * Math.PI * 2,
          size: 2 + Math.random() * 2,
        });
      }
    }

    // Pulse particles traveling along connections
    interface Pulse {
      fromNode: number;
      toNode: number;
      progress: number;
      speed: number;
      color: string;
    }
    let pulses: Pulse[] = [];
    const pulseColors = [
      'rgba(139, 111, 71, 0.9)',
      'rgba(166, 122, 91, 0.9)',
      'rgba(200, 160, 100, 0.8)',
      'rgba(220, 180, 120, 0.7)',
    ];

    // Organic blobs config
    const blobs = [
      { cx: WIDTH * 0.18, cy: HEIGHT * 0.4, r: 55, color1: '#C4956A', color2: '#8B6F47', speed: 0.008, offset: 0 },
      { cx: WIDTH * 0.12, cy: HEIGHT * 0.55, r: 40, color1: '#D4A574', color2: '#A67A5B', speed: 0.01, offset: 2 },
      { cx: WIDTH * 0.28, cy: HEIGHT * 0.35, r: 35, color1: '#B8956E', color2: '#7A6040', speed: 0.012, offset: 4 },
      { cx: WIDTH * 0.22, cy: HEIGHT * 0.65, r: 30, color1: '#DEB887', color2: '#8B6F47', speed: 0.009, offset: 6 },
      { cx: WIDTH * 0.08, cy: HEIGHT * 0.35, r: 28, color1: '#C9A882', color2: '#9B7B52', speed: 0.011, offset: 8 },
    ];

    // Voice waveform bars
    const waveCount = 18;
    const waveStartX = WIDTH * 0.05;
    const waveWidth = WIDTH * 0.38;

    const loop = () => {
      if (!visibleRef.current) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      time += 0.016;
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // === LEFT SIDE: Organic voice shapes ===

      // Flowing blobs with noise deformation
      for (const blob of blobs) {
        ctx.save();
        const points = 80;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const n = noise(
            Math.cos(angle) * 1.5 + blob.offset,
            Math.sin(angle) * 1.5 + time * blob.speed * 60
          );
          const r = blob.r + n * 18;
          const x = blob.cx + Math.cos(angle) * r;
          const y = blob.cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        const grad = ctx.createRadialGradient(blob.cx, blob.cy, 0, blob.cx, blob.cy, blob.r * 1.3);
        grad.addColorStop(0, blob.color1 + '60');
        grad.addColorStop(0.6, blob.color2 + '35');
        grad.addColorStop(1, blob.color2 + '00');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      // Voice waveform visualization
      ctx.save();
      for (let i = 0; i < waveCount; i++) {
        const x = waveStartX + (i / (waveCount - 1)) * waveWidth;
        const baseHeight = 15 + Math.sin(i * 0.5 + time * 2) * 12;
        const noiseVal = noise(i * 0.3, time * 1.5);
        const h = baseHeight + noiseVal * 20;
        const alpha = 0.2 + (h / 50) * 0.4;

        const barGrad = ctx.createLinearGradient(x, HEIGHT / 2 - h, x, HEIGHT / 2 + h);
        barGrad.addColorStop(0, `rgba(196, 149, 106, ${alpha})`);
        barGrad.addColorStop(0.5, `rgba(139, 111, 71, ${alpha + 0.15})`);
        barGrad.addColorStop(1, `rgba(196, 149, 106, ${alpha})`);

        ctx.fillStyle = barGrad;
        const barW = (waveWidth / waveCount) * 0.5;
        ctx.beginPath();
        ctx.roundRect(x - barW / 2, HEIGHT / 2 - h, barW, h * 2, barW / 2);
        ctx.fill();
      }
      ctx.restore();

      // Floating organic particles on left
      ctx.save();
      for (let i = 0; i < 25; i++) {
        const px = WIDTH * 0.05 + noise(i * 0.7, time * 0.3) * WIDTH * 0.35;
        const py = HEIGHT * 0.15 + noise(i * 0.7 + 100, time * 0.3) * HEIGHT * 0.7;
        const size = 1 + noise(i * 0.5, time * 0.2) * 2;
        const alpha = 0.15 + noise(i * 0.3, time * 0.5) * 0.25;
        ctx.fillStyle = `rgba(139, 111, 71, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // === CENTER BLEND: gradient fade ===
      const blendGrad = ctx.createLinearGradient(WIDTH * 0.38, 0, WIDTH * 0.55, 0);
      blendGrad.addColorStop(0, 'rgba(250, 248, 243, 0)');
      blendGrad.addColorStop(0.4, 'rgba(250, 248, 243, 0.6)');
      blendGrad.addColorStop(0.6, 'rgba(250, 248, 243, 0.6)');
      blendGrad.addColorStop(1, 'rgba(250, 248, 243, 0)');
      ctx.fillStyle = blendGrad;
      ctx.fillRect(WIDTH * 0.38, 0, WIDTH * 0.17, HEIGHT);

      // Center divider line (subtle)
      ctx.save();
      ctx.strokeStyle = 'rgba(139, 111, 71, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(WIDTH * 0.48, HEIGHT * 0.1);
      ctx.lineTo(WIDTH * 0.48, HEIGHT * 0.9);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // === RIGHT SIDE: Circuit grid ===

      // Grid connections
      ctx.save();
      for (let i = 0; i < gridNodes.length; i++) {
        const node = gridNodes[i];
        for (const ci of node.connections) {
          const target = gridNodes[ci];
          // Fade based on x position (more visible toward right)
          const avgX = (node.x + target.x) / 2;
          const fadeIn = Math.min(1, Math.max(0, (avgX - WIDTH * 0.5) / (WIDTH * 0.3)));
          ctx.strokeStyle = `rgba(139, 111, 71, ${0.08 + fadeIn * 0.12})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }

      // Grid nodes with pulse
      for (let i = 0; i < gridNodes.length; i++) {
        const node = gridNodes[i];
        const fadeIn = Math.min(1, Math.max(0, (node.x - WIDTH * 0.5) / (WIDTH * 0.3)));
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.5 + 0.5;
        const size = node.size * (0.8 + pulse * 0.4);
        const alpha = (0.2 + fadeIn * 0.5) * (0.6 + pulse * 0.4);

        // Glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 3);
        glow.addColorStop(0, `rgba(200, 160, 100, ${alpha * 0.3})`);
        glow.addColorStop(1, 'rgba(200, 160, 100, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node dot
        ctx.fillStyle = `rgba(139, 111, 71, ${alpha})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = `rgba(220, 190, 140, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Traveling pulses along connections
      if (Math.random() < 0.08) {
        const startIdx = Math.floor(Math.random() * gridNodes.length);
        const node = gridNodes[startIdx];
        if (node.connections.length > 0) {
          const toIdx = node.connections[Math.floor(Math.random() * node.connections.length)];
          pulses.push({
            fromNode: startIdx,
            toNode: toIdx,
            progress: 0,
            speed: 0.01 + Math.random() * 0.02,
            color: pulseColors[Math.floor(Math.random() * pulseColors.length)],
          });
        }
      }

      ctx.save();
      pulses = pulses.filter(p => {
        p.progress += p.speed;
        if (p.progress >= 1) return false;
        const from = gridNodes[p.fromNode];
        const to = gridNodes[p.toNode];
        const x = from.x + (to.x - from.x) * p.progress;
        const y = from.y + (to.y - from.y) * p.progress;
        const alpha = Math.sin(p.progress * Math.PI);

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 6);
        glow.addColorStop(0, p.color);
        glow.addColorStop(1, 'rgba(139, 111, 71, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255, 230, 180, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });
      ctx.restore();

      // Data text fragments floating on right side
      ctx.save();
      ctx.font = '9px monospace';
      const dataTexts = ['01', '10', '>>>', '...', '110', '0x4F', 'ACK'];
      for (let i = 0; i < 8; i++) {
        const px = WIDTH * 0.6 + noise(i * 1.3, time * 0.15) * WIDTH * 0.35;
        const py = HEIGHT * 0.1 + noise(i * 1.3 + 50, time * 0.15) * HEIGHT * 0.8;
        const alpha = 0.06 + noise(i * 0.8, time * 0.3) * 0.08;
        ctx.fillStyle = `rgba(139, 111, 71, ${alpha})`;
        ctx.fillText(dataTexts[i % dataTexts.length], px, py);
      }
      ctx.restore();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0.2 }
    );
    observer.observe(canvas);
    draw();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <div className="flex justify-center my-6 w-full">
      <canvas
        ref={canvasRef}
        style={{ width: WIDTH, height: HEIGHT, maxWidth: '100%' }}
      />
    </div>
  );
}
