const drawerBodyStyles = {
  tileNameWrapper: (theme) => ({
    display: 'flex',
    justifyContent: 'left',
    padding: 0,
    alignItems: 'center',
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      justifyContent: 'center',
      paddingTop: 'var(--spacing-2)',
    },
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      justifyContent: 'flex-start',
      paddingBottom: '3.5px',
      marginLeft: 0,
    },
    paddingTop: 'var(--spacing-2)',
  }),
  tileComparablePriceWrapper: (theme) => ({
    paddingBottom: '2px',
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      justifyContent: 'left',
    },
  }),
  tilePriceWrapper: (theme) => ({
    marginTop: '6px !important',
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      marginTop: '0px !important',
    },
  }),
  tilePriceContainer: (theme) => ({
    alignItems: 'center',
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      justifyContent: 'left',
    },
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      justifyContent: 'center',
    },
  }),
  tilePriceContainerSpan: (theme) => ({
    fontStyle: 'normal',
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      letterSpacing: 'var(--letter-spacing-s)',
    },
  }),
  tileImageWrapper: {
    backgroundColor: 'var(--color-product-image-bg)',
  },
}

const goneViralRecommendationStyles = (theme) => ({
  tilePriceWrapper: {
    gap: 'var(--spacing-1)',
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      mt: 'var(--spacing-1)',
    },
  },
  tilePriceTextColor: {
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      '&&': {
        ...theme.typography['text-body2-s'],
      },
    },
  },
  tileComparablePriceWrapper: {
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      '& p': {
        ...theme.typography['text-body1-xs'],
        fontWeight: 'normal',
      },
    },
    '& p': {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-xs'],
        fontWeight: 'normal',
        color: 'var(--color-neutral-dark)',
        fontSize: theme.fontSizes.xxs,
      },
    },
  },
  tileNameWrapper: {
    '& p': {
      ...theme.typography['text-body1-s'],
      fontWeight: 'normal',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-s'],
        fontWeight: 'normal',
      },
    },
  },
  tilePriceText: {
    ...theme.typography['text-body1-s'],
    fontWeight: 'normal',
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      ...theme.typography['text-body1-s'],
      fontWeight: 'normal',
    },
    tileStrikeoffPrice: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-s'],
        fontWeight: 'normal',
      },
    },
    tileDiscount: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-s'],
        fontWeight: 'normal',
      },
    },
  },
})

/** PDP v7 vertical stack: image | meta + inline ATB (grid on tileContentWrapper). */
const recommendationsStackTileLayout = ({ theme }) => ({
  tileContentWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    columnGap: 'var(--spacing-3)',
    rowGap: 'var(--spacing-2)',
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%',
    minWidth: 0,
    height: 'auto',
  },
  tileWrapper: {
    display: 'contents',
    minWidth: 0,
    '& > a': {
      display: 'contents',
      textDecoration: 'none',
      color: 'inherit',
    },
  },
  tileImageWrapper: {
    gridColumn: 1,
    gridRow: '1 / -1',
    width: '100%',
    maxWidth: '132px',
    minWidth: '96px',
    alignSelf: 'start',
    img: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: 'none',
      aspectRatio: 'initial',
    },
  },
  tileMetaColumn: {
    gridColumn: 2,
    gridRow: 1,
    alignSelf: 'stretch',
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '0',
    pr: 'var(--spacing-1)',
  },
  tileNameWrapper: {
    mt: 0,
    width: '100%',
    textAlign: 'left',
    '& p': {
      ...theme.typography['text-body1-s'],
      fontFamily: theme.fontFamily.primaryNormal,
      lineHeight: theme.lineHeights.xl,
      textAlign: 'left',
    },
  },
  tilePriceWrapper: {
    mt: 0,
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  tilePriceText: {
    ...theme.typography['text-body1-s'],
    fontFamily: theme.fontFamily.primaryNormal,
    lineHeight: theme.lineHeights.xl,
  },
  tileStrikeoffPrice: {
    ...theme.typography['text-body1-s'],
    fontFamily: theme.fontFamily.primaryNormal,
    [`@media (max-width: ${theme.breakpoints.md})`]: {
      fontFamily: theme.fontFamily.primaryNormal,
      fontSize: 'var(--text-14)',
    },
  },
  tileDiscount: {
    ...theme.typography['text-body1-s'],
    fontFamily: theme.fontFamily.primaryNormal,
  },
  addToBagButton: {
    wrapper: {
      width: '100%',
      maxWidth: '100%',
      alignSelf: 'stretch',
      m: 0,
      mb: 0,
      mt: 'var(--spacing-2)',
    },
  },
  saveForLaterPosition: {
    position: 'relative',
    top: 'auto',
    right: 'auto',
    left: 'auto',
    justifySelf: 'start',
  },
  recommendationImpressionSensor: {
    width: '100%',
    maxWidth: '100%',
    display: 'block',
  },
})

export default {
  parts: [
    'tileContentWrapper',
    'tileMetaColumn',
    'tileNameWrapper',
    'tilePriceText',
    'tileDiscount',
    'tilePriceWrapper',
    'tileWrapper',
    'tileComparablePriceWrapper',
    'tileImageWrapper',
    'tileStrikeoffPrice',
    'tilePriceContainer',
    'tilePriceTextColor',
    'clickToShopLink',
    'addToBagButton',
    'recommendationImpressionSensor',
  ],
  baseStyle: ({ theme }) => ({
    ...theme.components.ProductItemTile.baseStyle({ theme }),
    tileNameWrapper: {
      mx: 0,
      mt: 'var(--spacing-4)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mt: 'var(--spacing-3)',
      },
      '& p': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: 'var(--text-14)',
        fontFamily: 'var(--font-face1-medium)',
        textAlign: 'center',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 'normal',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontWeight: 'normal',
          fontSize: 'var(--text-16)',
          textAlign: 'left',
        },
      },
    },
    tilePriceWrapper: {
      alignItems: 'center',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        flexDirection: 'column',
        mt: 'var(--spacing-2)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
    },
    tilePriceText: {
      color: 'var(--color-neutral-base)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-135)',
      fontFamily: 'var(--font-face1-medium)',
      fontWeight: 'normal',
      textAlign: 'left',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-medium)',
        fontWeight: 'normal',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-140)',
      },
    },
    tilePriceTextColor: {
      '&&': {
        color: 'var(--color-error-primary)',
      },
    },
    tileDiscount: {
      '&&': {
        color: 'var(--color-error-primary)',
      },
      fontFamily: 'var(--font-face2-normal)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face2-normal)',
      },
    },
    tileStrikeoffPrice: {
      fontFamily: 'var(--font-face2-normal)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face2-normal)',
      },
    },
    tileComparablePriceWrapper: {
      '& p': {
        fontFamily: 'var(--font-face2-normal)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
        },
      },
    },
  }),
  variants: {
    PLP: ({ theme }) => ({
      tileWrapper: {
        width: 'inherit',
        maxWidth: 'inherit',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          width: '36.5vw',
          minWidth: '36.5vw',
        },
      },
      tileImageWrapper: {
        img: {
          h: 'inherit',
          aspectRatio: '4/5',
        },
      },
      saveForLaterPosition: {
        top: 'var(--spacing-6)',
      },
      tileNameWrapper: {
        mt: 'var(--spacing-3)',
        '& p': {
          fontFamily: 'var(--font-face1-normal)',
          textAlign: 'center',
          fontSize: 'var(--text-16)',
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            fontWeight: 400,
            fontFamily: 'var(--font-face1-normal)',
            textAlign: 'center',
            fontSize: 'var(--text-12)',
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-1)',
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
      tilePriceText: {
        color: 'var(--color-black-base)',
        textAlign: 'center',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 700,
        fontSize: 'var(--text-14)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-bold)',
          fontWeight: 700,
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-140)',
        },
      },
    }),
    recommendationsOnHP: ({ theme }) => ({
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '& p': {
            ...theme.typography['text-body1-m'],
          },
          pl: theme.space.s1,
          mx: 0,
        },
        '& p': {
          ...theme.typography['text-body1-m'],
          textAlign: 'center',
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            textAlign: 'left',
          },
        },
      },
      tilePriceWrapper: {
        mt: 'var(--spacing-1)',
        alignItems: 'center',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          px: 'var(--spacing-2)',
          marginTop: 'var(--spacing-1)',
          mx: 0,
          alignItems: 'center',
        },
      },
      tileComparablePriceWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body2-xs'],
            fontWeight: 500,
          },
        },
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          justifyContent: 'center',
        },
      },
      tilePriceText: {
        ...theme.typography['text-body2-m'],
        fontWeight: 500,
        color: 'var(--color-black-base)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
          p: '0px',
        },
      },
      tileDiscount: {
        ...theme.typography['text-body2-m'],
        fontWeight: 500,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-body2-m'],
        fontWeight: 500,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
          color: 'var(--color-neutral-base)',
        },
      },
      addToBagButton: {
        wrapper: {
          marginTop: 'var(--spacing-2)',
        },
      },
    }),
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s,
          '& p': {
            fontWeight: 'normal',
            ...theme.typography['text-body1-m'],
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s1,
          px: theme.space.s0,
          alignItems: 'flex-start',
        },
      },
      tileComparablePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s1,
          '& p': {
            ...theme.typography['text-body1-s'],
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontWeight: 'normal',
          ...theme.typography['text-body1-m'],
          pt: theme.space.s0,
        },
      },
      tilePriceTextColor: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '&&': {
            ...theme.typography['text-body1-m'],
            color: 'var(--color-sale, #D50032)',
          },
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontWeight: 'normal',
          ...theme.typography['text-body1-m'],
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontWeight: 'normal',
          ...theme.typography['text-body1-m'],
        },
      },
      tileImageWrapper: {
        backgroundColor: 'var(--color-neutral-light-1, #f1f1f1)',
        aspectRatio: 'auto 0.759',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          div: {
            aspectRatio: 'auto 0.759',
          },
        },
      },
      addToBagButton: {
        wrapper: {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            justifyContent: 'flex-start',
            mt: theme.space.s2,
          },
        },
      },
    }),
    recommendationsStack: recommendationsStackTileLayout,
    aeDrawerGrid: ({ theme }) => ({
      tileImageWrapper: drawerBodyStyles.tileImageWrapper,
      tileNameWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-l'],
            textAlign: 'left',
            fontWeight: 'normal',
          },
        },
        marginTop: 'var(--spacing-2)',
        marginBottom: 0,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginTop: 'var(--spacing-2)',
        },
        ...drawerBodyStyles.tileNameWrapper(theme),
        alignItems: 'center',
      },
      tilePriceWrapper: {
        p: 0,
        alignItems: 'center',
        ...drawerBodyStyles.tilePriceWrapper(theme),
      },
      tileComparablePriceWrapper: {
        justifyContent: 'center',
        columnGap: 'var(--spacing-1)',
        flexWrap: 'wrap',
        '& p': {
          ...theme.typography['text-body2-m'],
          color: 'var(--color-neutral-base)',
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          fontWeight: 500,
          lineHeight: 'var(--line-height-135)',
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontWeight: 'unset',
            ...theme.typography['text-body2-s'],
            color: 'var(--color-neutral-dark)',
          },
        },
        ...drawerBodyStyles.tileComparablePriceWrapper(theme),
      },
      tilePriceContainer: {
        ...drawerBodyStyles.tilePriceContainer(theme),
        '& span': {
          ...drawerBodyStyles.tilePriceContainerSpan(theme),
        },
      },
      tilePriceText: {
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,
        textAlign: 'left',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontWeight: 400,
          textAlign: 'left',
          ...theme.typography['text-body2-s'],
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,
        color: 'var(--color-neutral-base)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          color: '#696969', //does not exist in design tokens
          fontWeight: 400,
          lineHeight: 'var(--line-height-140)',
        },
      },
      tileDiscount: {
        ...theme.typography['text-body2-s'],
        color: '#cc0000', //does not exist in design tokens
        fontWeight: 500,
        lineHeight: 'var(--line-height-135)',
        fontFamily: 'var(--font-face1-normal)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-s'],
          color: '#cc0000', //does not exist in design tokens
          fontWeight: 500,
          lineHeight: 'var(--line-height-135)',
          fontFamily: 'var(--font-face1-normal)',
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: theme.fontFamily.primaryNormal,
        },
      },
    }),
    aeDrawerGridSocial: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          width: 'auto',
          minWidth: 0,
        },
      },
      tileImageWrapper: drawerBodyStyles.tileImageWrapper,
      tileNameWrapper: {
        marginTop: 'var(--spacing-2)',
        marginBottom: 0,
        ...drawerBodyStyles.tileNameWrapper(theme),
        alignItems: 'center',

        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-3)',
          mb: 'var(--spacing-2)',
          padding: 0,
          justifyContent: 'center',
        },

        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-m'],
            textAlign: 'center',
          },
        },
      },
      tilePriceWrapper: {
        p: 0,
        alignItems: 'center',
        ...drawerBodyStyles.tilePriceWrapper(theme),
      },
      tileComparablePriceWrapper: {
        justifyContent: 'center',
        columnGap: 'var(--spacing-1)',
        flexWrap: 'wrap',
        '& p': {
          ...theme.typography['text-body2-m'],
          color: 'var(--color-neutral-base)',
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          fontWeight: 500,
          lineHeight: 'var(--line-height-135)',
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            ...theme.typography['text-body2-s'],
            color: 'var(--color-neutral-dark)',
          },
        },
        ...drawerBodyStyles.tileComparablePriceWrapper(theme),
      },
      tilePriceContainer: {
        ...drawerBodyStyles.tilePriceContainer(theme),
        '& span': {
          ...drawerBodyStyles.tilePriceContainerSpan(theme),
        },
      },
      tilePriceText: {
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,

        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-s'],
          fontWeight: 600,
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,
        color: 'var(--color-neutral-base)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-s'],
          fontFamily: 'var(--font-face1-normal)',
          color: '#696969', //does not exist in design tokens
          fontWeight: 400,
          lineHeight: 'var(--line-height-140)',
        },
      },
      tileDiscount: {
        ...theme.typography['text-body2-s'],
        color: '#cc0000', //does not exist in design tokens
        fontWeight: 500,
        lineHeight: 'var(--line-height-135)',
        fontFamily: 'var(--font-face1-normal)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-s'],
          color: '#cc0000', //does not exist in design tokens
          fontWeight: 500,
          lineHeight: 'var(--line-height-135)',
          fontFamily: 'var(--font-face1-normal)',
        },
      },

      addToBagButton: {
        wrapper: {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            mt: 'var(--spacing-4)',
            mb: 0,
          },
        },
      },
    }),
    aeDrawer: ({ theme }) => ({
      tileNameWrapper: {
        '& p': {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
          fontSize: 'var(--text-14)',
          fontFamily: 'var(--font-face1-normal)',
          marginBottom: 'var(--spacing-1)',
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            fontSize: 'var(--text-14)',
            marginBottom: '0px',
          },
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontFamily: 'var(--font-face1-normal)',
            textAlign: 'center',
          },
        },
        ...drawerBodyStyles.tileNameWrapper(theme),
      },
      tileComparablePriceWrapper: {
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: 'var(--spacing-1)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          marginBottom: '2px',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          marginBottom: 'var(--spacing-2)',
        },
        '& p': {
          ...theme.typography['text-body2-m'],
          color: 'var(--color-neutral-base)',
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          fontWeight: 500,
          lineHeight: 'var(--line-height-135)',
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontFamily: 'var(--font-face1-normal)',
            textAlign: 'center',
            color: '#696969', //does not exist in design tokens
            fontWeight: 500,
            lineHeight: 'var(--line-height-135)',
          },
        },
        ...drawerBodyStyles.tileComparablePriceWrapper(theme),
      },
      tilePriceWrapper: {
        marginTop: '2px',
        alignItems: 'center',
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          alignItems: 'center',
        },
        ...drawerBodyStyles.tilePriceWrapper(theme),
      },
      tilePriceText: {
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontWeight: 700,
          ...theme.typography['text-body1-s'],
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 500,
        color: 'var(--color-neutral-base)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-normal)',
          fontSize: 'var(--text-14)',
          color: '#696969', //does not exist in design tokens
          fontWeight: 400,
          lineHeight: 'var(--line-height-140)',
        },
      },
      tileDiscount: {
        ...theme.typography['text-body2-s'],
        color: '#cc0000', //does not exist in design tokens
        fontWeight: 500,
        lineHeight: 'var(--line-height-135)',
        fontFamily: 'var(--font-face1-normal)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: theme.fontFamily.primaryNormal,
        },
      },
      tilePriceContainer: {
        ...drawerBodyStyles.tilePriceContainer(theme),
        '& span': {
          ...drawerBodyStyles.tilePriceContainerSpan(theme),
        },
      },
    }),
    similarProductRecommendation: ({ theme }) => ({
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-2)',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            px: 'var(--spacing-2)',
            fontSize: 'var(--text-14)',
            textAlign: 'center',
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          alignItems: 'center',
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-14)',
          fontFamily: 'var(--font-face1-normal)',
          textAlign: 'center',
        },
      },
    }),
    tabbedPLP: ({ theme }) => ({
      tileContentWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          pb: 0,
          backgroundColor: 'unset',
        },
      },
      tileImageWrapper: {
        '& img': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            h: '198px',
          },
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          img: {
            aspectRatio: '0.8',
          },
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          m: 'var(--spacing-3) 0 0',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            fontSize: theme.fontSizes.xs,
            lineHeight: theme.lineHeights.xl,
            color: theme.colors.main.primary,
          },
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-m'],
            textAlign: 'center',
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s1,
          alignItems: 'flex-start',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          px: '0',
          gap: 'var(--spacing-1)',
          alignItems: 'center',
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: theme.fontFamily.primaryBold,
          fontWeight: 700,
        },
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.lineHeights.lg,
          fontWeight: 500,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.lineHeights.lg,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: theme.fontSizes.xs,
          lineHeight: theme.lineHeights.lg,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
        },
      },
      tileComparablePriceWrapper: {
        mb: theme.space.s1,
        '& p': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            color: theme.colors.neutral.dark,
            fontSize: theme.fontSizes.xxs,
            lineHeight: theme.lineHeights.lg,
            letterSpacing: theme.letterSpacings.xs,
          },
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body2-xs'],
            fontWeight: 500,
          },
        },
      },
      clickToShopLink: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& div': {
            mt: 'var(--spacing-2)',
          },
        },
      },
      addToBagButton: {
        wrapper: {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            px: 0,
          },
        },
        button: {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            '& p': {
              ...theme.typography['text-body1-s'],
            },
          },
        },
      },
    }),
    tabbedHP: ({ theme }) => ({
      tileContentWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          pb: 0,
        },
      },
      tileImageWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          img: {
            aspectRatio: '0.8',
          },
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          m: 'var(--spacing-3) 0 0',
          alignItems: 'center',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            fontSize: theme.fontSizes.xs,
          },
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-m'],
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.xs,
          gap: theme.space.xs,
          alignItems: 'flex-start',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          px: '0',
          gap: 'var(--spacing-1)',
          alignItems: 'center',
        },
      },
      tileComparablePriceWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            ...theme.typography['text-body1-s'],
            color: 'var(--color-neutral-dark)',
            fontWeight: 400,
            fontSize: 'var(--text-10)',
          },
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body2-xs'],
            fontWeight: 500,
          },
        },
      },
      tilePriceTextColor: {
        '&&': {
          color: theme.colors.main.black,
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-s'],
          fontSize: 'var(--text-12)',
          fontWeight: 500,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: theme.fontFamily.primaryBold,
          fontWeight: 700,
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          color: theme.colors.neutral.dark,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontSize: 'var(--text-12)',
          fontWeight: 400,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 500,
        },
      },
      clickToShopLink: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& div': {
            mt: 'var(--spacing-2)',
          },
        },
      },
      addToBagButton: {
        wrapper: {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            px: 0,
          },
        },
        button: {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            '& p': {
              ...theme.typography['text-body1-s'],
            },
          },
        },
      },
    }),
    tabbedPDP: ({ theme }) => ({
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: theme.fontFamily.primaryBold,
          fontWeight: 700,
        },
      },
    }),
    pdpv6: ({ theme }) => ({
      tileImageWrapper: {
        borderRadius: 'var(--border-radius-none)',
        border: '0 none',
      },
    }),
    recentlyViewed: ({ theme }) => {
      const textStyle = {
        fontSize: 'var(--text-14)',
        fontFamily: 'var(--font-face1-medium)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-14)',
          fontFamily: 'var(--font-face1-medium)',
        },
      }
      return {
        tileStrikeoffPrice: textStyle,
        tilePriceText: textStyle,
        tileDiscount: textStyle,
      }
    },
    recentlyViewedV7: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '40.53vw',
          minWidth: '40.53vw',
          maxWidth: 'fit-content',
          background: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
          pt: 'var(--spacing-4)',
          px: 'var(--spacing-4)',
        },
        '.btn-wishlist-container-recommend': {
          display: 'none',
        },
      },
      tileImageWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          bg: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
          position: 'relative',
          minHeight: '210px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          width: '100%',
          '& img': {
            objectFit: 'contain',
            width: '100%',
            height: '100%',
          },
        },
      },
      tileNameWrapper: {
        mt: 'var(--spacing-3)',
        mx: 0,
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body2-m'],
            textAlign: 'left',
            fontWeight: 'normal',
            fontSize: 'var(--text-16)',
            color: theme.colors.main.black,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title1-s'],
          alignItems: 'start',
          marginTop: 'var(--spacing-1)',
          fontWeight: 400,
        },
      },
      addToBagButton: {
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
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title1-s'],
          fontWeight: 400,
          lineHeight: 'var(--line-height-125)',
          color: 'var(--color-neutral-dark, #4A4A4A) !important', // removing color preference dependency and handling all color overrides via styles
        },
      },
      tilePriceContainer: {
        '& .tile-price-text': {
          color: 'var(--color-neutral-dark, #4A4A4A) !important', // removing color preference dependency and handling all color overrides via styles
        },
      },
      tilePriceTextColor: {
        '&&': {
          color: 'var(--color-neutral-dark, #4A4A4A) !important', // removing color preference dependency and handling all color overrides via styles
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-m'],
          fontWeight: 400,
          color: 'var(--color-success-primary, #427E2B)',
          lineHeight: 'var(--line-height-135)',
          textTransform: 'capitalize',
        },
        '&&': {
          color: 'var(--color-success-primary, #427E2B)',
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-title1-s'],
          fontWeight: 400,
          lineHeight: 'var(--line-height-125)',
          color: 'var(--color-neutral-dark, #4A4A4A)',
        },
      },
    }),
    goneViralRecommendation: ({ theme }) => ({
      ...goneViralRecommendationStyles(theme),
    }),
    goneViralRecommendationPLP: ({ theme }) => ({
      ...goneViralRecommendationStyles(theme),
    }),
    postATBMobile: ({ theme }) => ({
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-2)',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            fontWeight: 'normal',
            ...theme.typography['text-title2-m'],
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-1)',
          mt: 'var(--spacing-1)',
        },
      },
      tileComparablePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '& p': {
            ...theme.typography['text-title2-s'],
            color: 'var(--color-neutral-base)',
            fontWeight: 500,
          },
        },
      },
      tilePriceContainer: {
        '& span': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-title2-s'],
            fontWeight: 500,
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-black-base)',
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-neutral-medium)',
        },
      },
    }),
    postAddToCartDrawer: ({ theme }) => ({
      tileNameWrapper: {
        '& p': {
          ...theme.typography['text-title2-m'],
          fontWeight: '500',
          color: 'var(--color-black-base)',
        },
      },
      tilePriceWrapper: {
        alignItems: 'center',
      },
      tilePriceText: {
        ...theme.typography['text-title2-s'],
        fontWeight: '500',
        color: 'var(--color-black-base)',
      },
      tileComparablePriceWrapper: {
        '& p': {
          ...theme.typography['text-title2-s'],
          fontWeight: '500',
          color: '#6d6d6d',
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-title2-s'],
        fontWeight: '500',
        color: 'var(--color-neutral-medium)',
      },
      tileDiscount: {
        ...theme.typography['text-title2-s'],
        fontWeight: '500',
        color: 'var(--color-success-primary)',
      },
    }),
    recommendationsOnThinkPage: ({ theme }) => ({
      tileNameWrapper: {
        '& p': {
          textAlign: 'center',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            fontWeight: 'normal',
            ...theme.typography['text-body1-l'],
          },
        },
      },
      tilePriceWrapper: {
        alignItems: 'center',
      },
      tilePriceText: {
        ...theme.typography['text-body1-xs'],
        fontWeight: 700,
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontWeight: 'normal',
        },
      },
      tileComparablePriceWrapper: {
        '& p': {
          ...theme.typography['text-body1-xs'],
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            ...theme.typography['text-body1-xs'],
            fontWeight: 400,
          },
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-body1-xs'],
        fontWeight: 'normal',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontWeight: '400',
        },
      },
      tileDiscount: {
        ...theme.typography['text-body1-xs'],
      },
    }),
    recomCarouselThink: ({ theme }) => ({
      tilePriceWrapper: {
        alignItems: 'center',
      },
      tilePriceText: {
        ...theme.typography['text-display1-xs'],
        fontWeight: 700,
      },
      tileNameWrapper: {
        '& p': {
          textAlign: 'center',
        },
      },
      tileDiscount: {
        ...theme.typography['text-body1-m'],
      },
    }),
    similarProductRecommendationAdaptivePDP: () => ({
      tilePriceText: {
        fontWeight: 700,
      },
    }),
    visuallySimilarGrid: ({ theme }) => ({
      tileNameWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-title1-m'],
            fontWeight: 400,
            textAlign: 'center',
          },
        },
        tilePriceWrapper: {
          alignItems: 'center',
        },
        tilePriceText: {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-title2-m'],
            textAlign: 'center',
          },
        },
        tileStrikeoffPrice: {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-title1-m'],
            textAlign: 'center',
          },
        },
        tileComparablePriceWrapper: {
          '& p': {
            [`@media (max-width: ${theme.breakpoints.md})`]: {
              ...theme.typography['text-title1-s'],
            },
          },
        },
      },
    }),
    metaPLP: ({ theme }) => ({
      tileNameWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            fontWeight: 400,
            ...theme.typography['text-body1-m'],
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontWeight: 'normal',
        },
      },
      tileStrikeoffPrice: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontWeight: 'normal',
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontWeight: 'normal',
        },
      },
    }),
  },
}
