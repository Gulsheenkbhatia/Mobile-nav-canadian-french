export default {
  parts: [
    'buttonContainer',
    'contentWrapper',
    'buttonMainText',
    'learnMoreText',
    'title',
    'subtitle',
    'description',
    'disclaimer',
  ],
  baseStyle: ({ theme }) => ({
    buttonContainer: {
      backgroundColor: '#f7f7f7',
    },
    contentWrapper: {
      borderRadius: 0,
    },
    buttonMainText: {
      ...theme.typography['text-title2-s'],
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 400,
    },
    learnMoreText: {
      ...theme.typography['text-title2-xs'],
      fontFamily: 'var(--font-face1-normal)',
      textDecoration: 'underline',
      mr: 'var(--spacing-1)',
      color: 'var(--color-grey-80)',
      fontWeight: 400,
    },
    title: {
      ...theme.typography['text-display1-ms'],
      textTransform: 'uppercase',
      fontWeight: 400,
    },
    subtitle: {
      ...theme.typography['text-display1-s'],
      mb: 'var(--spacing-3)',
      fontWeight: 700,
    },
    description: {
      ...theme.typography['text-title1-s'],
      fontWeight: 400,
    },
    disclaimer: {
      ...theme.typography['text-title1-xs'],
      fontWeight: 400,
    },
  }),
}
