import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Cursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseOver = (e) => {
      if (['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(e.target.tagName) || e.target.closest('a') || e.target.closest('button')) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-purple-500 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovered ? 0 : 1,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border-2 border-purple-500 rounded-full pointer-events-none z-[9998] mix-blend-difference flex items-center justify-center"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovered ? 1.5 : 1,
          backgroundColor: isHovered ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.5 }}
      />
    </>
  );
};
export default Cursor;
