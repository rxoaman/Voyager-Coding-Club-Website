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
        // Initial center coordinates in viewport space at scrollY = 0
        const initialCenterX = heroContainerRect.left + heroContainerRect.width / 2;
        const initialCenterY = heroContainerRect.top + scrollY + heroContainerRect.height / 2;
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        const deltaX = targetCenterX - initialCenterX;
        const deltaY = targetCenterY - initialCenterY;

        const targetScale = Math.min(targetRect.width / Math.max(heroContainerRect.width, 1), 0.35);
        const scale = 1 - (1 - targetScale) * progress;
        const translateX = deltaX * progress;
        // Accounting for scrollY offsets the parent element's scroll translation,
        // ensuring a perfectly linear, direct glide between hero and navbar in both scroll directions
        const translateY = deltaY * progress + scrollY;

        // Smooth opacity crossfade as the emblem docks into or departs from the navbar
        const opacity = progress >= 0.98 ? 0 : (progress < 0.85 ? 1 : Math.max(0, 1 - (progress - 0.85) / 0.13));

        heroLogoRef.style.transform = `translate3d(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        heroLogoRef.style.opacity = `${opacity.toFixed(2)}`;
      }

      // 2. Smooth fade of "Voyager Coding Club" text & hero copy on scroll
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      // On mobile, keep text fully visible so no empty black void appears below the emblem;
      // on desktop, fade gracefully as emblem completes flight into fixed navbar
      const textOpacity = isMobile
        ? 1
        : progress < 0.35
          ? 1
          : Math.max(1 - (progress - 0.35) * 1.5, 0);
      const textTranslateY = isMobile ? 0 : -progress * 25;

      if (heroTextRef) {
        heroTextRef.style.opacity = `${textOpacity.toFixed(2)}`;
        heroTextRef.style.transform = isMobile ? 'none' : `translate3d(0, ${textTranslateY.toFixed(1)}px, 0)`;
      }

      if (heroPillRef) {
        heroPillRef.style.opacity = `${textOpacity.toFixed(2)}`;
      }

      // 3. Seamless reveal of navbar target logo
      if (navLogoTargetRef) {
        const navProgress = Math.max(0, Math.min(1, (progress - 0.85) / 0.13));
        const navScale = 0.8 + 0.2 * navProgress;
        navLogoTargetRef.style.opacity = `${navProgress.toFixed(2)}`;
        navLogoTargetRef.style.transform = `scale(${navScale.toFixed(2)})`;
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
