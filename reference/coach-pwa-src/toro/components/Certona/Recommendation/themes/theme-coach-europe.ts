const commonStyles = {
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-16)',
  lineHeight: 'var(--line-height-xl)',
  letterSpacing: 'var(--letter-spacing-xs)',
}

const priceTextStyles = {
  fontFamily: 'var(--font-face1-bold)',
  fontSize: 'var(--text-16)',
  letterSpacing: 'var(--letter-spacing-xs)',
  lineHeight: 'var(--line-height-xl)',
  color: 'var(--color-black-base)',
}

const priceStrikeoffStyles = {
  ...commonStyles,
  color: 'var(--color-neutral-1)',
}

const priceDiscountStyles = {
  ...commonStyles,
  color: 'var(--color-price-percentage, #057550)',
}

export default {
  parts: ['recommendedPriceText', 'priceStrikeoff', 'priceDiscount', 'recommendedPriceMainWrapper'],
  variants: {
    LLMRecommendation: () => ({
      recommendedPriceText: () => priceTextStyles,
      priceStrikeoff: priceStrikeoffStyles,
      priceDiscount: () => priceDiscountStyles,
      recommendedPriceMainWrapper: {
        '&.recommended-price': {
          padding: 0,
        },
      },
    }),
    aeDrawerGrid: () => ({
      recommendedPriceText: () => priceTextStyles,
      priceStrikeoff: priceStrikeoffStyles,
      priceDiscount: () => priceDiscountStyles,
    }),
  },
}
