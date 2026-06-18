import { widePlusMax } from 'toro/constants/productDetailsBreakPoints'

export default {
  baseStyle: () => ({
    productDetails: {
      paddingTop: 'var(--spacing-16)',
      '.splide__list > li:last-child .productCardContainer': {
        marginRight: 'var(--spacing-16)',
      },
    },
    sectionSliderTitle: {
      marginBottom: 'var(--spacing-6)',
      fontFamily: 'var(--font-face3-normal)',
      fontSize: 'var(--text-32)',
      lineHeight: 'var(--line-height-100)',
      fontWeight: '400',
      letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
      paddingLeft: 'var(--spacing-16)',
      [`@media (max-width: ${widePlusMax}px)`]: {
        paddingLeft: 'var(--spacing-16)',
      },
    },
  }),
}
