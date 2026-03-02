'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const vp = { once: true, margin: '-50px' as const };
const SIZE = 360;
const CX = SIZE / 2;
const CY = SIZE / 2;

/*
 * PATH INDEX — each face path maps to a gear path with same point count:
 *  0: Head outline (120) → Outer gear teeth (120)
 *  1: Left eye (40) → Inner ring A (40)
 *  2: Left pupil (20) → Inner ring B (20)
 *  3: Right eye (40) → Hub ring (40)
 *  4: Right pupil (20) → Center hole (20)
 *  5: Left eyebrow (30) → Spoke 0deg (30)
 *  6: Right eyebrow (30) → Spoke 60deg (30)
 *  7: Nose (30) → Spoke 120deg (30)
 *  8: Mouth (40) → Spoke 180deg (40)
 *  9: Upper lip (30) → Spoke 240deg + 300deg (30)
 * 10: Hair top (60) → Outer ring detail (60)
 * 11: Hair left side (30) → Small gear A (30)
 * 12: Headset band (40) → Small gear B (40)
 * 13: Headset earpiece (30) → Small gear C (30)
 * 14: Headset mic arm (20) → Bolt hole A (20)
 * 15: Headset mic (20) → Bolt hole B (20)
 */

function generateFacePoints(): { x: number; y: number }[][] {
  const paths: { x: number; y: number }[][] = [];

  // 0. Head outline — 120pts. Not a perfect oval: narrower jaw, wider forehead
  const head: { x: number; y: number }[] = [];
  for (let i = 0; i < 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    // Jaw narrows at bottom
    const jawNarrow = Math.sin(t) > 0.3 ? (Math.sin(t) - 0.3) * 0.18 : 0;
    const rx = 105 - jawNarrow * 105;
    const ry = 125;
    head.push({ x: CX + Math.cos(t) * rx, y: CY + Math.sin(t) * ry });
  }
  paths.push(head);

  // 1. Left eye — 40pts almond (slightly larger, friendlier)
  const lEye: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const pinch = Math.pow(Math.abs(Math.cos(t)), 1.5) * 0.35;
    lEye.push({
      x: CX - 36 + Math.cos(t) * 22,
      y: CY - 20 + Math.sin(t) * (11 - pinch * 11),
    });
  }
  paths.push(lEye);

  // 2. Left pupil — 20pts
  const lPup: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    lPup.push({ x: CX - 36 + Math.cos(t) * 7, y: CY - 20 + Math.sin(t) * 7 });
  }
  paths.push(lPup);

  // 3. Right eye — 40pts (slightly larger, friendlier)
  const rEye: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const pinch = Math.pow(Math.abs(Math.cos(t)), 1.5) * 0.35;
    rEye.push({
      x: CX + 36 + Math.cos(t) * 22,
      y: CY - 20 + Math.sin(t) * (11 - pinch * 11),
    });
  }
  paths.push(rEye);

  // 4. Right pupil — 20pts
  const rPup: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    rPup.push({ x: CX + 36 + Math.cos(t) * 7, y: CY - 20 + Math.sin(t) * 7 });
  }
  paths.push(rPup);

  // 5. Left eyebrow — 30pts (slightly raised, friendly arch)
  const lBrow: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    lBrow.push({
      x: CX - 55 + t * 42,
      y: CY - 44 - Math.sin(t * Math.PI) * 10,
    });
  }
  paths.push(lBrow);

  // 6. Right eyebrow — 30pts
  const rBrow: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    rBrow.push({
      x: CX + 13 + t * 42,
      y: CY - 44 - Math.sin(t * Math.PI) * 10,
    });
  }
  paths.push(rBrow);

  // 7. Nose — 30pts
  const nose: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const bulb = t > 0.65 ? Math.sin((t - 0.65) / 0.35 * Math.PI) * 7 : 0;
    nose.push({ x: CX + bulb, y: CY - 8 + t * 35 });
  }
  paths.push(nose);

  // 8. Mouth — 40pts (warm, wider smile)
  const mouth: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = i / 39;
    mouth.push({
      x: CX - 32 + t * 64,
      y: CY + 48 + Math.sin(t * Math.PI) * 13,
    });
  }
  paths.push(mouth);

  // 9. Upper lip — 30pts
  const lip: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    const bow = Math.abs(t - 0.5) < 0.12 ? -3 : 0;
    lip.push({
      x: CX - 24 + t * 48,
      y: CY + 46 + bow + Math.sin(t * Math.PI) * 2,
    });
  }
  paths.push(lip);

  // 10. Hair top — 60pts. Closed filled shape: outer wavy edge + inner head contour
  const hair: { x: number; y: number }[] = [];
  const hairOuterPts = 35;
  const hairInnerPts = 60 - hairOuterPts; // 25 pts for return path along head
  // Outer edge: wavy volume above head
  for (let i = 0; i < hairOuterPts; i++) {
    const t = i / (hairOuterPts - 1);
    const angle = Math.PI * 1.12 + t * Math.PI * 0.76; // left to right across top
    const baseR = 112;
    const wave = Math.sin(t * Math.PI * 4) * 7 + 18;
    const r = baseR + wave;
    hair.push({ x: CX + Math.cos(angle) * r, y: CY + Math.sin(angle) * r });
  }
  // Inner edge: follow head contour back (reversed)
  for (let i = 0; i < hairInnerPts; i++) {
    const t = 1 - i / (hairInnerPts - 1);
    const angle = Math.PI * 1.12 + t * Math.PI * 0.76;
    const jawNarrow = Math.sin(angle) > 0.3 ? (Math.sin(angle) - 0.3) * 0.18 : 0;
    const rx = 105 - jawNarrow * 105;
    hair.push({ x: CX + Math.cos(angle) * rx, y: CY + Math.sin(angle) * 125 });
  }
  paths.push(hair);

  // 11. Hair left side — 30pts. Closed filled shape along left temple
  const hairL: { x: number; y: number }[] = [];
  const hairLOuter = 18;
  const hairLInner = 30 - hairLOuter; // 12 pts
  for (let i = 0; i < hairLOuter; i++) {
    const t = i / (hairLOuter - 1);
    const angle = Math.PI * 0.88 + t * Math.PI * 0.28;
    const wave = Math.sin(t * Math.PI * 2) * 4 + 12;
    hairL.push({ x: CX + Math.cos(angle) * (110 + wave), y: CY + Math.sin(angle) * (125 + wave * 0.3) });
  }
  for (let i = 0; i < hairLInner; i++) {
    const t = 1 - i / (hairLInner - 1);
    const angle = Math.PI * 0.88 + t * Math.PI * 0.28;
    hairL.push({ x: CX + Math.cos(angle) * 108, y: CY + Math.sin(angle) * 125 });
  }
  paths.push(hairL);

  // 12. Headset band — 40pts. Arc over the top of head
  const hBand: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = i / 39;
    const angle = Math.PI * 1.15 + t * Math.PI * 0.7;
    const r = 138; // outside the hair
    hBand.push({
      x: CX + Math.cos(angle) * r,
      y: CY + Math.sin(angle) * r,
    });
  }
  paths.push(hBand);

  // 13. Headset earpiece (left ear) — 30pts. Oval on left side
  const earpiece: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = (i / 30) * Math.PI * 2;
    earpiece.push({
      x: CX - 118 + Math.cos(t) * 12,
      y: CY - 8 + Math.sin(t) * 18,
    });
  }
  paths.push(earpiece);

  // 14. Headset mic arm — 20pts. Curved line from earpiece down to mouth
  const micArm: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    // Curve from left ear down and inward to mouth area
    const startX = CX - 118, startY = CY + 10;
    const endX = CX - 50, endY = CY + 65;
    const ctrlX = CX - 125, ctrlY = CY + 55;
    const mt = t;
    micArm.push({
      x: (1 - mt) * (1 - mt) * startX + 2 * (1 - mt) * mt * ctrlX + mt * mt * endX,
      y: (1 - mt) * (1 - mt) * startY + 2 * (1 - mt) * mt * ctrlY + mt * mt * endY,
    });
  }
  paths.push(micArm);

  // 15. Headset mic tip — 20pts. Small circle at end of mic arm
  const mic: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    mic.push({
      x: CX - 50 + Math.cos(t) * 8,
      y: CY + 65 + Math.sin(t) * 8,
    });
  }
  paths.push(mic);

  return paths;
}

function generateGearPoints(): { x: number; y: number }[][] {
  const paths: { x: number; y: number }[][] = [];

  // 0. Outer gear teeth — 120pts
  const teeth = 20;
  const outerR = 130;
  const innerR = 108;
  const outer: { x: number; y: number }[] = [];
  for (let i = 0; i < 120; i++) {
    const t = (i / 120) * Math.PI * 2;
    const phase = ((t / (Math.PI * 2)) * teeth) % 1;
    let r: number;
    if (phase < 0.3) r = outerR;
    else if (phase < 0.38) r = outerR - ((phase - 0.3) / 0.08) * (outerR - innerR);
    else if (phase < 0.88) r = innerR;
    else r = innerR + ((phase - 0.88) / 0.12) * (outerR - innerR);
    outer.push({ x: CX + Math.cos(t) * r, y: CY + Math.sin(t) * r });
  }
  paths.push(outer);

  // 1. Inner ring A — 40pts (r=75)
  const ringA: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    ringA.push({ x: CX + Math.cos(t) * 75, y: CY + Math.sin(t) * 75 });
  }
  paths.push(ringA);

  // 2. Inner ring B — 20pts (r=65)
  const ringB: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    ringB.push({ x: CX + Math.cos(t) * 65, y: CY + Math.sin(t) * 65 });
  }
  paths.push(ringB);

  // 3. Hub — 40pts (r=30)
  const hub: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    hub.push({ x: CX + Math.cos(t) * 30, y: CY + Math.sin(t) * 30 });
  }
  paths.push(hub);

  // 4. Center hole — 20pts (r=12)
  const hole: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    hole.push({ x: CX + Math.cos(t) * 12, y: CY + Math.sin(t) * 12 });
  }
  paths.push(hole);

  // Spokes: 6 spokes evenly spaced (each is a thick line from hub r=30 to inner ring r=75)
  // They're drawn as thin rectangles (4px wide) for visual clarity
  const spokeWidth = 4;
  function makeSpoke(angle: number, count: number): { x: number; y: number }[] {
    const pts: { x: number; y: number }[] = [];
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const perpX = -sin * spokeWidth / 2;
    const perpY = cos * spokeWidth / 2;
    const r1 = 30, r2 = 75;
    const half = Math.floor(count / 2);
    // Go out along one edge
    for (let i = 0; i < half; i++) {
      const t = i / (half - 1);
      const r = r1 + t * (r2 - r1);
      pts.push({ x: CX + cos * r + perpX, y: CY + sin * r + perpY });
    }
    // Come back along the other edge
    for (let i = 0; i < count - half; i++) {
      const t = 1 - i / (count - half - 1);
      const r = r1 + t * (r2 - r1);
      pts.push({ x: CX + cos * r - perpX, y: CY + sin * r - perpY });
    }
    return pts;
  }

  // 5-9: Six spokes at 0, 60, 120, 180, 240, 300 degrees
  paths.push(makeSpoke(0, 30));                          // 5
  paths.push(makeSpoke(Math.PI / 3, 30));                // 6
  paths.push(makeSpoke(Math.PI * 2 / 3, 30));            // 7
  paths.push(makeSpoke(Math.PI, 40));                     // 8
  // 9: two half-spokes combined (15+15=30)
  const spoke9: { x: number; y: number }[] = [];
  const s9a = makeSpoke(Math.PI * 4 / 3, 15);
  const s9b = makeSpoke(Math.PI * 5 / 3, 15);
  spoke9.push(...s9a, ...s9b);
  paths.push(spoke9);

  // 10. Outer decorative ring — 60pts (r=95, dotted effect via slight wobble)
  const decRing: { x: number; y: number }[] = [];
  for (let i = 0; i < 60; i++) {
    const t = (i / 60) * Math.PI * 2;
    const wobble = Math.sin(t * 24) * 2;
    decRing.push({ x: CX + Math.cos(t) * (95 + wobble), y: CY + Math.sin(t) * (95 + wobble) });
  }
  paths.push(decRing);

  // 11. Small gear A (top-right) — 30pts
  const sg1cx = CX + 95, sg1cy = CY - 95;
  const sg1: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = (i / 30) * Math.PI * 2;
    const phase = ((t / (Math.PI * 2)) * 8) % 1;
    const r = phase < 0.35 ? 18 : 13;
    sg1.push({ x: sg1cx + Math.cos(t) * r, y: sg1cy + Math.sin(t) * r });
  }
  paths.push(sg1);

  // 12. Small gear B (bottom-left) — 40pts
  const sg2cx = CX - 90, sg2cy = CY + 90;
  const sg2: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const t = (i / 40) * Math.PI * 2;
    const phase = ((t / (Math.PI * 2)) * 10) % 1;
    const r = phase < 0.35 ? 20 : 15;
    sg2.push({ x: sg2cx + Math.cos(t) * r, y: sg2cy + Math.sin(t) * r });
  }
  paths.push(sg2);

  // 13. Small gear C (top-left) — 30pts
  const sg3cx = CX - 100, sg3cy = CY - 80;
  const sg3: { x: number; y: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const t = (i / 30) * Math.PI * 2;
    const phase = ((t / (Math.PI * 2)) * 6) % 1;
    const r = phase < 0.35 ? 15 : 11;
    sg3.push({ x: sg3cx + Math.cos(t) * r, y: sg3cy + Math.sin(t) * r });
  }
  paths.push(sg3);

  // 14. Bolt hole A — 20pts (small circle on main gear)
  const bh1: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    bh1.push({ x: CX + 50 + Math.cos(t) * 5, y: CY + Math.sin(t) * 5 });
  }
  paths.push(bh1);

  // 15. Bolt hole B — 20pts
  const bh2: { x: number; y: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const t = (i / 20) * Math.PI * 2;
    bh2.push({ x: CX - 50 + Math.cos(t) * 5, y: CY + Math.sin(t) * 5 });
  }
  paths.push(bh2);

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

    let morphProgress = 0;
    let morphDir = 1;
    let holdTimer = 180; // Start by holding on face for 3 seconds so user sees it
    const holdFrames = 150; // Hold 2.5s at each state
    const morphSpeed = 0.003; // Slower morph (~5.5s transition)
    let gearAngle = 0;
    let time = 0;

    // Small gears rotate opposite direction
    let smallGearAngle = 0;

    const loop = () => {
      if (!visibleRef.current) {
        animRef.current = requestAnimationFrame(loop);
        return;
      }

      time += 0.016;
      ctx.clearRect(0, 0, SIZE, SIZE);

      if (holdTimer > 0) holdTimer--;
      else {
        morphProgress += morphSpeed * morphDir;
        if (morphProgress >= 1) { morphProgress = 1; morphDir = -1; holdTimer = holdFrames; }
        else if (morphProgress <= 0) { morphProgress = 0; morphDir = 1; holdTimer = holdFrames; }
      }

      const t = morphProgress;
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      gearAngle += ease * 0.004;
      smallGearAngle -= ease * 0.008; // counter-rotate

      const cosA = Math.cos(gearAngle);
      const sinA = Math.sin(gearAngle);

      // Face breathes subtly
      const breathe = 1 + Math.sin(time * 0.8) * 0.006 * (1 - ease);

      const pathCount = Math.min(facePaths.length, gearPaths.length);

      for (let p = 0; p < pathCount; p++) {
        const fp = facePaths[p];
        const gp = gearPaths[p];
        const count = Math.min(fp.length, gp.length);

        // Closed shapes: head(0), eyes(1-4), hair(10,11), earpiece(13), mic(15)
        const closedIndices = [0, 1, 2, 3, 4, 10, 11, 13, 15];
        const closed = closedIndices.includes(p);

        // Is this a small satellite gear? (11, 12, 13 in gear mode)
        const isSmallGear = p >= 11 && p <= 13;
        const sgCos = Math.cos(smallGearAngle);
        const sgSin = Math.sin(smallGearAngle);

        // Visual weight
        const isOuter = p === 0 || p === 10 || p === 12;
        const isFine = p >= 14;

        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const face = fp[i];
          const gear = gp[i];

          // Face: apply breathing
          const fx = CX + (face.x - CX) * breathe;
          const fy = CY + (face.y - CY) * breathe;

          // Gear: apply rotation
          let gx: number, gy: number;
          if (isSmallGear) {
            // Small gears rotate around their own center
            const gcx = p === 11 ? CX + 95 : p === 12 ? CX - 90 : CX - 100;
            const gcy = p === 11 ? CY - 95 : p === 12 ? CY + 90 : CY - 80;
            const dx = gear.x - gcx, dy = gear.y - gcy;
            gx = gcx + dx * sgCos - dy * sgSin;
            gy = gcy + dx * sgSin + dy * sgCos;
          } else {
            const dx = gear.x - CX, dy = gear.y - CY;
            gx = CX + dx * cosA - dy * sinA;
            gy = CY + dx * sinA + dy * cosA;
          }

          const x = fx * (1 - ease) + gx * ease;
          const y = fy * (1 - ease) + gy * ease;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        if (closed) ctx.closePath();

        // Per-path colors for visual richness
        // Face mode colors (blended toward gear gold with ease)
        type PathColor = { r: number; g: number; b: number; a: number; lw: number; fill?: { r: number; g: number; b: number; a: number } };
        const faceColors: Record<number, PathColor> = {
          0:  { r: 160, g: 120, b: 75, a: 0.75, lw: 2.5 },   // Head: warm medium brown
          1:  { r: 120, g: 85, b: 55, a: 0.7, lw: 1.8 },      // Left eye: darker brown
          2:  { r: 90, g: 65, b: 40, a: 0.85, lw: 1.5, fill: { r: 90, g: 65, b: 40, a: 0.45 } }, // Left pupil: dark brown filled
          3:  { r: 120, g: 85, b: 55, a: 0.7, lw: 1.8 },      // Right eye
          4:  { r: 90, g: 65, b: 40, a: 0.85, lw: 1.5, fill: { r: 90, g: 65, b: 40, a: 0.45 } }, // Right pupil
          5:  { r: 130, g: 95, b: 60, a: 0.55, lw: 1.5 },     // Left brow: medium
          6:  { r: 130, g: 95, b: 60, a: 0.55, lw: 1.5 },     // Right brow
          7:  { r: 155, g: 115, b: 75, a: 0.45, lw: 1.3 },    // Nose: lighter, subtle
          8:  { r: 175, g: 120, b: 85, a: 0.6, lw: 1.8 },     // Mouth: warm rosy brown
          9:  { r: 175, g: 120, b: 85, a: 0.5, lw: 1.2 },     // Upper lip
          10: { r: 100, g: 70, b: 42, a: 0.7, lw: 2, fill: { r: 100, g: 70, b: 42, a: 0.4 } },   // Hair top: rich dark brown
          11: { r: 100, g: 70, b: 42, a: 0.65, lw: 1.8, fill: { r: 100, g: 70, b: 42, a: 0.35 } }, // Hair side
          12: { r: 140, g: 140, b: 130, a: 0.5, lw: 2.2 },    // Headset band: silvery gray-brown
          13: { r: 130, g: 130, b: 120, a: 0.55, lw: 2, fill: { r: 130, g: 130, b: 120, a: 0.2 } }, // Earpiece: gray
          14: { r: 140, g: 140, b: 130, a: 0.45, lw: 1.5 },   // Mic arm: silver
          15: { r: 130, g: 130, b: 120, a: 0.6, lw: 1.2, fill: { r: 130, g: 130, b: 120, a: 0.3 } }, // Mic tip
        };
        // Gear mode: everything shifts toward golden
        const gearColor = { r: 175, g: 130, b: 80 };

        const fc = faceColors[p] || { r: 139, g: 111, b: 71, a: 0.6, lw: 1.8 };
        const sr = Math.round(fc.r * (1 - ease) + gearColor.r * ease);
        const sg = Math.round(fc.g * (1 - ease) + gearColor.g * ease);
        const sb = Math.round(fc.b * (1 - ease) + gearColor.b * ease);
        const sa = fc.a;

        ctx.strokeStyle = `rgba(${sr}, ${sg}, ${sb}, ${sa})`;
        ctx.lineWidth = fc.lw;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        // Fills
        if (fc.fill) {
          const fr = Math.round(fc.fill.r * (1 - ease) + gearColor.r * ease);
          const fg = Math.round(fc.fill.g * (1 - ease) + gearColor.g * ease);
          const fb = Math.round(fc.fill.b * (1 - ease) + gearColor.b * ease);
          const fa = fc.fill.a * (1 - ease * 0.4); // fade fill slightly in gear mode
          ctx.fillStyle = `rgba(${fr}, ${fg}, ${fb}, ${fa})`;
          ctx.fill();
        }
      }

      // Center glow
      const gr = 22 + ease * 12;
      const glow = ctx.createRadialGradient(CX, CY, 0, CX, CY, gr);
      glow.addColorStop(0, `rgba(200, 160, 100, ${0.05 + ease * 0.08})`);
      glow.addColorStop(1, 'rgba(200, 160, 100, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(CX, CY, gr, 0, Math.PI * 2);
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
    return () => { observer.disconnect(); cancelAnimationFrame(animRef.current); };
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
