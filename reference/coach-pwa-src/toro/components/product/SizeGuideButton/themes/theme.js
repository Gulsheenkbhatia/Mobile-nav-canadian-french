export default {
  parts: ['modalContentWrapper', 'sizeGuideContainer', 'sizeGuideButton'],
  baseStyle: ({ theme }) => ({
    modalContentWrapper: {
      padding: '1.5rem',
      '&::-webkit-scrollbar': {
        width: '14px',
      },
      '&::-webkit-scrollbar-thumb': {
        border: '4px solid rgba(0,0,0,0)',
        backgroundClip: 'padding-box',
        borderRadius: '7px',
        backgroundColor: 'var(--color-neutral-medium)',
      },
    },
    sizeGuideContainer: (isSticky) => ({
      mb: isSticky ? 0 : 'l',
      mt: isSticky ? 0 : 'var(--spacing-1)',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: 'var(--spacing-1)',
      },
    }),
  }),
  variants: {
    extendedAdaptiveTabbedPDP: ({ theme }) => ({
      sizeGuideContainer: () => ({
        pl: 'var(--spacing-4)',
      }),
      sizeGuideButton: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
          'text-underline-offset': '2px',
        },
      },
    }),
  },
}
