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
    'tilePriceTextColor',
    'clickToShopLink',
    'recommendationImpressionSensor',
    'addToBagButton',
    'tileStrikeoffPrice',
    'tilePriceContainer',
  ],
  variants: {
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s,
          '& p': {
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
          ...theme.typography['text-body1-m'],
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
        },
      },
      tileImageWrapper: {
        aspectRatio: '4/5',
        div: {
          aspectRatio: 'unset',
        },
        img: {
          aspectRatio: '4/5',
          objectFit: 'cover',
          width: '100%',
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
    similarProductRecommendationAdaptivePDP: ({ theme }) => ({
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&&': {
            fontFamily: 'var(--font-face1-normal)',
          },
        },
      },
      tileComparablePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&& p': {
            fontSize: 'var(--text-14)',
            lineHeight: 'var(--line-height-xl)',
            fontFamily: 'var(--font-face2-normal)',
            letterSpacing: 'var(--letter-spacing-xs)',
          },
        },
      },
    }),
    tabbedHP: ({ theme }) => ({
      tileNameWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            fontSize: theme.fontSizes.xs,
          },
        },
      },
    }),
  },
}
