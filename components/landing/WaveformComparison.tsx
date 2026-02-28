'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import anime from 'animejs';

export function WaveformComparison() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const animStarted = useRef(false);

  useEffect(() => {
    if (!isInView || !svgRef.current || animStarted.current) return;
    animStarted.current = true;

    const roboticPath = svgRef.current.querySelector('.morph-path');
    if (!roboticPath) return;

    // Jagged robotic → smooth human morph
    const robotic = 'M0,50 L15,20 L30,70 L45,15 L60,80 L75,10 L90,75 L105,25 L120,65 L135,30 L150,50 L165,20 L180,70 L195,25 L210,65 L225,35 L240,60 L255,20 L270,70 L285,30 L300,50';
    const human = 'M0,50 Q15,30 30,48 Q45,65 60,50 Q75,35 90,52 Q105,62 120,48 Q135,32 150,50 Q165,65 180,48 Q195,32 210,52 Q225,62 240,48 Q255,35 270,50 Q285,60 300,50';

    anime({
      targets: roboticPath,
      d: [{ value: robotic }, { value: human }],
      duration: 2500,
      easing: 'easeInOutCubic',
      delay: 500,
    });
  }, [isInView]);

  return (
    <div ref={sectionRef}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto"
      >
        {/* Labels */}
        <div className="flex items-center justify-between mb-4 px-4">
          <div className="text-center flex-1">
            <span className="text-sm font-medium text-[#8B7355]/60 uppercase tracking-wider">Traditional IVR</span>
          </div>
          <div className="text-[#8B6F47] font-bold text-lg mx-4">→</div>
          <div className="text-center flex-1">
            <span className="text-sm font-bold text-[#8B6F47] uppercase tracking-wider">HelloML</span>
          </div>
        </div>

        {/* Morphing SVG */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-[#E8DCC8]/50 p-6 md:p-8">
          <svg
            ref={svgRef}
            viewBox="0 0 300 100"
            className="w-full h-20 md:h-24"
            preserveAspectRatio="none"
          >
            <path
              className="morph-path"
              d="M0,50 L15,20 L30,70 L45,15 L60,80 L75,10 L90,75 L105,25 L120,65 L135,30 L150,50 L165,20 L180,70 L195,25 L210,65 L225,35 L240,60 L255,20 L270,70 L285,30 L300,50"
              fill="none"
              stroke="#8B6F47"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="grid grid-cols-3 gap-4 mt-8"
        >
          {[
            { stat: 'Sub-500ms', label: 'Response time' },
            { stat: 'Natural', label: 'Turn-taking' },
            { stat: 'Contextual', label: 'Understanding' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-lg md:text-xl font-bold text-[#8B6F47]">{item.stat}</div>
              <div className="text-xs md:text-sm text-[#8B7355]">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
