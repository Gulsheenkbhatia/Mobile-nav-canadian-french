export default {
  parts: ['addToBagButton'],
  baseStyle: ({ theme }) => ({
    addToBagButton: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--color-black-base)',
        },
        fontSize: 'var(--text-12)',
        fontStyle: 'normal',
        fontWeight: '400',
        color: 'var(--color-white-base)',
        backgroundColor: 'var(--color-black-base)',
        h: '57px',
        w: '100%',
        padding: 'var(--spacing-3)',
      },
    }),
    addToBagWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mt: 'var(--spacing-2)',
      },
    },
    addToBagAnimation: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        position: 'relative',
        overflow: 'hidden',
        h: '57px',
        borderRadius: 'var(--border-radius-s)',
        backgroundColor: '#3a3a3a', // missing in the design token
      },
    },
    addToBagAnimationProgress: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'var(--color-black-base)',
        '&.active': {
          animationName: 'atb-progress',
          animationTimingFunction: 'cubic-bezier(var(--transition-easing-gentle))',
          animationDuration: 'var(--transition-duration-gentle)',
          animationFillMode: 'forwards',
        },
        '&.complete': {
          transition: 'all var(--transition-delay-quick) cubic-bezier(0.83, 0, 0.17, 1) !important',
          transform: 'translateX(100%)',
        },
      },
    },
    animationTextProgress: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-12)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-115)',
        letterSpacing: 'var(--letter-spacing-xl)',
        fontStyle: 'normal',
        fontWeight: '400',
        color: 'var(--color-white-base)',
        h: '100%',
        w: '100%',
        position: 'absolute',
      },
    },
    addToBagTextWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '& .text-slider ': {
          position: 'relative',
          h: '100%',
          w: '100%',
          transition: 'all 300ms ease-in-out',
        },
        '& .text-slider.sliding': {
          transform: 'translateY(-100%)',
        },
        '& .text-slider.sliding .add-to-cart': {
          transition: 'all 150ms ease-in-out',
          opacity: 0,
        },
        position: 'relative',
        h: '100%',
        w: '100%',
      },
    },
  }),
  variants: {
    bundle: ({ theme }) => ({
      addToBagButton: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          p: 'var(--spacing-3) var(--spacing-6)',
          '&:hover:not(:disabled)': {
            backgroundColor: 'var(--color-black-base)',
          },
          fontSize: 'var(--text-12)',
          fontStyle: 'normal',
          fontWeight: '400',
          color: 'var(--color-white-base)',
          backgroundColor: 'var(--color-black-base)',
          h: '100%',
          w: '100%',
        },
      }),
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      addToBagButton: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: 'var(--spacing-4)',
        },
      }),
    }),
  },
}
