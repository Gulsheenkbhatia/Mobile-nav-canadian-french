export default {
  parts: ['findAStoreButton', 'pickUpMainText', 'pickUpSearchStoreButton'],
  baseStyle: ({ theme }) => ({
    findAStoreButton: {
      ...theme.typography['text-cta1-m'],
      fontFamily: 'var(--font-face1-medium)',
    },
    pickUpMainText: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body2-s'],
        fontWeight: 400,
      },
    },
    pickUpSearchStoreButton: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-link2-s'],
      },
    },
  }),
}
