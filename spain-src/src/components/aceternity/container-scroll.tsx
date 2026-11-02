/* Copied from Aceternity UI Container Scroll Animation
   https://ui.aceternity.com/components/container-scroll-animation
   Height, frame colors, and reduced-motion are adapted for the city bands. */

import { useRef, useState, useEffect, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

export function ContainerScroll({
  titleComponent,
  children,
}: {
  titleComponent: ReactNode;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    const onChange = () => setIsMobile(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : isMobile ? [0.94, 1] : [1.04, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

  return (
    <div ref={containerRef} className="relative flex h-[36rem] items-center md:h-[44rem]">
      <div className="relative w-full py-8" style={{ perspective: "1000px" }}>
        <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl px-4">
          {titleComponent}
        </motion.div>
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow: "0 24px 50px color-mix(in srgb, var(--color-ink) 22%, transparent)",
      }}
      className="mx-4 mt-6 h-[18rem] max-w-5xl border-4 border-ink bg-ink p-1.5 sm:mx-auto sm:h-[24rem] sm:w-full md:h-[28rem] md:p-2"
    >
      <div className="h-full w-full overflow-hidden bg-line">{children}</div>
    </motion.div>
  );
}
