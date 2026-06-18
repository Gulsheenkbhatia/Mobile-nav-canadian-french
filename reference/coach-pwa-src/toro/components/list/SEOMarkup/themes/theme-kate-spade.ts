export default {
  variants: {
    plpV3: ({ theme }) => ({
      seoContent: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '&.mol-plp-block': {
            pt: 'var(--spacing-1)',
            pb: 'var(--spacing-8)',
          },
        },
      },
      seoContentContainer: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: '648px',
          textAlign: 'center',
          '& h2': {
            marginBottom: 'var(--spacing-6) !important',
            marginX: '72px',
            color: 'var(--color-black-base)',
            '& > span': {
              ...theme.typography['text-display1-ms'],
              fontSize: 'var(--text-28) !important',
            },
          },
          '& p': {
            ...theme.typography['text-body1-l'],
            marginBottom: '2px !important',
            color: 'var(--color-black-base)',
          },
        },
      }),
      seoAccordionWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& h2': {
            marginTop: 'var(--spacing-4)',
            marginX: 0,
            color: 'var(--color-neutral-dark)',
            '& > span': {
              ...theme.typography['text-body1-s'],
              fontSize: 'var(--text-12) !important',
            },
          },
          '& p': {
            marginBottom: 'var(--spacing-4) !important',
          },
        },
      },

      showMoreWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          paddingTop: '2px',
        },
      },
      showMoreLessButton: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-cta1-m'],
          fontWeight: '400',
          letterSpacing: 'var(--letter-spacing-xl)',
          color: 'var(--color-black-base)',
          marginRight: 'var(--spacing-2)',
        },
      },
    }),
  },
}
