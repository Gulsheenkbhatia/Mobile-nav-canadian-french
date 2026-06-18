import {
  IPHONE_PRO_SCREEN_WIDTH,
  IPHONE_PRO_MAX_SCREEN_WIDTH,
} from 'toro/constants/adaptiveExperience'

const commonDesktopClasses = {
  paginationContainer: {
    maxWidth: '84px',
    padding: 'var(--spacing-3)',
    alignItems: 'center',
    gap: 'var(--spacing-1)',
    borderRadius: '1920px',
    justifyContent: 'center',
  },
  inActiveSlide: {
    width: 'var(--spacing-2)',
    height: 'var(--spacing-2)',
  },
  activeSlide: {
    width: '18px',
    height: 'var(--spacing-2)',
  },
}

export default {
  parts: ['paginationWrapper', 'paginationContainer', 'inActiveSlide', 'activeSlide'],
  baseStyle: () => ({
    paginationWrapper: {
      position: 'absolute',
      width: '100%',
      bottom: '2%',
      justifyContent: 'center',
    },
    paginationContainer: {
      maxWidth: '64px',
      padding: '8px',
      alignItems: 'center',
      gap: '4px',
      borderRadius: '1920px',
      border: '1px solid rgba(255, 255, 255, 0.10)',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(4px)',
    },
    inActiveSlide: {
      width: '6px',
      height: '6px',
      borderRadius: '1920px',
      background: 'var(--color-neutral-base)',
    },
    activeSlide: {
      width: '16px',
      height: '6px',
      borderRadius: '1920px',
      background: 'var(--color-black-base)',
    },
  }),
  variants: {
    desktop: {
      paginationWrapper: {
        bottom: '0',
      },
      ...commonDesktopClasses,
    },
    desktopProductCarousel: {
      paginationWrapper: {
        width: 'auto',
        bottom: '2%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      ...commonDesktopClasses,
    },
    pdpV41: {
      paginationWrapper: {
        [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px)`]: {
          bottom: 'var(--spacing-3)',
        },
        [`@media (min-width: ${IPHONE_PRO_MAX_SCREEN_WIDTH}px)`]: {
          bottom: 'var(--spacing-4)',
        },
      },
    },
  },
}
