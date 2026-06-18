export default {
  parts: [
    'seoContentContainer',
    'seoContent',
    'seoAccordionWrapper',
    'showMoreWrapper',
    'showMoreLessButton',
  ],
  baseStyle: () => ({
    seoContentContainer: (isMobile) => ({
      width: isMobile ? '100%' : '46.28571rem',
    }),
  }),
  variants: {
    plpV3: ({ theme }) => ({
      seoContent: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '&.mol-plp-block': {
            pt: '7px',
            pb: 'var(--spacing-8)',
          },
        },
      },
      seoContentContainer: () => ({
        width: '100%',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: '46.28571rem',
          textAlign: 'center',
          '& h2': {
            marginBottom: '19px !important',
            marginX: '72px',
            color: 'var(--color-black-base)',
            '& > span': {
              ...theme.typography['text-display4-m'],
              fontSize: 'var(--text-28) !important',
            },
          },
          '& p': {
            ...theme.typography['text-body1-s'],
            marginBottom: '2px !important',
            color: 'var(--color-neutral-dark)',
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
    }),
  },
}
