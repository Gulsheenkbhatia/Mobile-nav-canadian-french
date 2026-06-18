export default {
  baseStyle: ({ theme }) => ({
    whishlistButtonContainer: (isNewMegaPDPTurnOn) => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        position: 'static',
        mt: isNewMegaPDPTurnOn ? 'var(--spacing-4)' : 'var(--spacing-3)',
        ml: 'var(--spacing-4)',
      },
    }),
  }),
}
