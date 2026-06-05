"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedTextCycle({
  words,
  interval = 5000,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion || words.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, reduceMotion, words.length]);

  if (!words.length) return null;

  if (reduceMotion) {
    return <span className={`inline-block ${className}`}>{words[0]}</span>;
  }

  return (
    <span className={`relative inline-block ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[currentIndex]}
          className="inline-block"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.33, 0, 0.2, 1] }}
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
