export default {
  parts: ['tangibleeButtonTabbedPDP', 'tabbedPDPWrapper'],
  baseStyle: () => ({}),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      tangibleeButtonTabbedPDP: {
        '.tangiblee-cta_title--details': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            ...theme.typography['text-body1-l'],
          },
        },
      },
      tabbedPDPWrapper: {
        '#description1, #description2': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            paddingTop: 'var(--spacing-6)',
          },
        },
        ':has(.tangiblee-cta)': {
          paddingTop: 'var(--spacing-6)',
          '#description1': {
            paddingTop: 'var(--spacing-6)',
          },
        },
      },
    }),
  },
}
