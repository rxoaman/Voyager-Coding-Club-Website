/**
 * Scroll-linked flight animation of the large hero Voyager emblem
 * into the fixed navbar target container on the top-left,
 * with smooth fade out of the hero "Voyager Coding Club" text on scroll.
 */
export function initHeroScrollAnimation({
  heroLogoRef,
  navLogoTargetRef,
  heroTextRef,
  heroPillRef,
  scrollThreshold = 380
}) {
  if (!heroLogoRef || !heroTextRef || !navLogoTargetRef) return () => {};

  let ticking = false;

  const updateFlight = () => {
    try {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const progress = Math.min(Math.max(scrollY / scrollThreshold, 0), 1);

      // 1. Logo Flight Transform
      const parent = heroLogoRef.parentElement;
      const heroContainerRect = parent ? parent.getBoundingClientRect() : heroLogoRef.getBoundingClientRect();
      const targetRect = navLogoTargetRef.getBoundingClientRect();

      if (heroContainerRect && targetRect) {
        const deltaX = (targetRect.left + targetRect.width / 2) - (heroContainerRect.left + heroContainerRect.width / 2);
        const deltaY = (targetRect.top + targetRect.height / 2) - (heroContainerRect.top + heroContainerRect.height / 2);

        const targetScale = Math.min(targetRect.width / Math.max(heroContainerRect.width, 1), 0.35);
        const scale = 1 - (1 - targetScale) * progress;
        const translateX = deltaX * progress;
        const translateY = deltaY * progress;
        const opacity = progress >= 0.96 ? 0 : 1;

        heroLogoRef.style.transform = `translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        heroLogoRef.style.opacity = `${opacity}`;
      }

      // 2. Smooth fade of "Voyager Coding Club" text & hero copy on scroll
      const textOpacity = Math.max(1 - progress * 1.5, 0);
      const textTranslateY = -progress * 30;

      if (heroTextRef) {
        heroTextRef.style.opacity = `${textOpacity.toFixed(2)}`;
        heroTextRef.style.transform = `translate3d(0, ${textTranslateY.toFixed(1)}px, 0)`;
      }

      if (heroPillRef) {
        heroPillRef.style.opacity = `${textOpacity.toFixed(2)}`;
      }

      // 3. Seamless reveal of navbar target logo
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
