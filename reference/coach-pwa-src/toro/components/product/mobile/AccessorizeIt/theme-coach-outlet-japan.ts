export default {
  baseStyle: ({ theme }) => ({
    accessorizeItPriceLabel: {
      ...theme.typography['text-cta3-m'],
      fontSize: 'var(--text-16)',
      fontWeight: 400,
    },

    accessorizeItATBButtonsContainer: {
      flexDirection: 'row-reverse',
    },
    accessorizeItButtonWrapper: {
      top: 0,
      right: 0,
      bottom: 'auto',
      marginRight: 'var(--spacing-3)',
      marginTop: 'var(--spacing-3)',
      width: 'auto',
    },
  }),
}
