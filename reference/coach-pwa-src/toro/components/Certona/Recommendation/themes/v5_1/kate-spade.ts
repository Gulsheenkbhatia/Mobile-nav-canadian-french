const discountTypeography = {
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-14)',
  letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
  lineHeight: 'var(--line-height-140)',
}

export default {
  parts: [
    'recommendedPriceMainWrapper',
    'priceContainer',
    'comparablePrice',
    'recommendedPriceText',
    'priceStrikeoff',
    'priceDiscount',
  ],
  variants: {
    pdpv5_1: () => ({
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          p: 0,
          mt: 'var(--spacing-3)',
        },
      },
      priceContainer: () => ({
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--spacing-1)',
        '& .price-text': {
          color: 'var(--color-price, #000) !important',
        },
      }),
      comparablePrice: {
        color: 'var(--color-price-comp-value, #6D6D6D)',
        ...discountTypeography,
      },
      recommendedPriceText: () => ({
        color: 'var(--color-price, #000)',
        fontFamily: 'var(--font-face1-medium)',
        fontSize: 'var(--text-14)',
        fontWeight: 700,
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
      }),
      priceStrikeoff: {
        color: 'var(--color-price-strikethrough, #6D6D6D)',
        ...discountTypeography,
      },
      priceDiscount: () => ({
        color: 'var(--color-price-percentage, #057550)',
        ...discountTypeography,
      }),
    }),
  },
}
