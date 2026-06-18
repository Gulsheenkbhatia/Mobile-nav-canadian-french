import { baseStyles } from 'toro/components/product/mobile/ProductHighlights/ProductCard/theme'

export default {
  parts: [
    'productCardWrapper',
    'productCardBodyContainer',
    'productCardImageWrapper',
    'productCardTangibleeWrapper',
    'productCardTitleContainer',
    'productCardImage',
  ],
  baseStyle: ({ theme }) => ({
    ...baseStyles,
    productCardBodyContainer: {
      ...baseStyles.productCardBodyContainer,
      '& > h2': {
        ...theme.typography['text-display2-s'],
        color: 'var(--color-white-base)',
        marginBottom: 0,
        whiteSpace: 'pre-line',
        display: 'block',
        textAlign: 'center',
        mixBlendMode: 'difference',
        position: 'absolute',
        zIndex: 3,
        top: '32px',
        width: '100%',
      },
    },
    productCardWrapper: {
      ...baseStyles.productCardWrapper,
      backgroundColor: 'var(--color-product-image-bg, #F7F7F7)',
    },
    productCardImage: {
      ...baseStyles.productCardImage,
      aspectRatio: '1',
    },
  }),
}
