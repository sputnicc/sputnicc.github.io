/* Copied from Aceternity UI Timeline
   https://ui.aceternity.com/components/timeline
   Spacing, type, and the rail color are adapted. The purple gradient is not used. */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

export type TimelineEntry = {
  title: string;
  content: ReactNode;
};

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const reduce = useReducedMotion() === true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 15%", "end 60%"],
  });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);

  return (
    <div ref={containerRef} className="w-full">
      <div ref={ref} className="relative mx-auto max-w-6xl pb-8">
        {data.map((item) => (
          <div key={item.title} className="pt-8 md:flex md:gap-8 md:pt-12">
            <div className="mb-2 flex items-center md:sticky md:top-36 md:mb-0 md:w-48 md:shrink-0 md:self-start">
              <span className="h-3 w-3 shrink-0 rounded-full bg-ave" aria-hidden="true" />
              <p className="pl-3 font-display text-2xl text-ink md:text-3xl">{item.title}</p>
            </div>
            <div className="min-w-0 md:flex-1">{item.content}</div>
          </div>
        ))}
        <div
          style={{ height }}
          className="absolute top-0 left-[5px] hidden w-px bg-line md:block"
          aria-hidden="true"
        >
          {reduce ? (
            <div className="h-full w-full bg-ave" />
          ) : (
            <motion.div style={{ height: heightTransform }} className="w-full bg-ave" />
          )}
        </div>
      </div>
    </div>
  );
}
