export const baseStyles = {
  productDetails: {
    backgroundColor: 'var(--color-page-bg, #F0F0F0)',
  },
  sectionSliderWrapper: {
    position: 'relative',
  },
  sectionSliderContainer: {
    '& .splide__track': {
      paddingBottom: '28px',
      '& li:first-child': {
        marginLeft: 'var(--spacing-2)',
      },
      '& li:last-child': {
        paddingRight: 'var(--spacing-2)',
      },
    },
  },
  sectionSliderPagination: {
    width: '100%',
    height: '34px',
  },
  productDetailsContent: {
    paddingBottom: 'var(--spacing-4)',
    marginX: 'var(--spacing-2)',
  },
}

export default {
  parts: [
    'productDetails',
    'sectionSliderTitle',
    'sectionSliderWrapper',
    'sectionSliderContainer',
    'sectionSliderPagination',
    'productDetailsContent',
  ],
  baseStyle: ({ theme }) => ({
    ...baseStyles,
    sectionSliderTitle: {
      ...theme.typography['text-display3-s'],
      color: 'var(--color-black-base)',
      padding: 'var(--spacing-6) var(--spacing-3) var(--spacing-4)',
    },
  }),
}
