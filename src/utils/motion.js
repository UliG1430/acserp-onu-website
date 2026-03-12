/**
 * Centralized Framer Motion animation config — Apple-style
 *
 * Principles:
 * - Ease: [0.16, 1, 0.3, 1]  →  ease-out expo (natural deceleration)
 * - Y offset: max 28px (subtle, not theatrical)
 * - Duration: 0.5–0.65s
 * - Stagger: 0.07–0.1s between siblings
 * - Hover scale: ≤ 1.03 (never jarring)
 */

export const ease = [0.16, 1, 0.3, 1];

/* ── Base variants ─────────────────────────────────────────────────────────── */

export const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.55, ease } },
};

export const fadeLeft = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
};

export const fadeRight = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
};

/* ── Stagger container ─────────────────────────────────────────────────────── */

export const stagger = (delay = 0.08) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: delay, delayChildren: 0.05 } },
});

/* ── Section heading ───────────────────────────────────────────────────────── */

export const headingVariants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

/* ── Card item (used inside stagger containers) ────────────────────────────── */

export const cardItem = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease } },
};

/* ── Viewport defaults ─────────────────────────────────────────────────────── */

export const viewport = { once: true, margin: "-8% 0px" };
