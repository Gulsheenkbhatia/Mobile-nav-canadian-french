export default {
  parts: ['productDetailsWrapper', 'productDetailsHeaderRow'],
  baseStyle: () => ({
    productDetailsWrapper: {
      display: 'flex',
      padding: 'var(--spacing-4) var(--spacing-3) var(--spacing-3) var(--spacing-3)',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 'var(--spacing-3)',
      alignSelf: 'stretch',
    },
    productDetailsHeaderRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
      '&:has(.review-count)': {
        '& .product-name-price-container': {
          maxWidth: '70%',
        },
      },
      '&:not(:has(.review-count))': {
        '& .product-name-price-container': {
          maxWidth: '80%',
        },
      },
    },
  }),
}
