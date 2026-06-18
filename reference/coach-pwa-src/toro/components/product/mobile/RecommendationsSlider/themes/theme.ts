import { llmPromotionStyles } from 'toro/components/product/desktop/RecommendationsSlider/themes/theme'

const sliderWidth = '228px'
const sliderHeight = '285px'

export default {
  parts: [
    'sliderContainer',
    'sectionSliderContainer',
    'productImage',
    'infoContainer',
    'addToBagButtonContainer',
    'button',
    'buttonText',
    'productContainer',
    'productName',
    'strikethroughPrice',
    'price',
    'priceDiscount',
    'llmPromotion',
  ],
  baseStyle: ({ theme, hasATBButton }) => ({
    sliderContainer: {
      minHeight: 'var(--spacing-100)',
      paddingBottom: 'var(--spacing-6)',
      paddingTop: 'var(--spacing-10)',
      margin: '0 auto',
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    sectionSliderContainer: {
      p: hasATBButton ? 'var(--spacing-2) 0' : 'var(--spacing-4) 0',
      maxWidth: '100vw',
      // Override the fixedWidth from sliderOptions with CSS
      '& .splide__slide': {
        width: `${sliderWidth} !important`,
      },
      '@media (max-width: 480px)': {
        '& .splide__slide': {
          width: `${sliderWidth} !important`,
        },
      },
    },
    productImage: {
      objectFit: 'cover',
      objectPosition: 'center',
      width: sliderWidth,
      height: sliderHeight,
      '@media (max-width: 480px)': {
        width: sliderWidth,
        height: sliderHeight,
      },
    },
    infoContainer: {
      padding: 'var(--spacing-3)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: 'var(--spacing-10)',
      boxSizing: 'content-box',
      paddingBottom: '0',
    },
    addToBagButtonContainer: {
      marginTop: 'var(--spacing-2)',
      marginBottom: 'var(--spacing-4)',
    },
    productName: {
      ...theme.typography['text-display4-xxs'],
      fontFamily: 'var(--font-face1-extended-bold)',
      textAlign: 'center',
      p: '0 var(--spacing-4)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '100%',
    },
    strikethroughPrice: {
      ...theme.typography['text-body1-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
      textDecoration: 'line-through',
      color: 'var(--color-neutral-1, #6D6D6D)',
      paddingLeft: 'var(--spacing-1)',
    },
    price: {
      ...theme.typography['text-title2-m'],
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-14)',
    },
    priceDiscount: {
      ...theme.typography['text-body1-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
      color: 'var(--color-price-percentage, #057550)',
    },
    llmPromotion: {
      ...llmPromotionStyles(theme),
      maxWidth: '100%',
    },
    rootContainerSkeleton: {
      w: '100vw',
      overflowX: 'hidden',
      pt: 'var(--spacing-10)',
      pb: 'var(--spacing-6)',
      backgroundColor: 'var(--color-neutral-light-1)',
      minHeight: '439px',
    },
    itemSkeleton: {
      w: '228.54px',
      h: '285px',
    },
    titleSkeleton: {
      w: '400px',
      h: '50px',
    },
    gridWrapperSkeleton: {
      mt: 'var(--spacing-10)',
    },
    gridSkeleton: {
      w: '100%',
      gridColumnGap: 'var(--chakra-space-mar)',
      gridTemplateColumns: `repeat(5, 1fr)`,
    },
  }),
  variants: {
    // Pins Add to Bag to the bottom when promo/price blocks differ in height
    visuallySimilarPDPv6: () => ({
      sectionSliderContainer: {
        '& .splide__slide > *': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      },
      productContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      },
      addToBagButtonContainer: {
        marginTop: 'auto',
        marginBottom: 0,
      },
    }),
  },
}
