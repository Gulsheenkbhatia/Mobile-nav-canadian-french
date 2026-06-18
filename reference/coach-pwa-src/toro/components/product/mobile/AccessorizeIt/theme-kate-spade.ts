export default {
  baseStyle: ({ theme }) => ({
    accessorizeItContainerWrapper: {
      gap: '10px',
      flexDirection: 'column',
      display: 'flex',
    },
    accessorizeItTitle: {
      ...theme.typography['text-display2-m'],
      fontFamily: 'var(--font-face2-normal)',
      fontSize: 'var(--text-36)',
      lineHeight: '100%',
    },
    accessorizeItSubtitle: {
      fontFamily: 'var(--font-face1-normal)',
      color: 'var(--color-black-base)',
      fontSize: 'var(--text-16)',
      lineHeight: '125%',
      textTransform: 'none',
    },
    accessorizeItPriceLabel: {
      fontSize: 'var(--text-16)',
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 400,
    },
    accessorizeItPrice: {
      fontSize: 'var(--text-16)',
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 400,
    },
    accessorizeItImageContainer: {
      marginTop: '10px',
    },
    accessorizeItTab: {
      fontFamily: 'var(--font-face1-normal)',
      textTransform: 'none',
      fontSize: 'var(--text-16)',
    },
    accessorizeItATBButtonText: {
      fontSize: 'var(--text-16) !important',
      fontFamily: 'var(--font-face1-medium)',
      fontWeight: 500,
    },
    accessorizeItATBBundleButtonText: {
      fontSize: 'var(--text-16) !important',
      fontFamily: 'var(--font-face1-medium)',
      fontWeight: 500,
    },
  }),
}
