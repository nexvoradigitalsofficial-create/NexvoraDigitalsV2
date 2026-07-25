import { useEffect, useRef } from 'react';

export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry], obs) => {
      if (entry.isIntersecting) {
        el.classList.add('in-view');
        obs.unobserve(el);
      }
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px', ...options });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

export function useServiceReveal() {
  useEffect(() => {
    const cards = document.querySelectorAll('.service-card');
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }, i * 80);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, []);
}
