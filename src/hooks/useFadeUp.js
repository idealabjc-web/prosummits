import { useEffect } from "react";

/**
 * useFadeUp
 * Observes all `.fu` children inside `ref` and adds the `.on` class
 * when each element enters the viewport, triggering the CSS fade-up animation.
 *
 * @param {React.RefObject} ref - ref attached to the section wrapper
 */
export function useFadeUp(ref) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".fu") || [];
    const io  = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
}
