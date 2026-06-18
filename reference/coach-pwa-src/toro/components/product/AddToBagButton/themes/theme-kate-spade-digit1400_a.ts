export default {
  baseStyle: ({ theme }) => ({
    parts: ['addToBagButton'],
    addToBagButton: () => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--color-cta-atc-pdp-background)',
        },
        '&[disabled], &[disabled]:hover': {
          height: '57px',
        },
        ...theme.typography['text-cta1-s'],
        color: 'var(--color-white-base)',
        backgroundColor: 'var(--color-cta-atc-pdp-background)',
        h: '100%',
        w: '100%',
      },
      '&[disabled], &[disabled]:hover': {
        background: 'var(--border-color-neutral-base)',
        height: '48px',
      },
    }),
    addToBagAnimation: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        position: 'relative',
        overflow: 'hidden',
        h: '57px',
        borderRadius: 'var(--border-radius-s)',
        backgroundColor: '#0a420b',
      },
    },
    addToBagAnimationProgress: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'var(--color-cta-atc-pdp-background)',
        '&.active': {
          animationName: 'atb-progress',
          animationTimingFunction: 'cubic-bezier(var(--transition-easing-gentle))',
          animationDuration: 'var(--transition-duration-quick)',
          animationFillMode: 'forwards',
        },
        '&.complete': {
          transition:
            'all var(--transition-delay-quick) cubic-bezier(var(--transition-easing-gentle)) !important',
          transform: 'translateX(100%)',
        },
      },
    },
    animationTextProgress: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-cta1-s'],
        lineHeight: 'var(--line-height-115)',
        color: 'var(--color-white-base)',
        h: '100%',
        w: '100%',
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
          ...theme.typography['text-cta1-s'],
          fontStyle: 'normal',
          fontWeight: '400',
          color: 'var(--color-black-base)',
          backgroundColor: 'var(--color-cta-atc-pdp-default)',
          borderRadius: 'var(--border-radius-s)',
          border: '1px solid var(--color-inactive)',
          h: '100%',
          w: '100%',
        },
      }),
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      addToBagButton: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '&:hover:not(:disabled)': {
            backgroundColor: 'var(--color-black-base)',
          },
          border: 'none',
          borderRadius: 0,
          color: 'var(--color-white-base)',
          backgroundColor: 'var(--color-black-base)',
          padding: 'var(--spacing-3)',
          height: '56px',
          textTransform: 'none',
          paddingTop: 'var(--spacing-4)',
          '&[disabled]': {
            opacity: 1,
            backgroundColor: 'var(--color-neutral-light-2)',
            color: 'var(--color-neutral-base)',
          },
          ...theme.typography['text-cta1-s'],
        },
      }),
    }),
  },
}
