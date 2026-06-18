export default {
  baseStyle: ({ theme }) => ({
    PickUpButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'flex',
        alignItems: 'center',
      },
    },
  }),
}
