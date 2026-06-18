import { llmPromotionStyles } from 'toro/components/product/desktop/RecommendationsSlider/themes/theme'

export default {
  baseStyle: ({ theme }) => ({
    rootContainerSkeleton: {
      w: '100vw',
      overflowX: 'hidden',
      background: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
    },
    itemSkeleton: {
      width: '40.53vw',
      minWidth: '40.53vw',
      maxWidth: 'fit-content',
      h: '250px',
    },
    titleSkeleton: {
      w: '350px',
      h: '48px',
    },
    gridWrapperSkeleton: {
      mt: 'var(--spacing-10)',
    },
    gridSkeleton: {
      w: '100%',
      gridColumnGap: 'var(--chakra-space-mar)',
      gridTemplateColumns: `repeat(5, 1fr)`,
    },
    productName: {
      ...theme.typography['text-display4-xxs'],
      textAlign: 'unset',
    },
    strikethroughPrice: {
      ...theme.typography['text-body1-s'],
    },
    price: {
      ...theme.typography['text-title2-m'],
    },
    priceDiscount: {
      ...theme.typography['text-body1-s'],
    },
  }),
  variants: {
    visuallySimilarPDPv6: ({ theme }) => ({
      sectionSliderContainer: {
        pt: 'var(--spacing-3)',
        '& .splide__slide > *': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        },
      },
      productContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
        pb: 'var(--spacing-2)',
        height: '100%',
      },
      infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)',
        pt: 0,
      },
      productName: {
        ...theme.typography['text-body1-l'],
        fontWeight: '400',
        mt: 'var(--spacing-1)',
        textAlign: 'center',
      },
      addToBagButtonContainer: {
        marginTop: 'auto',
        marginBottom: 0,
        wrapper: {
          my: 0,
        },
      },
    }),
    visuallySimilarPDPv7: ({ theme }) => ({
      sectionSliderContainer: {
        mt: 'var(--spacing-3)',
        ...theme.typography['text-display1-xl'],
        textAlign: 'center',
        fontWeight: 400,
        lineHeight: 'var(--line-height-100)',

        '& .splide__track > .splide__list': {
          gap: '10px !important',
        },

        '& .splide__arrows': {
          display: 'none',
        },
        '& .splide__slide': {
          width: '40.53vw !important',
          minWidth: '40.53vw !important',
          maxWidth: 'fit-content',
          m: '0 !important',
        },
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
        minHeight: 0,
        pb: 'var(--spacing-2)',
        maxWidth: '100%',
        overflowX: 'hidden',
      },
      productImage: {
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
        flexShrink: 0,
        aspectRatio: '228 / 285',
        objectFit: 'cover',
        objectPosition: 'center',
      },
      infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        alignItems: 'flex-start',
        pt: 0,
        minHeight: 0,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        flex: '1 1 auto',
      },
      productName: {
        mt: 'var(--spacing-1)',
        ...theme.typography['text-body2-m'],
        textAlign: 'left',
        display: 'inline-block',
        maxWidth: '100%',
        fontWeight: 'normal',
        fontSize: 'var(--text-16)',
        color: theme.colors.main.black,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      llmPromotion: {
        ...llmPromotionStyles(theme),
        width: '100%',
        maxWidth: '100%',
        flexShrink: 0,
        my: 'var(--spacing-1)',
        textAlign: 'left',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
        '& p, & span, & div, & a, & li': {
          maxWidth: '100%',
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
        },
      },
      button: {
        width: '100%',
        minHeight: '48px',
        padding: 'var(--spacing-4) var(--spacing-6)',
        borderRadius: 'var(--border-radius-full)',
        '& svg': {
          display: 'none',
        },
      },
      buttonText: {
        ...theme.typography['text-body1-l'],
        fontSize: 'var(--text-16)',
        fontWeight: 400,
        lineHeight: 'var(--line-height-135)',
      },
      addToBagButtonContainer: {
        marginTop: 'auto',
        paddingTop: 'var(--spacing-3)',
        width: '100%',
        flexShrink: 0,
        marginBottom: 0,
        '& svg': {
          display: 'none',
        },
        wrapper: {
          my: 0,
        },
      },
      itemSkeleton: {
        w: '40.53vw',
        minW: '40.53vw',
        maxW: '40.53vw',
        h: 'auto',
        aspectRatio: '228 / 285',
      },
      gridWrapperSkeleton: {
        mt: 'var(--spacing-6)',
      },
    }),
    recentlyViewedV7: ({ theme }) => ({
      sectionSliderContainer: {
        mt: 'var(--spacing-3)',
        paddingLeft: 'var(--spacing-3)',
        ...theme.typography['text-display1-xl'],
        textAlign: 'center',
        fontWeight: 400,
        lineHeight: 'var(--line-height-100)',
        '& .splide__arrows': {
          display: 'none',
        },
        '& .splide__slide': {
          width: '40.53vw !important',
          minWidth: '40.53vw !important',
          maxWidth: 'fit-content',
        },
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
        minHeight: 0,
        pb: 'var(--spacing-2)',
        maxWidth: '100%',
        overflowX: 'hidden',
      },
      productImage: {
        width: '100%',
        maxWidth: '100%',
        height: 'auto',
        flexShrink: 0,
        aspectRatio: '228 / 285',
        objectFit: 'cover',
        objectPosition: 'center',
      },
      infoContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        alignItems: 'flex-start',
        pt: 0,
        minHeight: 0,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
        flex: '1 1 auto',
      },
      productName: {
        mt: 'var(--spacing-1)',
        ...theme.typography['text-body2-m'],
        textAlign: 'left',
        display: 'inline-block',
        maxWidth: '100%',
        fontWeight: 'normal',
        fontSize: 'var(--text-16)',
        color: 'var(--color-text-primary, #1C1C1C)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      llmPromotion: {
        ...llmPromotionStyles(theme),
        width: '100%',
        maxWidth: '100%',
        flexShrink: 0,
        my: 'var(--spacing-1)',
        textAlign: 'left',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
        '& p, & span, & div, & a, & li': {
          maxWidth: '100%',
        },
        '& img': {
          maxWidth: '100%',
          height: 'auto',
        },
      },
      button: {
        width: '100%',
        minHeight: '48px',
        padding: 'var(--spacing-4) var(--spacing-6)',
        borderRadius: 'var(--border-radius-full)',
        '& svg': {
          display: 'none',
        },
      },
      buttonText: {
        ...theme.typography['text-body1-l'],
        fontSize: 'var(--text-16)',
        fontWeight: 400,
        lineHeight: 'var(--line-height-135)',
      },
      addToBagButtonContainer: {
        marginTop: 'auto',
        paddingTop: 'var(--spacing-3)',
        width: '100%',
        flexShrink: 0,
        marginBottom: 0,
        '& svg': {
          display: 'none',
        },
        wrapper: {
          my: 0,
        },
      },
      itemSkeleton: {
        w: '40.53vw',
        minW: '40.53vw',
        maxW: '40.53vw',
        h: 'auto',
        aspectRatio: '228 / 285',
      },
      gridWrapperSkeleton: {
        mt: 'var(--spacing-6)',
      },
    }),
  },
}
