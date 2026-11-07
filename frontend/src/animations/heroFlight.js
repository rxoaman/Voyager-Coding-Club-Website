import anime from 'animejs';

/**
 * Scroll-linked flight animation of the large hero Voyager emblem
 * into the fixed navbar target container on the top-left.
 * Operates smoothly across both desktop and mobile devices.
 */
export function initHeroScrollAnimation({
  heroLogoRef,
  navLogoTargetRef,
  heroTextRef,
  scrollThreshold = 420
}) {
  if (!heroLogoRef || !heroTextRef || !navLogoTargetRef) return () => {};

  let ticking = false;

  const updateFlight = () => {
    try {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const progress = Math.min(Math.max(scrollY / scrollThreshold, 0), 1);

      // Use parent container for stable, untransformed coordinates
      const parent = heroLogoRef.parentElement;
      const heroContainerRect = parent ? parent.getBoundingClientRect() : heroLogoRef.getBoundingClientRect();
      const targetRect = navLogoTargetRef.getBoundingClientRect();

      if (heroContainerRect && targetRect) {
        // Delta between initial center and navbar target center
        const deltaX = (targetRect.left + targetRect.width / 2) - (heroContainerRect.left + heroContainerRect.width / 2);
        const deltaY = (targetRect.top + targetRect.height / 2) - (heroContainerRect.top + heroContainerRect.height / 2);

        const targetScale = Math.min(targetRect.width / Math.max(heroContainerRect.width, 1), 0.35);
        const scale = 1 - (1 - targetScale) * progress;
        const translateX = deltaX * progress;
        const translateY = deltaY * progress;
        const opacity = progress >= 0.96 ? 0 : 1;

        // Direct high-performance GPU transform
        heroLogoRef.style.transform = `translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        heroLogoRef.style.opacity = `${opacity}`;
      }

      // Parallax text without creating phantom voids on mobile
      if (heroTextRef) {
        const textTranslateY = -progress * 25;
        // Keep text readable: desktop gently dissolves, mobile maintains visibility
        const minOpacity = window.innerWidth < 768 ? 0.35 : 0;
        const textOpacity = Math.max(1 - progress * 1.05, minOpacity);

        heroTextRef.style.opacity = `${textOpacity}`;
        heroTextRef.style.transform = `translate3d(0, ${textTranslateY.toFixed(1)}px, 0)`;
      }

      // Seamless reveal of navbar target logo
      if (navLogoTargetRef) {
        if (progress >= 0.82) {
          navLogoTargetRef.style.opacity = '1';
          navLogoTargetRef.style.transform = 'scale(1)';
        } else {
          navLogoTargetRef.style.opacity = '0';
          navLogoTargetRef.style.transform = 'scale(0.8)';
        }
      }
    } catch (err) {
      console.warn('Scroll flight animation error:', err);
    }

    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateFlight);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial compute
  updateFlight();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  };
}
