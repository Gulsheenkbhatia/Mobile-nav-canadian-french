const discountTypeography = {
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-14)',
  fontWeight: 400,
  letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
  lineHeight: 'var(--line-height-140)',
}

export default {
  parts: [
    'tileWrapper',
    'tileImageWrapper',
    'tileNameWrapper',
    'tilePriceWrapper',
    'tileComparablePriceWrapper',
    'tilePriceContainer',
    'tilePriceText',
    'tileStrikeoffPrice',
    'tileDiscount',
    'addToBagButton',
  ],
  variants: {
    pdpv5_1: () => ({
      tileWrapper: {
        width: 'auto',
        maxWidth: 'none',
      },
      tileImageWrapper: {
        img: {
          objectPosition: 'center center',
          aspectRatio: '4/5',
          width: '324px',
          height: 'auto',
          '@media (max-width: 1482px)': {
            width: 'calc(25vw - 51px)', // 51px = (space for arrows / 4) + slide gap
            height: 'auto',
          },
        },
      },
      tileNameWrapper: {
        mt: 0,
        p: 'var(--spacing-4) var(--spacing-4) 0',
        '& p': {
          color: 'var(--color-black-base)',
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-16)',
          lineHeight: 'var(--line-height-135)',
          fontWeight: 400,
          letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
          '@media (max-width: 1482px)': {
            width: 'calc(25vw - 83px)', // 83px = (space for arrows / 4) + slide gap + infoContainer paddings
          },
        },
      },
      tilePriceWrapper: {
        mt: 'var(--spacing-3)',
        p: '0 var(--spacing-4)',
      },
      tileComparablePriceWrapper: {
        '& p': {
          color: '#6D6D6D', // missing in design tokens
          ...discountTypeography,
        },
      },
      tilePriceContainer: {
        '& .tile-price-text': {
          color: 'var(--color-price, #000) !important', // removing color preference dependency and handling all color overrides via styles
        },
      },
      tilePriceText: {
        color: 'var(--color-price, #000)',
        fontFamily: 'var(--font-face1-medium)',
        fontWeight: 700,
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
      },
      tileStrikeoffPrice: {
        ...discountTypeography,
        color: 'var(--color-price-strikethrough, #6D6D6D)',
      },
      tileDiscount: {
        ...discountTypeography,
        color: 'var(--color-price-percentage, #057550)',
      },
      addToBagButton: {
        wrapper: {
          m: 'var(--spacing-3) 0 0',
        },
      },
    }),
    similarOptionPDPv5_1: ({ theme }) => ({
      tileWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      },
      tileImageWrapper: {
        borderRadius: 'var(--border-radius-none)',
        border: '0 none',
        height: '100% !important',
        width: '100% !important',
        maxWidth: '200px',
        flex: 1,
        overflow: 'hidden',
        img: {
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: 'var(--border-radius-none) !important',
          aspectRatio: '1',
        },
        '& .aspect-ratio': {
          display: 'none',
        },
      },
      tileNameWrapper: {
        display: 'none !important',
      },
      tilePriceWrapper: {
        display: 'none !important',
      },
      tilePromotionsWrapper: {
        display: 'none !important',
      },
      addToBagButton: {
        wrapper: {
          display: 'none !important',
        },
      },
    }),
  },
}
