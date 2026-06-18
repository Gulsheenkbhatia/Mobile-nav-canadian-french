export default {
  parts: [
    'topContent',
    'reviewcta',
    'reviewctaContainer',
    'sliderContainer',
    'image',
    'imageContainer',
  ],
  variants: {
    pdpV3WyngMobile: ({ theme }) => ({
      topContent: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          h1: {
            ...theme.typography['text-display1-m'],
            color: 'var(--color-black-base) !important',
            marginBottom: '3.5px !important',
          },
          p: {
            marginBottom: '11px !important',
            color: 'var(--color-black-base) !important',
          },
          '.mol-banner .banner-container.solid-background .mol-header-block': {
            marginBottom: '11px !important',
          },
        },
      }),
      reviewctaContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '18px var(--spacing-3) var(--spacing-6)',
        },
      },
      sliderContainer: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginBottom: '18px',
        },
      }),
      image: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '307px',
          height: 'auto',
          borderRadius: 'var(--border-radius-s)',
        },
      },
      reviewcta: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-eyebrow1-l'],
          letterSpacing: 'var(--letter-spacing-l) !important',
          fontWeight: '500',
          lineHeight: 'var(--line-height-135) !important',
          height: 'auto',
          width: '100%',
          padding: '15.5px var(--spacing-6) 14.5px !important',
        },
      }),
    }),
  },
}
