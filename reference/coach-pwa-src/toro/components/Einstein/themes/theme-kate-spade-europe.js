export default {
  parts: ['einsteinTitle'],
  baseStyle: ({ theme }) => ({
    einsteinTitle: {
      fontFamily: theme.fontFamily.secondaryNormal,
    },
  }),
  variants: {
    pdpV4EinsteinRecommendationMobile: ({ theme }) => ({
      einsteinTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-s'],
          color: 'var(--color-black-base)',
        },
      },
    }),
  },
}
