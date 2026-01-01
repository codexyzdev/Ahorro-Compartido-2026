import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles } from "lucide-react";

interface Props {
  value: number | string;
  prefix?: string;
  className?: string;
}

export const MagicNumber: React.FC<Props> = ({
  value,
  prefix = "",
  className = "",
}) => {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(
      [...Array(5)].map((_, i) => ({
        id: i,
        x: (i - 2) * 20,
        y: -30 - Math.random() * 20,
      }))
    );
  }, []);

  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.span
        key={value}
        initial={{ y: 10, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className={`relative z-10 ${className}`}
      >
        {prefix}
        {value}
      </motion.span>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={`star-${value}-${p.id}`}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0.5],
              x: p.x,
              y: p.y,
              rotate: 360,
            }}
            transition={{ duration: 0.8, ease: "easeOut", delay: p.id * 0.05 }}
            className="absolute pointer-events-none"
          >
            {p.id % 2 === 0 ? (
              <Star size={14} className="text-amber-400 fill-amber-300" />
            ) : (
              <Sparkles size={16} className="text-rose-400" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
