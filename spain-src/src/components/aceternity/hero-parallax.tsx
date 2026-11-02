/* Copied from Aceternity UI Hero Parallax
   https://ui.aceternity.com/components/hero-parallax
   Header, row sizes, and reduced-motion are adapted for this itinerary. */

import { useRef, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

export type ParallaxProduct = {
  title: string;
  link: string;
  thumbnail: string;
  alt: string;
};

export function HeroParallax({
  products,
  header,
}: {
  products: ParallaxProduct[];
  header: ReactNode;
}) {
  const reduce = useReducedMotion() === true;
  const firstRow = products.slice(0, 4);
  const secondRow = products.slice(4, 7);
  const thirdRow = products.slice(7, 10);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const spring = { stiffness: 300, damping: 30 };
  const shift = reduce ? 0 : 720;
  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, shift]), spring);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -shift]), spring);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.25], [reduce ? 0 : 10, 0]), spring);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.25], [reduce ? 0 : 6, 0]), spring);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.25], [0, reduce ? 0 : 40]), spring);

  if (reduce) {
    return (
      <div>
        {header}
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4 pb-16 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((product) => (
            <li key={product.title} className="min-w-0">
              <a href={product.link} className="block text-ink">
                <img
                  src={product.thumbnail}
                  alt={product.alt}
                  width={800}
                  height={1000}
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="mt-2 block text-sm">{product.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="relative flex h-[165vh] flex-col overflow-hidden pt-6 [perspective:1000px] [transform-style:preserve-3d] md:h-[185vh]"
    >
      {header}
      <motion.div style={{ rotateX, rotateZ, translateY }}>
        <motion.div className="mb-6 flex flex-row-reverse space-x-6 space-x-reverse md:mb-10 md:space-x-10">
          {firstRow.map((product) => (
            <ProductCard key={product.title} product={product} translate={translateX} />
          ))}
        </motion.div>
        <motion.div className="mb-6 flex space-x-6 md:mb-10 md:space-x-10">
          {secondRow.map((product) => (
            <ProductCard key={product.title} product={product} translate={translateXReverse} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-6 space-x-reverse md:space-x-10">
          {thirdRow.map((product) => (
            <ProductCard key={product.title} product={product} translate={translateX} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ProductCard({
  product,
  translate,
}: {
  product: ParallaxProduct;
  translate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -10 }}
      className="relative h-56 w-64 shrink-0 md:h-72 md:w-96"
    >
      <a href={product.link} className="block h-full text-paper">
        <img
          src={product.thumbnail}
          alt={product.alt}
          width={800}
          height={600}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <span className="absolute inset-x-0 bottom-0 bg-ink/85 px-3 py-2 text-sm">{product.title}</span>
      </a>
    </motion.div>
  );
}
