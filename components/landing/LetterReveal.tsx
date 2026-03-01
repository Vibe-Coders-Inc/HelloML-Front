'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Anime.js letter-by-letter reveal animation.
 * Splits text into individual letter spans and animates them in.
 */
export function LetterReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    let mounted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && mounted) {
          import('animejs').then(({ animate, stagger }) => {
            if (!mounted || !containerRef.current) return;
            const letters = containerRef.current.querySelectorAll('.letter');
            animate(letters, {
              opacity: [0, 1],
              translateY: [25, 0],
              delay: stagger(35, { start: delay }),
              duration: 600,
              ease: 'outExpo',
            });
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    setReady(true);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, [delay]);

  return (
    <span ref={containerRef} className={className}>
      {text.split('').map((char, i) =>
        char === ' ' ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span
            key={i}
            className="letter"
            style={{ display: 'inline-block', opacity: ready ? 0 : 1 }}
          >
            {char}
          </span>
        )
      )}
    </span>
  );
}
