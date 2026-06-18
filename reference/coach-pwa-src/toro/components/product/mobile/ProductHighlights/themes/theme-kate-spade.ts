import { baseStyles } from 'toro/components/product/mobile/ProductHighlights/themes/theme'

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
      ...theme.typography['text-display2-s'],
      color: 'var(--color-black-base)',
      padding: 'var(--spacing-6) var(--spacing-3) var(--spacing-4)',
    },
  }),
}
