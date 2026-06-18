export default {
  baseStyle: ({ theme }) => ({
    accessorizeItPriceLabel: {
      ...theme.typography['text-cta3-m'],
    },
    accessorizeItPrice: {
      ...theme.typography['text-cta2-s'],
    },
    accessorizeItTitle: {
      ...theme.typography['text-display3-xs'],
    },
    accessorizeItSubtitle: {
      ...theme.typography['text-cta2-xs'],
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
