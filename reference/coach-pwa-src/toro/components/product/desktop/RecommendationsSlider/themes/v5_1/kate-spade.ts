export default {
  parts: [
    'sliderContainer',
    'sectionSliderContainer',
    'productImage',
    'productName',
    'addToBagButtonContainer',
  ],
  baseStyle: ({ theme }) => ({
    productName: {
      ...theme.typography['text-body1-l'],
    },
    strikethroughPrice: {
      ...theme.typography['text-body1-m'],
    },
    price: {
      ...theme.typography['text-body1-m'],
      fontWeight: 700,
    },
    priceDiscount: {
      ...theme.typography['text-body1-m'],
    },
  }),
  variants: {
    pdpv5_1: () => ({
      sliderContainer: {
        minHeight: 'auto',
        pb: '36px',
        'button.splide__arrow': {
          background: 'none',
        },
        'button.splide__arrow--prev': {
          left: '-66px !important',
        },
        'button.splide__arrow--next': {
          right: '-66px !important',
        },
      },
      sectionSliderContainer: {
        p: 'var(--spacing-10) 0 0 !important',
        maxWidth: '1350px',
        '@media (max-width: 1482px)': {
          maxWidth: 'calc(100vw - 150px)', // 150px = left arrow + right arrow + 18px last gap
          '& .splide__slide': {
            width: 'auto !important',
            height: 'auto',
          },
        },
      },
      productImage: {
        '@media (max-width: 1482px)': {
          width: 'calc(25vw - 51px)', // 51px = (space for arrows / 4) + slide gap
          height: 'auto',
        },
      },
      productName: {
        fontWeight: 400,
        letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
        '@media (max-width: 1482px)': {
          width: 'calc(25vw - 83px)', // 83px = (space for arrows / 4) + slide gap + infoContainer paddings
        },
      },
      addToBagButtonContainer: {
        marginTop: 'auto',
        paddingTop: 'var(--spacing-3)',
        marginBottom: 0,
      },
    }),
  },
}
