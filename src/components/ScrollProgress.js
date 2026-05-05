import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 2, transformOrigin: '0%',
        background: 'linear-gradient(90deg, #e8899a, #f2a8b6, #f8c4cf)',
        zIndex: 9997, scaleX,
      }}
    />
  );
}
