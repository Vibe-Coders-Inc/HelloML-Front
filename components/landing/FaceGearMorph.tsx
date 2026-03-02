'use client';

import { useRef, useEffect, useCallback } from 'react';

/**
 * Particle system: ~200 dots form a human face profile,
 * then snap into a precise gear/circuit formation.
 * Canvas-based for performance, anime.js-free (requestAnimationFrame).
 */

// Generate face profile points (detailed side profile with features)
function generateFacePoints(cx: number, cy: number, count: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const scale = 0.85;

  // Head outline (elliptical, side profile shape)
  const headPoints = Math.floor(count * 0.35);
  for (let i = 0; i < headPoints; i++) {
    const t = (i / headPoints) * Math.PI * 2;
    const rx = 65 * scale;
    const ry = 80 * scale;
    // Slightly flatten the back of the head
    const xMod = Math.cos(t) < -0.3 ? 0.85 : 1;
    points.push({
      x: cx + Math.cos(t) * rx * xMod + (Math.random() - 0.5) * 3,
      y: cy + Math.sin(t) * ry + (Math.random() - 0.5) * 3,
    });
  }

  // Eye (left, detailed - circle of dots)
  const eyePoints = Math.floor(count * 0.06);
  for (let i = 0; i < eyePoints; i++) {
    const t = (i / eyePoints) * Math.PI * 2;
    const r = 8 * scale;
    points.push({
      x: cx - 18 * scale + Math.cos(t) * r,
      y: cy - 18 * scale + Math.sin(t) * r,
    });
  }

  // Eye pupil
  const pupilPoints = Math.floor(count * 0.03);
  for (let i = 0; i < pupilPoints; i++) {
    const t = (i / pupilPoints) * Math.PI * 2;
    const r = 3 * scale;
    points.push({
      x: cx - 18 * scale + Math.cos(t) * r,
      y: cy - 18 * scale + Math.sin(t) * r,
    });
  }

  // Eye (right)
  for (let i = 0; i < eyePoints; i++) {
    const t = (i / eyePoints) * Math.PI * 2;
    const r = 8 * scale;
    points.push({
      x: cx + 18 * scale + Math.cos(t) * r,
      y: cy - 18 * scale + Math.sin(t) * r,
    });
  }

  // Right pupil
  for (let i = 0; i < pupilPoints; i++) {
    const t = (i / pupilPoints) * Math.PI * 2;
    const r = 3 * scale;
    points.push({
      x: cx + 18 * scale + Math.cos(t) * r,
      y: cy - 18 * scale + Math.sin(t) * r,
    });
  }

  // Eyebrows
  const browPoints = Math.floor(count * 0.04);
  for (let i = 0; i < browPoints; i++) {
    const t = i / browPoints;
    points.push({
      x: cx - 28 * scale + t * 20 * scale,
      y: cy - 32 * scale - Math.sin(t * Math.PI) * 4 * scale,
    });
    points.push({
      x: cx + 8 * scale + t * 20 * scale,
      y: cy - 32 * scale - Math.sin(t * Math.PI) * 4 * scale,
    });
  }

  // Nose
  const nosePoints = Math.floor(count * 0.04);
  for (let i = 0; i < nosePoints; i++) {
    const t = i / nosePoints;
    points.push({
      x: cx + Math.sin(t * Math.PI) * 6 * scale,
      y: cy - 8 * scale + t * 22 * scale,
    });
  }

  // Mouth (smile curve)
  const mouthPoints = Math.floor(count * 0.05);
  for (let i = 0; i < mouthPoints; i++) {
    const t = (i / mouthPoints) * Math.PI;
    points.push({
      x: cx - 16 * scale + (t / Math.PI) * 32 * scale,
      y: cy + 28 * scale + Math.sin(t) * 6 * scale,
    });
  }

  // Upper lip
  for (let i = 0; i < Math.floor(count * 0.03); i++) {
    const t = i / Math.floor(count * 0.03);
    points.push({
      x: cx - 16 * scale + t * 32 * scale,
      y: cy + 28 * scale - Math.sin(t * Math.PI) * 2 * scale,
    });
  }

  // Jaw line
  const jawPoints = Math.floor(count * 0.06);
  for (let i = 0; i < jawPoints; i++) {
    const t = i / jawPoints;
    const angle = Math.PI * 0.3 + t * Math.PI * 0.4;
    points.push({
      x: cx + Math.cos(angle) * 60 * scale,
      y: cy + Math.sin(angle) * 75 * scale,
    });
  }

  // Neural/organic scatter (brain area, top of head)
  const neuralPoints = Math.floor(count * 0.15);
  for (let i = 0; i < neuralPoints; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 45 * scale;
    const px = cx + Math.cos(angle) * r;
    const py = cy - 30 * scale + Math.sin(angle) * r * 0.6;
    // Only keep points inside the head
    const dx = (px - cx) / (65 * scale);
    const dy = (py - cy) / (80 * scale);
    if (dx * dx + dy * dy < 0.85) {
      points.push({ x: px, y: py });
    }
  }

  // Fill remaining
  while (points.length < count) {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 50 * scale;
    points.push({
      x: cx + Math.cos(angle) * r + (Math.random() - 0.5) * 10,
      y: cy + Math.sin(angle) * r * 0.8 + (Math.random() - 0.5) * 10,
    });
  }

  return points.slice(0, count);
}

// Generate gear points (detailed mechanical gear with teeth and internal structure)
function generateGearPoints(cx: number, cy: number, count: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const scale = 0.85;

  // Outer gear teeth (detailed)
  const teeth = 16;
  const outerR = 75 * scale;
  const innerR = 60 * scale;
  const toothPoints = Math.floor(count * 0.35);
  for (let i = 0; i < toothPoints; i++) {
    const t = (i / toothPoints) * Math.PI * 2;
    const toothPhase = Math.floor((t / (Math.PI * 2)) * teeth * 2) % 2;
    const r = toothPhase === 0 ? outerR : innerR;
    const jitter = (Math.random() - 0.5) * 1.5;
    points.push({
      x: cx + Math.cos(t) * (r + jitter),
      y: cy + Math.sin(t) * (r + jitter),
    });
  }

  // Inner ring
  const innerRingPoints = Math.floor(count * 0.12);
  for (let i = 0; i < innerRingPoints; i++) {
    const t = (i / innerRingPoints) * Math.PI * 2;
    points.push({
      x: cx + Math.cos(t) * 35 * scale,
      y: cy + Math.sin(t) * 35 * scale,
    });
  }

  // Center hub
  const hubPoints = Math.floor(count * 0.08);
  for (let i = 0; i < hubPoints; i++) {
    const t = (i / hubPoints) * Math.PI * 2;
    points.push({
      x: cx + Math.cos(t) * 12 * scale,
      y: cy + Math.sin(t) * 12 * scale,
    });
  }

  // Spokes (6 spokes connecting hub to inner ring)
  const spokeCount = 6;
  const spokePoints = Math.floor(count * 0.12);
  const perSpoke = Math.floor(spokePoints / spokeCount);
  for (let s = 0; s < spokeCount; s++) {
    const angle = (s / spokeCount) * Math.PI * 2;
    for (let i = 0; i < perSpoke; i++) {
      const t = i / perSpoke;
      const r = 12 * scale + t * 23 * scale;
      points.push({
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
      });
    }
  }

  // Circuit nodes (small dots at intersections)
  const nodePositions = [
    [0.5, -0.3], [-0.5, -0.3], [0.3, 0.5], [-0.3, 0.5],
    [0.45, 0], [-0.45, 0], [0, 0.45], [0, -0.45],
  ];
  const circuitPoints = Math.floor(count * 0.06);
  const perNode = Math.floor(circuitPoints / nodePositions.length);
  for (const [nx, ny] of nodePositions) {
    for (let i = 0; i < perNode; i++) {
      const t = (i / perNode) * Math.PI * 2;
      const r = 3 * scale;
      points.push({
        x: cx + nx * 55 * scale + Math.cos(t) * r,
        y: cy + ny * 55 * scale + Math.sin(t) * r,
      });
    }
  }

  // Circuit traces (connecting lines between nodes)
  const tracePoints = Math.floor(count * 0.1);
  const traces = [
    [[0.5, -0.3], [0.45, 0]],
    [[-0.5, -0.3], [-0.45, 0]],
    [[0.45, 0], [0.3, 0.5]],
    [[-0.45, 0], [-0.3, 0.5]],
    [[0, -0.45], [0.5, -0.3]],
    [[0, -0.45], [-0.5, -0.3]],
    [[0, 0.45], [0.3, 0.5]],
    [[0, 0.45], [-0.3, 0.5]],
  ];
  const perTrace = Math.floor(tracePoints / traces.length);
  for (const [start, end] of traces) {
    for (let i = 0; i < perTrace; i++) {
      const t = i / perTrace;
      points.push({
        x: cx + (start[0] + (end[0] - start[0]) * t) * 55 * scale,
        y: cy + (start[1] + (end[1] - start[1]) * t) * 55 * scale,
      });
    }
  }

  // Small detail dots scattered in gaps
  while (points.length < count) {
    const angle = Math.random() * Math.PI * 2;
    const r = 15 * scale + Math.random() * 55 * scale;
    points.push({
      x: cx + Math.cos(angle) * r + (Math.random() - 0.5) * 4,
      y: cy + Math.sin(angle) * r + (Math.random() - 0.5) * 4,
    });
  }

  return points.slice(0, count);
}

const PARTICLE_COUNT = 220;
const SIZE = 280;
const CENTER = SIZE / 2;

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
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    const faceTargets = generateFacePoints(CENTER, CENTER, PARTICLE_COUNT);
    const gearTargets = generateGearPoints(CENTER, CENTER, PARTICLE_COUNT);

    // Current particle positions (start scattered)
    const particles = faceTargets.map((p) => ({
      x: p.x + (Math.random() - 0.5) * 200,
      y: p.y + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
      size: 1.2 + Math.random() * 1.8,
      alpha: 0.4 + Math.random() * 0.6,
      // Organic sway for face mode
      swayPhase: Math.random() * Math.PI * 2,
      swayAmp: 0.3 + Math.random() * 0.8,
    }));

    // Connections (for gear mode - circuit lines)
    const connections: [number, number][] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = gearTargets[i].x - gearTargets[j].x;
        const dy = gearTargets[i].y - gearTargets[j].y;
        if (dx * dx + dy * dy < 400) { // distance < 20
          connections.push([i, j]);
        }
      }
    }

    let morphProgress = 0; // 0 = face, 1 = gear
    let morphDirection = 1;
    let holdTimer = 0;
    const holdDuration = 90; // frames to hold at each state
    const morphSpeed = 0.008;
    let gearRotation = 0;
    let time = 0;

    const loop = () => {
      if (!visibleRef.current) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      time++;
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Update morph
      if (holdTimer > 0) {
        holdTimer--;
      } else {
        morphProgress += morphSpeed * morphDirection;
        if (morphProgress >= 1) {
          morphProgress = 1;
          morphDirection = -1;
          holdTimer = holdDuration;
        } else if (morphProgress <= 0) {
          morphProgress = 0;
          morphDirection = 1;
          holdTimer = holdDuration;
        }
      }

      // Smooth easing
      const ease = morphProgress < 0.5
        ? 4 * morphProgress * morphProgress * morphProgress
        : 1 - Math.pow(-2 * morphProgress + 2, 3) / 2;

      // Gear rotation (only when in gear mode)
      gearRotation += ease * 0.003;

      // Update particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        const face = faceTargets[i];
        const gear = gearTargets[i];

        // Rotate gear target around center
        const gx = gear.x - CENTER;
        const gy = gear.y - CENTER;
        const cos = Math.cos(gearRotation);
        const sin = Math.sin(gearRotation);
        const rotatedGearX = CENTER + gx * cos - gy * sin;
        const rotatedGearY = CENTER + gx * sin + gy * cos;

        // Lerp target
        const targetX = face.x * (1 - ease) + rotatedGearX * ease;
        const targetY = face.y * (1 - ease) + rotatedGearY * ease;

        // Organic sway (only in face mode)
        const sway = (1 - ease) * Math.sin(time * 0.02 + p.swayPhase) * p.swayAmp;

        // Spring physics toward target
        const dx = targetX + sway - p.x;
        const dy = targetY + sway * 0.7 - p.y;
        p.vx += dx * 0.08;
        p.vy += dy * 0.08;
        p.vx *= 0.85;
        p.vy *= 0.85;
        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw connections (fade in with gear mode)
      if (ease > 0.1) {
        ctx.strokeStyle = `rgba(139, 111, 71, ${ease * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (const [a, b] of connections) {
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
        }
        ctx.stroke();
      }

      // Draw particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Color shifts: warm brown for face, golden for gear
        const r = Math.round(139 + ease * 30);
        const g = Math.round(111 + ease * 10);
        const b = Math.round(71 - ease * 10);

        // Size: slightly larger in gear mode for mechanical feel
        const size = p.size * (1 + ease * 0.4);

        // Shape: round for face, slightly square for gear
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * (0.6 + ease * 0.4)})`;

        if (ease > 0.6) {
          // Square-ish particles in gear mode
          const squareness = (ease - 0.6) * 2.5; // 0 to 1
          const s = size * (1 + squareness * 0.3);
          const cornerRadius = s * (1 - squareness * 0.7);
          ctx.beginPath();
          ctx.roundRect(p.x - s, p.y - s, s * 2, s * 2, cornerRadius);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Glow effect at center
      const gradient = ctx.createRadialGradient(CENTER, CENTER, 0, CENTER, CENTER, 30);
      gradient.addColorStop(0, `rgba(139, 111, 71, ${0.08 + ease * 0.08})`);
      gradient.addColorStop(1, 'rgba(139, 111, 71, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, 30, 0, Math.PI * 2);
      ctx.fill();

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
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
    <div className="flex justify-center mt-8 mb-4">
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE }}
        className="opacity-80"
      />
    </div>
  );
}
