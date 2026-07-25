import React, { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) {
      el.style.display = 'none';
      return;
    }
    const move = (e) => {
      el.style.left = e.clientX + 'px';
      el.style.top  = e.clientY + 'px';
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return <div className="cursor-glow" ref={glowRef} />;
}
