
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export interface Particle {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  delay: number;
}

interface Props {
  particles: Particle[];
}

export const ParticleSystem: React.FC<Props> = ({ particles }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.startX, 
              y: particle.startY, 
              scale: 0, 
              opacity: 0,
              rotate: 0 
            }}
            animate={{ 
              x: particle.endX, 
              y: particle.endY, 
              scale: [0, 1.5, 1], 
              opacity: [0, 1, 1, 0],
              rotate: 720 
            }}
            transition={{ 
              duration: 0.8, 
              delay: particle.delay,
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="absolute w-6 h-6 flex items-center justify-center"
            style={{ left: -12, top: -12 }}
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.4, repeat: Infinity }}
                className="w-4 h-4 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,1)] flex items-center justify-center"
              >
                <Sparkles size={10} className="text-white fill-white" />
              </motion.div>
              <motion.div 
                 initial={{ opacity: 0.5, scale: 0.8 }}
                 animate={{ opacity: 0, scale: 0.2, x: -20 }}
                 className="absolute inset-0 bg-amber-200 blur-sm rounded-full -z-10"
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
