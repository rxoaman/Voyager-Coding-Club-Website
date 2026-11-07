import { animate, createTimeline, stagger } from 'animejs';

/**
 * Animate the person's cutout portrait stepping out of the card,
 * and the liquid glass details sliding into place on the right.
 */
export function animateDetailEnter({ heroImageRef, detailPanelRef, onComplete }) {
  try {
    const timeline = createTimeline({
      ease: 'outCubic',
      onComplete: onComplete,
    });

    if (heroImageRef) {
      timeline.add(heroImageRef, {
        scale: [0.85, 1],
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 700,
      }, 0);
    }

    if (detailPanelRef && typeof detailPanelRef.querySelectorAll === 'function') {
      const items = detailPanelRef.querySelectorAll('.animate-item');
      if (items && items.length > 0) {
        timeline.add(items, {
          translateX: [35, 0],
          opacity: [0, 1],
          duration: 550,
          delay: stagger(50),
        }, 120);
      }
    }

    return timeline;
  } catch (err) {
    console.warn('Card transition enter error:', err);
    if (onComplete) onComplete();
  }
}

/**
 * Animate back from expanded detail view to grid
 */
export function animateDetailExit({ containerRef, onComplete }) {
  if (!containerRef) {
    if (onComplete) onComplete();
    return;
  }

  try {
    animate(containerRef, {
      opacity: [1, 0],
      scale: [1, 0.96],
      translateY: [0, 20],
      duration: 280,
      ease: 'inCubic',
      onComplete: onComplete,
    });
  } catch (err) {
    console.warn('Card transition exit error:', err);
    if (onComplete) onComplete();
  }
}
