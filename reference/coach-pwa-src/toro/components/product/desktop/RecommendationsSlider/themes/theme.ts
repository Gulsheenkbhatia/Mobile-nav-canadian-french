export const llmPromotionStyles = (theme) => ({
  color: 'var(--color-success-primary)',
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-14)',
  letterSpacing: 'var(--letter-spacing-xs)',
  lineHeight: 'var(--line-height-xl)',
  my: 'var(--spacing-2)',
  textAlign: 'center',
})

export default {
  baseStyle: ({ theme, hasATBButton }) => ({
    sliderContainer: {
      minHeight: '762px',
      paddingBottom: '112px',
      margin: '0 auto',
      'button.splide__arrow': {
        width: '48px',
        height: '48px',
        padding: '12px',
        background: 'var(--color-white, #fff)',
      },
      'button.splide__arrow--prev': {
        left: '-20px',
        top: '50%',
        '&[disabled]': {
          display: 'none',
        },
        '@media (max-width: 1399px)': {
          left: '-40px',
        },
      },
      'button.splide__arrow--next': {
        right: '-20px',
        top: '50%',
        '&[disabled]': {
          opacity: '0.2',
          display: 'block',
        },
        '@media (max-width: 1399px)': {
          right: '-40px',
        },
      },
    },
    sectionSliderContainer: {
      p: hasATBButton ? 'var(--spacing-3) 0' : 'var(--spacing-10) 0',
      '@media (max-height: 800px)': {
        p: 'var(--spacing-3) 0',
      },
      maxWidth: '1332px',
      '@media (max-width: 1399px)': {
        maxWidth: '1160px',
        '& .splide__slide': {
          width: '278px !important',
          height: hasATBButton ? '440px' : '400px',
        },
      },
    },
    productImage: {
      objectFit: 'cover',
      objectPosition: 'center',
      width: '324px',
      height: '405px',
      '@media (max-height: 800px)': {
        height: '320px',
        width: '290px',
      },
    },
    productContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    infoContainer: {
      padding: 'var(--spacing-4)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      minHeight: '46px',
      boxSizing: 'content-box',
      paddingBottom: hasATBButton ? '0' : '20px',
    },
    addToBagButtonContainer: {
      marginTop: 'auto',
      paddingTop: 'var(--spacing-3)',
      marginBottom: '20px',
      '@media (max-height: 800px)': {
        marginBottom: 0,
      },
    },
    productName: {
      ...theme.typography['text-body1-l'],
      fontFamily: 'var(--font-face1-extended-bold)',
      overflow: 'hidden',
      color: 'var(--color-black, #000)',
      textAlign: 'center',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      width: '100%',
    },
    strikethroughPrice: {
      ...theme.typography['text-body1-m'],
      fontFamily: 'var(--font-face1-extended-normal)',
      textDecoration: 'line-through',
      color: 'var(--color-neutral-1, #6D6D6D)',
      paddingLeft: 'var(--spacing-2)',
    },
    price: {
      ...theme.typography['text-body1-m'],
      fontFamily: 'var(--font-face1-extended-normal)',
      color: 'var(--color-price, #000)',
      '&.green': {
        color: 'var(--color-price-percentage, #057550)',
      },
    },
    priceDiscount: {
      ...theme.typography['text-body1-m'],
      fontFamily: 'var(--font-face1-extended-normal)',
      color: 'var(--color-price-percentage, #057550)',
    },
    llmPromotion: llmPromotionStyles(theme),
    rootContainerSkeleton: {
      w: '100vw',
      overflowX: 'hidden',
      pb: '112px',
      minHeight: '762px',
    },
    itemSkeleton: {
      w: '324px',
      h: '487px',
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
}
