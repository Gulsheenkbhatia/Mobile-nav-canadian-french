export default {
  baseStyle: ({ theme }) => ({
    FindInStoreWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: '20px',
        marginTop: 0,
      },
    },
    PickUpButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: 0,
        '&.find-a-store-pick-up-ready': {
          marginBottom: 'var(--spacing-4)',
        },
      },
    },
  }),
}
