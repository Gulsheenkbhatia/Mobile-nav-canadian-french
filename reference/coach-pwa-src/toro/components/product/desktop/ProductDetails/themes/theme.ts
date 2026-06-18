import { widePlus, widePlusMax } from 'toro/constants/productDetailsBreakPoints'

export default {
  baseStyle: ({ theme }) => ({
    productDetails: {
      paddingTop: 'var(--spacing-20)',

      [`@media (min-width: ${widePlus}px)`]: {
        maxWidth: 'max-content',
        margin: '0 auto',
      },
    },
    sectionSliderTitle: {
      ...theme.typography['text-display3-xs'],
      color: 'var(--color-black-base)',
      marginBottom: 'var(--spacing-4)',
      [`@media (max-width: ${widePlusMax}px)`]: {
        paddingLeft: '60px',
      },
    },
    sectionSliderWrapper: {
      position: 'relative',
    },
    sectionSliderContainer: {
      '& .splide__track': {
        paddingBottom: '169px',
      },
    },
    sectionSliderPagination: {
      position: 'absolute',
      width: '100%',
      bottom: '112px',
      height: '34px',
    },
    productDetailsContent: {
      paddingBottom: '169px',
      gap: 'var(--spacing-4)',
    },
  }),
}
