const aeDrawerStyles = (theme) => ({
  tilePriceWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      mt: 'mar',
    },
    px: 0,
    display: 'flex',
    justifyContent: 'center',
    marginTop: 'var(--spacing-2)',
  },
  tileComparablePriceWrapper: {
    '@media (max-width: 769px)': {
      justifyContent: 'left',
      flexWrap: 'wrap',
      rowGap: 0,
    },
    gap: theme.space.s1,
    '& p': {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: theme.colors.main.black,
        fontSize: theme.fontSizes.xs,
      },
      ...theme.typography['text-body2-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
      color: theme.colors.neutral.medium,
      fontSize: theme.fontSizes.sm,
    },
  },
  tilePriceText: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      ...theme.typography['text-body1-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
    },
    ...theme.typography['text-body2-xl'],
    fontFamily: 'var(--font-face1-extended-normal)',
  },
  tileDiscount: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: theme.fontSizes.sm,
      lineHeight: 'var(--line-height-xl)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: '#057550',
    },
    ...theme.typography['text-body2-m'],
    fontFamily: 'var(--font-face1-extended-normal)',
    fontSize: theme.fontSizes.md,
  },
})

const tabbedStyles = (theme) => ({
  tileWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      width: 'calc(-0.363636rem + 36.3636vw)',
      minWidth: 'calc(-0.363636rem + 36.3636vw)',
      maxWidth: 'fit-content',
    },
  },
  tileNameWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      mt: theme.space.s,
    },
    '& p': {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: theme.fontSizes.xs,
        lineHeight: theme.lineHeights.xl,
        color: theme.colors.main.primary,
      },
    },
  },
  tilePriceWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      mt: '5px',
    },
  },
  tilePriceText: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontSize: theme.fontSizes.xs,
      lineHeight: theme.lineHeights.xl,
    },
  },
  tileStrikeoffPrice: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontSize: theme.fontSizes.xs,
      lineHeight: theme.lineHeights.xl,
    },
  },
  tileDiscount: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      fontSize: theme.fontSizes.xs,
      lineHeight: theme.lineHeights.xl,
    },
  },
})

const goneViralRecommendationStyles = (theme) => ({
  tileWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      width: '130px',
      minWidth: '130px',
      maxWidth: 'fit-content',
    },
  },
  tileNameWrapper: {
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      mt: 'var(--spacing-3)',
    },
    '& p': {
      ...theme.typography['text-body1-s'],
      fontFamily: 'var(--font-face1-extended-bold)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-extended-bold)',
      },
    },
  },
  tilePriceWrapper: {
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      marginTop: 'var(--spacing-2)',
      gap: 'var(--spacing-2)',
    },
  },
  tilePriceContainer: {
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      gap: 'var(--spacing-1)',
    },
  },
  tilePriceText: {
    ...theme.typography['text-body1-s'],
    fontFamily: 'var(--font-face1-extended-normal)',
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      ...theme.typography['text-body1-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
    },
  },
  tileComparablePriceWrapper: {
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      '& p': {
        ...theme.typography['text-body1-xs'],
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: theme.fontSizes.sm,
        color: 'var(--color-price-comp-value)',
      },
    },
    '& p': {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        color: 'var(--color-price-comp-value)',
        ...theme.typography['text-body1-xs'],
        fontFamily: 'var(--font-face1-extended-normal)',
      },
    },
  },
  tilePriceTextColor: {
    '&&': {
      color: 'var(--color-success-primary)',
    },
  },
  tileStrikeoffPrice: {
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      ...theme.typography['text-body1-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
      color: 'var(--color-price-strikethrough, #6D6D6D)',
    },
  },
  tileDiscount: {
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      ...theme.typography['text-body1-s'],
      fontFamily: 'var(--font-face1-extended-normal)',
      color: 'var(--color-success-primary)',
    },
  },
  tilePromotionsWrapper: {
    pt: 'var(--spacing-2)',
    pb: 0,
    '& *': {
      ...theme.typography['text-body1-s'],
      fontWeight: '700',
    },
  },
  addToBagButton: {
    wrapper: {
      m: `${theme.space.s2} 0`,
    },
  },
})

export default {
  parts: [
    'tileNameWrapper',
    'tilePriceWrapper',
    'tileWrapper',
    'tilePriceText',
    'clickToShopLink',
    'clickToShopbtnContainer',
    'clickToShopbtn',
    'tileStrikeoffPrice',
    'tileDiscount',
    'tileImageWrapper',
    'saveForLaterPosition',
    'tileComparablePriceWrapper',
    'tilePriceContainer',
    'addToBagButton',
    'tilePromotionsWrapper',
    'tilePriceTextColor',
    'tileContentWrapper',
    'recommendationImpressionSensor',
  ],
  baseStyle: ({ theme }) => ({
    ...theme.components.ProductItemTile.baseStyle({ theme }),
    tileNameWrapper: {
      ...theme.components.ProductItemTile.baseStyle({ theme }).tileNameWrapper,
      '& p': {
        ...theme.components.ProductItemTile.baseStyle({ theme }).tileNameWrapper?.['& p'],
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-16)',
        textAlign: 'center',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extended-bold)',
          fontSize: 'var(--text-16)',
          textAlign: 'center',
        },
      },
    },
    tilePriceWrapper: {
      ...theme.components.ProductItemTile.baseStyle({ theme }).tilePriceWrapper,
      alignItems: 'center',
      width: 'auto',
    },
    tilePriceContainer: {
      ...theme.components.ProductItemTile.baseStyle({ theme }).tilePriceContainer,
      justifyContent: 'center',
    },
    tilePriceText: {
      ...theme.components.ProductItemTile.baseStyle({ theme }).tilePriceText,
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-16)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-16)',
      },
    },
    tileStrikeoffPrice: {
      ...theme.components.ProductItemTile.baseStyle({ theme }).tileStrikeoffPrice,
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-16)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-16)',
      },
    },
    tileComparablePriceWrapper: {
      ...theme.components.ProductItemTile.baseStyle({ theme }).tileComparablePriceWrapper,
      '& p': {
        ...theme.components.ProductItemTile.baseStyle({ theme }).tileComparablePriceWrapper?.[
          '& p'
        ],
        fontFamily: 'var(--font-face1-extended-normal)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
    },
    tileDiscount: {
      ...theme.components.ProductItemTile.baseStyle({ theme }).tileDiscount,
      fontFamily: 'var(--font-face1-extended-normal)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
      },
    },
    tilePromotionsWrapper: {
      ...theme.components.ProductItemTile.baseStyle({ theme }).tilePromotionsWrapper,
      fontFamily: theme.fontFamily.primaryNormal,
      py: theme.space.s,
    },
    addToBagButton: {
      wrapper: {
        m: `${theme.space.s3} 0`,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mb: 0,
        },
      },
    },
    clickToShopLink: {
      alignSelf: 'center',
      textDecoration: 'none',
      _hover: {
        textDecoration: 'none',
      },
    },
    clickToShopbtnContainer: {
      '@media (max-width: 769px)': {
        justifyContent: 'start',
        mx: 'var(--spacing-2)',
      },
      display: 'flex',
      justifyContent: 'center',
      marginTop: 'var(--spacing-3)',
    },
    clickToShopbtn: {
      backgroundColor: theme.colors.main.secondary,
      color: theme.colors.main.black,
      borderRadius: 'var(--border-radius-xs)',
      borderColor: 'var(--color-primary)',
      border: '1px solid',
      maxWidth: '100%',
      height: '100%',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-10)',
      letterSpacing: 'var(--letter-spacing-xl)',
      lineHeight: 'var(--line-height-xs)',
      padding: 'var(--spacing-2)',
      _hover: {
        backgroundColor: `${theme.colors.main.secondary} !important`,
      },
      _active: {
        backgroundColor: theme.colors.main.secondary,
      },
    },
    tilePriceTextColor: {
      '&&': {
        color: 'var(--color-sale)',
      },
    },
    tileContentWrapper: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  }),
  variants: {
    PLP: ({ theme }) => ({
      tileWrapper: {
        w: '100%',
        maxWidth: '100%',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          w: '39.5vw',
          minWidth: '39.5vw',
        },
      },
      tileImageWrapper: {
        img: {
          h: 'inherit',
          w: 'inherit',
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s,
        },
        '& p': {
          color: 'var(--color-black-base)',
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            color: 'var(--color-primary)',
            letterSpacing: theme.letterSpacings.xs,
            lineHeight: theme.lineHeights.xl,
          },
        },
      },
      tilePriceWrapper: {
        marginTop: theme.space.s2,
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          lineHeight: theme.lineHeights.xl,
          letterSpacing: theme.letterSpacings.xs,
        },
      },
    }),
    recommendationsOnHP: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '140px',
          minWidth: '140px',
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mx: 'var(--spacing-2)',
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mx: 'var(--spacing-2)',
          marginTop: 'var(--spacing-2)',
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          lineHeight: theme.lineHeights.xl,
        },
      },
      addToBagButton: {
        wrapper: {
          mb: '0px',
        },
      },
    }),
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '130px',
          minWidth: '130px',
          maxWidth: 'fit-content',
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '9px',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-s'],
            fontFamily: 'var(--font-face1-extended-bold)',
            lineHeight: theme.lineHeights.xl,
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 0,
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          lineHeight: theme.lineHeights.xl,
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          lineHeight: theme.lineHeights.xl,
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          lineHeight: theme.lineHeights.xl,
        },
      },
      tileImageWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          img: {
            h: 'auto',
          },
        },
      },
    }),
    recommendationsOnThinkPage: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '30vw',
          minWidth: '30vw',
          maxWidth: 'fit-content',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
          overflow: 'hidden',
        },
        '.btn-wishlist-container-recommend': {
          display: 'none',
        },
      },
      tileImageWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          bg: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
          '& img': {
            objectFit: 'contain',
            objectPosition: 'center',
            width: '100%',
            height: '450px',
          },
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mx: 'var(--spacing-2)',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
          p: 'var(--spacing-8) var(--spacing-8) var(--spacing-0)',
          m: 'var(--spacing-0)',
          alignItems: 'center',
        },
        '& p': {
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-l'],
            fontFamily: 'var(--font-face1-extended-bold)',
            color: theme.colors.main.black,
            px: 0,
          },
        },
      },
      tilePriceContainer: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          gap: 'var(--spacing-1)',
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginTop: 0,
          marginBottom: 'var(--spacing-2)',
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: 'auto',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          display: 'flex',
          justifyContent: 'center',
          mb: 0,
          p: 'var(--spacing-4) var(--spacing-8)',
          m: 'var(--spacing-0)',
          backgroundColor: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
        },
      },
      tilePriceText: {
        ...theme.typography['text-body1-xs'],
        fontFamily: 'var(--font-face1-extended-normal)',
        textAlign: 'center',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: theme.colors.main.black,
        },
      },
      tileComparablePriceWrapper: {
        gap: '2px',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          gap: theme.space.s1,
          display: 'flex',
          justifyContent: 'center',
          '& p': {
            color: 'var(--color-neutral-1)',
            textAlign: 'center',
          },
        },
        '& p': {
          ...theme.typography['text-body1-xs'],
          fontFamily: 'var(--font-face1-extended-normal)',
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            color: 'var(--color-neutral-1)',
            ...theme.typography['text-body1-xs'],
            fontFamily: 'var(--font-face1-extended-normal)',
          },
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-body1-xs'],
        fontFamily: 'var(--font-face1-extended-normal)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-neutral-1)',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          color: theme.colors.neutral.medium,
        },
      },
      tileDiscount: {
        ...theme.typography['text-body1-xs'],
        fontFamily: 'var(--font-face1-extended-normal)',
      },
      addToBagButton: {
        wrapper: {
          mb: '0px',
          backgroundColor: 'transparent',
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            mt: theme.space.s,
          },
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            maxWidth: '30vw',
          },
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            backgroundColor: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
            px: 0,
            mt: 0,
            maxWidth: 'none',
            display: 'flex',
            justifyContent: 'center',
            pb: 'var(--spacing-10)',
          },
        },
        button: {
          backgroundColor: 'transparent',
          p: {
            [`@media (min-width: ${theme.breakpoints.md})`]: {
              ...theme.typography['text-cta2-xxs'],
            },
          },
        },
      },
    }),
    aeDrawer: ({ theme }) => ({
      ...aeDrawerStyles(theme),
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '148px',
          maxWidth: '148px',
          minWidth: 'none',
        },
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          width: '148px',
          maxWidth: '148px',
          marginRight: 'var(--spacing-1)',
        },
      },
      tileImageWrapper: {
        height: '185px',
        '& > div': {
          height: '185px',
        },
        '& img': {
          height: '185px',
        },
      },
      tileNameWrapper: {
        marginTop: '11px',
        mx: 0,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginTop: '3px',
        },
        '& p': {
          fontFamily: 'var(--font-face1-extended-bold)',
          fontSize: 'var(--text-16)',
          fontStyle: 'normal',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontSize: 'var(--text-12)',
            marginTop: 'var(--spacing-2)',
          },
        },
      },
      tileComparablePriceWrapper: {
        justifyContent: 'left',
        flexWrap: 'wrap',
        rowGap: 0,
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          justifyContent: 'center',
        },
        columnGap: 'var(--spacing-1)',
        '& p': {
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-14)',
          fontStyle: 'normal',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          color: 'var(--color-neutral-medium)',
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontFamily: 'var(--font-face1-extended-normal)',
            fontSize: 'var(--text-12)',
            fontStyle: 'normal',
            lineHeight: 'var(--line-height-140)',
            letterSpacing: 'var(--letter-spacing-xs)',
            color: 'var(--color-neutral-1)',
          },
        },
      },
      tilePriceContainer: {
        display: 'flex',
        columnGap: '6px',
        alignItems: 'center',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          justifyContent: 'center',
        },
      },
      tilePriceText: {
        '@media (max-width: 544px)': {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          fontStyle: 'normal',
        },
        ...theme.typography['text-body2-xl'],
        fontFamily: 'var(--font-face1-extended-normal)',
        fontStyle: 'normal',
      },
      tileStrikeoffPrice: {
        color: 'var(--color-neutral-medium)',
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-12)',
          color: 'var(--color-neutral-1)',
        },
      },
      tileDiscount: {
        '@media (max-width: 544px)': {
          ...theme.typography['text-display1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: '#057550',
        },
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-medium)',
      },
      tilePriceWrapper: {
        px: 0,
        mt: 0,
        display: 'flex',
        justifyContent: 'center',
      },
    }),
    aeDrawerGrid: ({ theme }) => ({
      ...aeDrawerStyles(theme),
      tileWrapper: {
        width: '100%',
        maxWidth: '100%',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '100%',
          maxWidth: '100%',
          minWidth: 'none',
        },
      },
      tileImageWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          height: '222px',
        },
        height: '282px',
        '& > div': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            height: '222px',
          },
          height: '282px',
        },
        '& img': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            height: '222px',
          },
          height: '282px',
        },
      },
      saveForLaterPosition: {
        right: '5px',
        top: '6px',
        button: {
          padding: '0',
        },
      },
      tileNameWrapper: {
        mt: 'var(--spacing-2)',
        mx: 0,
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body2-m'],
            fontFamily: 'var(--font-face1-extended-bold)',
            color: theme.colors.main.black,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
      },
      tilePriceText: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        fontStyle: 'normal',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          fontStyle: 'normal',
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-medium)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      tileDiscount: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-medium)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-neutral-medium)',
        },
      },
      tilePriceWrapper: {
        marginTop: 0,
        p: 0,
      },
      tilePromotionsWrapper: {
        p: 0,
      },
    }),
    recomCarouselThink: ({ theme }) => ({
      tilePriceText: {
        ...theme.typography['text-display1-xs'],
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-140)',
      },
      tilePriceContainer: {
        gap: 'var(--spacing-1)',
      },
      tileDiscount: {
        ...theme.typography['text-body1-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
      },
      addToBagButton: {
        wrapper: {
          mt: theme.space.m,
        },
      },
    }),
    similarProductRecommendation: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mr: 0,
          width: '100%',
          minWidth: '100%',
          maxWidth: 'fit-content',
        },
        width: '100%',
        maxWidth: '100%',
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 'var(--spacing-2)',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            px: 'var(--spacing-2)',
            fontSize: 'var(--text-14)',
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 'var(--spacing-2)',
          px: 'var(--spacing-2)',
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-14)',
        },
      },
    }),
    similarProductRecommendationAdaptivePDP: ({ theme }) => ({
      tileImageWrapper: {
        '& img': {
          aspectRatio: '4 / 5',
        },
      },
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mr: 0,
          width: '100%',
          minWidth: '100%',
          maxWidth: 'fit-content',
        },
        width: '100%',
        maxWidth: '100%',
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 'var(--spacing-2)',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            lineHeight: 'var(--line-height-140)',
            px: 'var(--spacing-2)',
            fontSize: 'var(--text-14)',
          },
        },
      },
      tilePriceWrapper: {
        lineHeight: 'var(--line-height-140)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 'var(--spacing-2)',
          px: 'var(--spacing-2)',
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-14)',
        },
      },
    }),
    tabbedPLP: ({ theme }) => ({
      ...tabbedStyles(theme),
      tilePriceContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          alignItems: 'baseline',
        },
      },
      tileContentWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          pb: '20px',
          backgroundColor: 'var(--color-neutral-light-1)',
        },
      },
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: 'calc(-0.363636rem + 36.3636vw)',
          minWidth: 'calc(-0.363636rem + 36.3636vw)',
          maxWidth: 'fit-content',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: '100%',
          maxWidth: 'unset',
        },
      },
      tileImageWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          img: {
            height: '100%',
            aspectRatio: '4/5',
          },
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: theme.space.s,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          m: 'var(--spacing-4) var(--spacing-4) 0',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontSize: theme.fontSizes.xs,
            lineHeight: theme.lineHeights.xl,
            color: theme.colors.main.primary,
          },
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-l'],
            fontFamily: 'var(--font-face1-extended-bold)',
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '5px',
        },
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          alignItems: 'center',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-1)',
          px: 'var(--spacing-4)',
          alignItems: 'center',
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.lineHeights.xl,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m-line-through'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-price-strikethrough, #6D6D6D)',
        },
      },
      tileComparablePriceWrapper: {
        '& p': {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-m'],
            fontFamily: 'var(--font-face1-extended-normal)',
            color: 'var(--color-price-comp-value, #6D6D6D)',
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.lineHeights.xl,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.lineHeights.xl,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      clickToShopLink: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& div': {
            m: 'var(--spacing-2) var(--spacing-4) 0',

            '& .chakra-button': {
              p: '0 !important',
            },
          },
        },
      },
      addToBagButton: {
        wrapper: {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            m: `var(--spacing-2) 0 0`,
            px: 'var(--spacing-4)',
          },
        },
      },
    }),
    tabbedPDP: ({ theme }) => ({
      ...tabbedStyles(theme),
      addToBagButton: {
        wrapper: {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            mb: theme.space.s3,
          },
        },
      },
    }),
    tabbedHP: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: 'calc(-0.363636rem + 36.3636vw)',
          minWidth: 'calc(-0.363636rem + 36.3636vw)',
          maxWidth: 'fit-content',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: '100%',
          maxWidth: 'unset',
        },
      },
      tileImageWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          img: {
            height: '100%',
            aspectRatio: '4/5',
          },
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: theme.space.s,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          m: 'var(--spacing-4) var(--spacing-4) 0',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontSize: theme.fontSizes.xs,
            lineHeight: theme.lineHeights.xl,
            color: theme.colors.main.primary,
          },
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-l'],
            fontFamily: 'var(--font-face1-extended-bold)',
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '5px',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-1)',
          px: 'var(--spacing-4)',
        },
      },
      tilePriceContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          gap: theme.space.xs,
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.lineHeights.xl,
          color: theme.colors.neutral.base,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m-line-through'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-price-strikethrough, #6D6D6D)',
        },
      },
      tileComparablePriceWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontSize: 'var(--text-14)',
          },
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-m'],
            fontFamily: 'var(--font-face1-extended-normal)',
            color: 'var(--color-price-comp-value, #6D6D6D)',
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.lineHeights.xl,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      tilePriceTextColor: {
        '&&': {
          color: 'var(--color-black-base)',
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-14)',
          lineHeight: theme.lineHeights.xl,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      clickToShopLink: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& div': {
            m: 'var(--spacing-2) var(--spacing-4) 0',

            '& .chakra-button': {
              p: '0 !important',
            },
          },
        },
      },
      addToBagButton: {
        wrapper: {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            m: `var(--spacing-2) 0 0`,
            px: 'var(--spacing-4)',
          },
        },
      },
    }),
    visuallySimilarGrid: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
        },
      },
      tileImageWrapper: {
        width: '100%',
        height: '246px',
        overflow: 'hidden',
        position: 'relative',
        img: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
        },
      },
      tileNameWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-title1-m'],
            fontFamily: 'var(--font-face1-extended-bold)',
            color: 'var(--color-neutral-dark-1)',
            mb: theme.space.s,
          },
        },
      },
      tilePriceWrapper: {
        px: theme.space.s2,
        pb: theme.space.s2,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: theme.space.s1,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          gap: 0,
        },
      },
      tilePriceContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        flexDirection: 'row',
        gap: theme.space.s1,
        flexWrap: 'wrap',
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title2-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-neutral-dark)',
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-neutral-1)',
        },
      },
      tileComparablePriceWrapper: {
        display: 'flex',
        justifyContent: 'center',
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-title1-s'],
            fontFamily: 'var(--font-face1-extended-normal)',
            color: 'var(--color-neutral-1)',
          },
        },
      },
      saveForLaterPosition: {
        display: 'none !important',
      },
      recommendationImpressionSensor: {
        height: '100%',
      },
    }),
    inlinePDPv6: ({ theme }) => ({
      ...tabbedStyles(theme),
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-1)',
          '& p': {
            color: 'var(--color-neutral-dark-1)',
            lineHeight: 'var(--line-height-125)',
            letterSpacing: 'var(--letter-spacing-xs)',
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          letterSpacing: 'var(--letter-spacing-xs)',
          lineHeight: 'var(--line-height-135)',
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          letterSpacing: 'var(--letter-spacing-xs)',
          marginBottom: '-4px',
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-14)',
          letterSpacing: 'var(--letter-spacing-xs)',
          lineHeight: 'var(--line-height-135)',
          marginBottom: '-4px',
        },
      },
      tileComparablePriceWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            fontSize: 'var(--text-10)',
            lineHeight: 'var(--line-height-125)',
            letterSpacing: 'var(--letter-spacing-xs)',
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 'var(--spacing-2)',
        },
      },
    }),
    pdpv6: () => ({
      tileWrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minWidth: 0,
      },
      tileImageWrapper: {
        borderRadius: '8px',
        border: '1px solid var(--color-neutral-light-2)',
        height: '100% !important',
        width: '100% !important',
        maxWidth: '120px !important',
        flex: 1,
        overflow: 'hidden',
        img: {
          width: '100% !important',
          height: '100% !important',
          objectFit: 'contain',
          aspectRatio: '1',
          borderRadius: 'var(--border-radius-none) !important',
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
    goneViralRecommendation: ({ theme }) => ({
      ...goneViralRecommendationStyles(theme),
    }),
    goneViralRecommendationPLP: ({ theme }) => ({
      ...goneViralRecommendationStyles(theme),
    }),
    metaPLP: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
        },
      },
      tileImageWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          img: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          },
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s2,
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-m'],
            fontFamily: 'var(--font-face1-extended-bold)',
            mx: 'var(--spacing-4)',
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-success-primary)',
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mx: 'var(--spacing-4)',
        },
      },
      tileComparablePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '& p': {
            color: 'var(--color-price-comp-value)',
          },
        },
      },
      addToBagButton: {
        wrapper: {
          marginTop: theme.space.s2,
        },
      },
    }),
    postATBMobile: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          width: '35vw',
          minWidth: '166px',
          maxWidth: 'unset',
        },
      },
      addToBagButton: {
        wrapper: {
          m: `${theme.space.s1} 0`,
        },
      },
      tileImageWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          borderRadius: 'var(--border-radius-l)',
          '& div': {
            p: '0 !important',
          },
          '& img': {
            borderRadius: 'var(--border-radius-l)',
            objectFit: 'contain',
            aspectRatio: '1',
          },
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 'var(--spacing-2)',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-title1-s'],
            fontFamily: 'var(--font-face1-extended-bold)',
            color: 'var(--color-neutral-dark)',
            textAlign: 'center',
          },
        },
      },
      tilePriceWrapper: {
        alignItems: 'center',
        textAlign: 'center',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          width: '100%',
          alignItems: 'center',
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 'var(--spacing-1)',
          marginTop: 'var(--spacing-1)',
          textAlign: 'center',
        },
      },
      tileComparablePriceWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-title1-s'],
            fontFamily: 'var(--font-face1-extended-normal)',
            color: 'var(--color-neutral-dark)',
          },
        },
      },
      tilePriceContainer: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-2)',

          '& span': {
            ...theme.typography['text-title1-s'],
            fontFamily: 'var(--font-face1-extended-normal)',
          },
          '& .tile-price-text': {
            display: 'block',
            width: '100%',
            textAlign: 'center',
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-neutral-dark-1)',
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-neutral-1)',
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-success-primary)',
        },
      },
    }),
    postAddToCartDrawer: ({ theme }) => ({
      tileWrapper: {
        width: 'auto',
        maxWidth: '192px',
      },
      tileImageWrapper: {
        borderRadius: 'var(--border-radius-l)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-neutral-light-1)',
        '& img': {
          aspectRatio: '1',
          height: 'auto',
        },
      },
      tileNameWrapper: {
        marginLeft: 0,
        marginRight: 0,
        marginTop: 'var(--spacing-2)',
        '& p': {
          ...theme.typography['text-title1-m'],
          fontFamily: 'var(--font-face1-extended-bold)',
          color: 'var(--color-neutral-dark)',
        },
      },
      tilePriceWrapper: {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: 'var(--spacing-1)',
      },
      tilePriceText: {
        ...theme.typography['text-title1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-dark-1)',
      },
      tilePriceContainer: {
        gap: 'var(--spacing-2)',
      },
      tileComparablePriceWrapper: {
        marginBottom: 'var(--spacing-1)',
        '& p': {
          ...theme.typography['text-title1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-neutral-dark)',
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-title1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-dark)',
      },
      tileDiscount: {
        ...theme.typography['text-title1-s'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-success-primary)',
      },
    }),
  },
}
