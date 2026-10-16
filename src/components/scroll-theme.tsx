'use client';

import './scroll-theme.css';
import {useEffect, useRef, type ReactNode} from 'react';
import {scrollThemeColors, scrollThemeProgress} from '@/lib/scroll-theme';

export function ScrollTheme({children, className, start = 0.35, end = 0.65}: {children: ReactNode; className: string; start?: number; end?: number}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let lastProgress = -1;
    const update = () => {
      frame = 0;
      const progress = scrollThemeProgress(window.scrollY, document.documentElement.scrollHeight, window.innerHeight, motion.matches, start, end);
      if (progress === lastProgress) return;
      lastProgress = progress;
      for (const [name, value] of Object.entries(scrollThemeColors(progress))) element.style.setProperty(name, value);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule, {passive: true});
    window.addEventListener('pageshow', schedule);
    motion.addEventListener('change', schedule);
    // Recalculate for image/font loading, streamed content and mobile reflow.
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    update();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      motion.removeEventListener('change', schedule);
    };
  }, [start, end]);
  return <div className={`scroll-theme ${className}`} ref={root}>{children}</div>;
}
