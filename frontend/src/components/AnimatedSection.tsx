import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: 'bottom' | 'left' | 'right' | 'fade';
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  from = 'bottom',
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars: gsap.TweenVars =
      from === 'bottom'
        ? { y: 40, opacity: 0 }
        : from === 'left'
        ? { x: -40, opacity: 0 }
        : from === 'right'
        ? { x: 40, opacity: 0 }
        : { opacity: 0 };

    gsap.fromTo(el, fromVars, {
      y: 0,
      x: 0,
      opacity: 1,
      duration: 0.75,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [delay, from]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
