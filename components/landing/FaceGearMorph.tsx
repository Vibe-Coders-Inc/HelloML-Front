'use client';

import { useRef, useEffect } from 'react';
import { createTimeline } from 'animejs';

// Both paths have exactly the same structure: M + 32 C commands
// This ensures smooth morphing between the two shapes.

// Face: oval head, two dot-eyes, curved smile
const FACE_PATH = [
  'M 125 25',
  'C 145 25 170 35 185 55',
  'C 200 75 210 100 210 125',
  'C 210 150 200 175 185 195',
  'C 170 215 145 225 125 225',
  'C 105 225 80 215 65 195',
  'C 50 175 40 150 40 125',
  'C 40 100 50 75 65 55',
  'C 80 35 105 25 125 25',
  // left eye
  'C 125 25 90 88 85 93',
  'C 80 98 80 103 85 108',
  'C 90 113 100 113 105 108',
  'C 110 103 110 98 105 93',
  'C 100 88 90 88 90 93',
  // right eye
  'C 90 93 150 88 145 93',
  'C 140 98 140 103 145 108',
  'C 150 113 160 113 165 108',
  'C 170 103 170 98 165 93',
  'C 160 88 150 88 150 93',
  // smile
  'C 150 93 85 158 88 162',
  'C 91 166 98 172 105 175',
  'C 112 178 118 179 125 179',
  'C 132 179 138 178 145 175',
  'C 152 172 159 166 162 162',
  'C 165 158 162 155 158 155',
  // connect back
  'C 154 155 148 160 145 163',
  'C 138 168 132 170 125 170',
  'C 118 170 112 168 105 163',
  'C 102 160 96 155 92 155',
  'C 88 155 85 158 88 162',
  'C 91 166 125 25 125 25',
  'C 125 25 125 25 125 25',
].join(' ');

// Gear/cog with 8 teeth + interior circuit lines
const GEAR_PATH = [
  'M 125 30',
  'C 135 30 140 30 145 35',
  'C 150 25 160 20 170 30',
  'C 180 40 175 50 170 55',
  'C 180 60 190 65 195 75',
  'C 205 70 215 75 220 85',
  'C 225 95 218 105 210 105',
  'C 215 115 215 125 215 130',
  'C 225 135 225 145 220 155',
  'C 215 165 205 165 200 160',
  'C 195 170 185 178 180 182',
  'C 188 190 185 200 175 205',
  'C 165 210 158 205 155 198',
  'C 148 202 138 205 130 205',
  'C 125 215 118 220 110 215',
  'C 102 210 100 202 102 195',
  'C 95 192 85 185 78 178',
  'C 70 185 60 185 55 175',
  'C 50 165 55 155 62 150',
  'C 55 140 50 130 48 120',
  'C 38 120 30 112 32 102',
  'C 34 92 42 88 50 90',
  'C 52 80 58 68 65 60',
  'C 58 52 60 42 70 38',
  'C 80 34 88 40 90 48',
  'C 98 42 108 35 115 32',
  'C 118 30 122 30 125 30',
  // interior circuit nodes
  'C 125 30 100 100 105 105',
  'C 110 110 115 110 120 105',
  'C 125 100 130 105 135 110',
  'C 140 115 150 120 155 115',
  'C 160 110 155 100 145 98',
  'C 135 96 125 30 125 30',
].join(' ');

export function FaceGearMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    if (!container || !path) return;

    let tl: ReturnType<typeof createTimeline> | null = null;
    let playing = false;

    function buildAndPlay() {
      if (tl) return;
      tl = createTimeline({
        loop: true,
        defaults: { ease: 'inOutQuad' },
      })
        .add(path as SVGPathElement, { d: GEAR_PATH, duration: 3000 }, '+=1000')
        .add(path as SVGPathElement, { d: FACE_PATH, duration: 3000 }, '+=1000');

      playing = true;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!tl) {
            buildAndPlay();
          } else if (!playing) {
            tl.play();
            playing = true;
          }
        } else {
          if (tl && playing) {
            tl.pause();
            playing = false;
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      if (tl) tl.pause();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-[220px] h-[220px] mx-auto mt-8">
      <svg
        viewBox="0 0 250 250"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          ref={pathRef}
          d={FACE_PATH}
          stroke="#8B6F47"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
