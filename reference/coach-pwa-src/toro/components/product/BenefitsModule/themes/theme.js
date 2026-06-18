export default {
  parts: ['benefitText'],
  baseStyle: ({ theme }) => ({
    benefitsContainer: {
      padding: 'var(--spacing-8) var(--spacing-3) var(--spacing-4)',
    },
    benefitsTitle: {
      ...theme.typography['text-body1-m'],
      fontWeight: 'normal',
      mb: theme.space.s,
    },
    benefitsItemsWrapper: {
      overflowX: 'scroll',
      '::-webkit-scrollbar': {
        width: 0,
        bg: 'transparent',
      },
    },
    benefitItem: {
      py: theme.space.mar,
      mr: theme.space.l,
      '&:last-child': {
        mr: 0,
      },
    },
    benefitText: (benefitImage) => ({
      ...theme.typography['text-body1-l'],
      ml: benefitImage && theme.space.s,
      fontWeight: 'normal',
      whiteSpace: 'nowrap',
    }),
  }),
}
