
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';

interface Props {
  value: number | string;
  prefix?: string;
  className?: string;
}

export const MagicNumber: React.FC<Props> = ({ value, prefix = "", className = "" }) => (
  <div className="relative inline-flex items-center justify-center">
    <motion.span
      key={value}
      initial={{ y: 10, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={`relative z-10 ${className}`}
    >
      {prefix}{value}
    </motion.span>
    <AnimatePresence>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`star-${value}-${i}`}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1.2, 0.5],
            x: (i - 2) * 20,
            y: -30 - (Math.random() * 20),
            rotate: 360
          }}
          transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 }}
          className="absolute pointer-events-none"
        >
          {i % 2 === 0 ? (
            <Star size={14} className="text-amber-400 fill-amber-300" />
          ) : (
            <Sparkles size={16} className="text-rose-400" />
          )}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);
