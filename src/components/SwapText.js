import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Shows `from`, and `to` while `active`: the old text lifts away as the new
// one rises into place. With nothing to switch to, it just shows `from`.
export default function SwapText({ from, to, active }) {
  const reduceMotion = useReducedMotion();
  const text = active && to ? to : from;

  if (!to || reduceMotion) return <span className="swap">{text}</span>;

  return (
    <span className="swap swap--stack">
      {/* popLayout lifts the outgoing text out of the flow, so the row takes
          the incoming text's width straight away instead of both at once. */}
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={text}
          className="swap-item"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
