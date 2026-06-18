export default {
  baseStyle: ({ theme }) => ({
    accordion_details: {
      ...theme.typography['text-cta1-m'],
      fontWeight: '600',
    },
    productCareHeading: {
      ...theme.typography['text-body2-s'],
      fontWeight: '600',
    },
    propertiesHtmlContent: {
      'li, div, :not(b), a, u': {
        fontFamily: 'var(--font-face1-normal)',
      },
      margin: 'var(--spacing-6) 0',
    },
  }),
  variants: {
    adaptiveTabbedPDP: ({ theme }) => ({
      productPropertiesWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '#description2': {
            '& br': {
              display: 'block',
            },
          },
        },
      }),
    }),
  },
}
