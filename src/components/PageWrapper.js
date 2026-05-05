import React from 'react';
import { motion } from 'framer-motion';

export default function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      style={{ overflowX: 'hidden', overflowY: 'visible' }}
    >
      {children}
    </motion.div>
  );
}
