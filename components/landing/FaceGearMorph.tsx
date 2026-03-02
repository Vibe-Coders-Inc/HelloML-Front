'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const vp = { once: true, margin: '-50px' as const };

/**
 * Clean line-art face that morphs into a detailed gear.
 * Both shapes drawn as connected stroke paths on canvas.
 * Large, bold, unmistakable.
 */

const SIZE = 360;
const CX = SIZE / 2;
const CY = SIZE / 2;

// Generate points along a path for smooth morphing
// Both shapes MUST have the same total point count

function generateFacePoints(): { x: number; y: number }[][] {
  const paths: { x: number; y: number }[][] = [];

  // 1. Head outline (oval) — 120 points
  const head: { x: number; y: number }[] = [];
  for (let i = 0; i < 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    head.push({
      x: CX + Math.cos(t) * 110,
      y: CY + Math.sin(t) * 130,
    });
  }
  paths.push(head);

  // 2. Left eye — 40 points (almond shape)
  const leftEye: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const rx = 22;
    const ry = 10;
    // Almond: pinch at ends
    const squeeze = Math.pow(Math.cos(t), 2) * 0.3;
    leftEye.push({
      x: CX - 38 + Math.cos(t) * rx,
      y: CY - 25 + Math.sin(t) * (ry - squeeze * ry),
    });
  }
  paths.push(leftEye);

  // 3. Left pupil — 20 points
  const leftPupil: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    leftPupil.push({
      x: CX - 38 + Math.cos(t) * 8,
      y: CY - 25 + Math.sin(t) * 8,
    });
  }
  paths.push(leftPupil);

  // 4. Right eye — 40 points
  const rightEye: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const rx = 22;
    const ry = 10;
    const squeeze = Math.pow(Math.cos(t), 2) * 0.3;
    rightEye.push({
      x: CX + 38 + Math.cos(t) * rx,
      y: CY - 25 + Math.sin(t) * (ry - squeeze * ry),
    });
  }
  paths.push(rightEye);

  // 5. Right pupil — 20 points
  const rightPupil: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    rightPupil.push({
      x: CX + 38 + Math.cos(t) * 8,
      y: CY - 25 + Math.sin(t) * 8,
    });
  }
  paths.push(rightPupil);

  // 6. Left eyebrow — 30 points (arc)
  const leftBrow: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    leftBrow.push({
      x: CX - 58 + t * 44,
      y: CY - 48 - Math.sin(t * Math.PI) * 10,
    });
  }
  paths.push(leftBrow);

  // 7. Right eyebrow — 30 points
  const rightBrow: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    rightBrow.push({
      x: CX + 14 + t * 44,
      y: CY - 48 - Math.sin(t * Math.PI) * 10,
    });
  }
  paths.push(rightBrow);

  // 8. Nose — 30 points (vertical line curving at bottom)
  const nose: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const curve = t > 0.7 ? Math.sin((t - 0.7) / 0.3 * Math.PI) * 8 : 0;
    nose.push({
      x: CX + curve,
      y: CY - 12 + t * 40,
    });
  }
  paths.push(nose);

  // 9. Mouth — 40 points (smile)
  const mouth: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = i / 39;
    mouth.push({
      x: CX - 30 + t * 60,
      y: CY + 50 + Math.sin(t * Math.PI) * 12,
    });
  }
  paths.push(mouth);

  // 10. Upper lip detail — 30 points
  const upperLip: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    // Cupid's bow shape
    const bow = Math.abs(t - 0.5) < 0.15 ? -4 : 0;
    upperLip.push({
      x: CX - 28 + t * 56,
      y: CY + 48 + bow + Math.sin(t * Math.PI) * 2,
    });
  }
  paths.push(upperLip);

  return paths;
}

function generateGearPoints(): { x: number; y: number }[][] {
  const paths: { x: number; y: number }[][] = [];

  // 1. Outer gear ring with teeth — 120 points (matches head)
  const teeth = 20;
  const outerR = 130;
  const innerR = 105;
  const toothWidth = 0.35; // how much of each tooth period is the flat top
  const outer: { x: number; y: number }[] = [];
  for (let i = 0; i < 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const toothPhase = ((t / (Math.PI * 2)) * teeth) % 1;
    let r: number;
    if (toothPhase < toothWidth) {
      r = outerR; // tooth top
    } else if (toothPhase < toothWidth + 0.1) {
      // falling edge
      const edge = (toothPhase - toothWidth) / 0.1;
      r = outerR - edge * (outerR - innerR);
    } else if (toothPhase < 1 - 0.1) {
      r = innerR; // valley
    } else {
      // rising edge
      const edge = (toothPhase - (1 - 0.1)) / 0.1;
      r = innerR + edge * (outerR - innerR);
    }
    outer.push({
      x: CX + Math.cos(t) * r,
      y: CY + Math.sin(t) * r,
    });
  }
  paths.push(outer);

  // 2. Inner ring 1 — 40 points (matches left eye)
  const ring1: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    ring1.push({
      x: CX + Math.cos(t) * 72,
      y: CY + Math.sin(t) * 72,
    });
  }
  paths.push(ring1);

  // 3. Inner ring 2 — 20 points (matches left pupil)
  const ring2: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    ring2.push({
      x: CX + Math.cos(t) * 60,
      y: CY + Math.sin(t) * 60,
    });
  }
  paths.push(ring2);

  // 4. Center hub ring — 40 points (matches right eye)
  const hub: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    hub.push({
      x: CX + Math.cos(t) * 28,
      y: CY + Math.sin(t) * 28,
    });
  }
  paths.push(hub);

  // 5. Center hole — 20 points (matches right pupil)
  const hole: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    hole.push({
      x: CX + Math.cos(t) * 12,
      y: CY + Math.sin(t) * 12,
    });
  }
  paths.push(hole);

  // 6. Spoke 1 — 30 points (matches left brow)
  const spoke1: { x: number; y: number }[] = [];
  const s1Angle = 0;
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const r = 28 + t * 44;
    spoke1.push({
      x: CX + Math.cos(s1Angle) * r,
      y: CY + Math.sin(s1Angle) * r,
    });
  }
  paths.push(spoke1);

  // 7. Spoke 2 — 30 points (matches right brow)
  const spoke2: { x: number; y: number }[] = [];
  const s2Angle = Math.PI * 2 / 3;
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const r = 28 + t * 44;
    spoke2.push({
      x: CX + Math.cos(s2Angle) * r,
      y: CY + Math.sin(s2Angle) * r,
    });
  }
  paths.push(spoke2);

  // 8. Spoke 3 — 30 points (matches nose)
  const spoke3: { x: number; y: number }[] = [];
  const s3Angle = Math.PI * 4 / 3;
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const r = 28 + t * 44;
    spoke3.push({
      x: CX + Math.cos(s3Angle) * r,
      y: CY + Math.sin(s3Angle) * r,
    });
  }
  paths.push(spoke3);

  // 9. Spoke 4 — 40 points (matches mouth)
  const spoke4: { x: number; y: number }[] = [];
  const s4Angle = Math.PI;
  for (let i = 0; i < 40; i++) {
    const t = i / 39;
    const r = 28 + t * 44;
    spoke4.push({
      x: CX + Math.cos(s4Angle) * r,
      y: CY + Math.sin(s4Angle) * r,
    });
  }
  paths.push(spoke4);

  // 10. Spoke 5 + 6 — 30 points (matches upper lip)
  const spoke5: { x: number; y: number }[] = [];
  const s5Angle = Math.PI / 3;
  for (let i = 0; i < 15; i++) {
    const t = i / 14;
    const r = 28 + t * 44;
    spoke5.push({
      x: CX + Math.cos(s5Angle) * r,
      y: CY + Math.sin(s5Angle) * r,
    });
  }
  const s6Angle = Math.PI * 5 / 3;
  for (let i = 0; i < 15; i++) {
    const t = i / 14;
    const r = 28 + t * 44;
    spoke5.push({
      x: CX + Math.cos(s6Angle) * r,
      y: CY + Math.sin(s6Angle) * r,
    });
  }
  paths.push(spoke5);

  return paths;
}

export function FaceGearMorph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visibleRef = useRef(false);
  const animRef = useRef<number>(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    const facePaths = generateFacePoints();
    const gearPaths = generateGearPoints();

    let morphProgress = 0; // 0 = face, 1 = gear
    let morphDir = 1;
    let holdTimer = 0;
    const holdFrames = 120; // 2 seconds
    const morphSpeed = 0.005;
    let gearAngle = 0;
    let time = 0;

    // Breathing effect for face
    const breathe = (t: number) => 1 + Math.sin(t * 0.8) * 0.008;

    const loop = () => {
      if (!visibleRef.current) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      time += 0.016;
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Morph timing
      if (holdTimer > 0) {
        holdTimer--;
      } else {
        morphProgress += morphSpeed * morphDir;
        if (morphProgress >= 1) {
          morphProgress = 1;
          morphDir = -1;
          holdTimer = holdFrames;
        } else if (morphProgress <= 0) {
          morphProgress = 0;
          morphDir = 1;
          holdTimer = holdFrames;
        }
      }

      // Smooth easing (cubic)
      const t = morphProgress;
      const ease = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

      // Gear rotates when morphed
      gearAngle += ease * 0.004;
      const cosA = Math.cos(gearAngle);
      const sinA = Math.sin(gearAngle);

      // Face breathes when face-mode
      const br = breathe(time) * (1 - ease) + 1 * ease;

      // Draw each path pair
      const pathCount = Math.min(facePaths.length, gearPaths.length);

      for (let p = 0; p < pathCount; p++) {
        const facePath = facePaths[p];
        const gearPath = gearPaths[p];
        const count = Math.min(facePath.length, gearPath.length);

        // Determine if this is a closed shape or open line
        // Eyes, pupils, head, rings = closed. Brows, nose, mouth, lips, spokes = open.
        const closedFace = p <= 4; // head, left eye, left pupil, right eye, right pupil
        const closedGear = p <= 4; // outer, ring1, ring2, hub, hole
        const closed = closedFace || closedGear;

        // Stroke style — thicker for outer shapes
        const isOuter = p === 0;
        const isEyeOrHub = p >= 1 && p <= 4;

        ctx.beginPath();

        for (let i = 0; i < count; i++) {
          const fp = facePath[i];
          const gp = gearPath[i];

          // Apply breathing to face points
          const fx = CX + (fp.x - CX) * br;
          const fy = CY + (fp.y - CY) * br;

          // Apply rotation to gear points
          const gdx = gp.x - CX;
          const gdy = gp.y - CY;
          const gx = CX + gdx * cosA - gdy * sinA;
          const gy = CY + gdx * sinA + gdy * cosA;

          // Interpolate
          const x = fx * (1 - ease) + gx * ease;
          const y = fy * (1 - ease) + gy * ease;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        if (closed) ctx.closePath();

        // Style
        const alpha = isOuter ? 0.85 : isEyeOrHub ? 0.65 : 0.5;
        const width = isOuter ? 2.5 : isEyeOrHub ? 2 : 1.5;

        // Color: warm brown, shifts slightly golden for gear
        const r = Math.round(139 + ease * 40);
        const g = Math.round(111 + ease * 20);
        const b = Math.round(71 + ease * 10);

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.lineWidth = width;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Fill for pupils/hole with subtle opacity
        if (p === 2 || p === 4) {
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.15 + ease * 0.15})`;
          ctx.fill();
        }
      }

      // Subtle glow at center
      const glowR = 20 + ease * 15;
      const glow = ctx.createRadialGradient(CX, CY, 0, CX, CY, glowR);
      glow.addColorStop(0, `rgba(200, 160, 100, ${0.06 + ease * 0.1})`);
      glow.addColorStop(1, 'rgba(200, 160, 100, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(CX, CY, glowR, 0, Math.PI * 2);
      ctx.fill();

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
    init();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animRef.current);
    };
  }, [init]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={vp}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center my-6"
    >
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE, maxWidth: '85vw', maxHeight: '85vw' }}
      />
    </motion.div>
  );
}
