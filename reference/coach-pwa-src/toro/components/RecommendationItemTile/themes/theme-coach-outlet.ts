export default {
  parts: [
    'tileNameWrapper',
    'tilePriceText',
    'tilePriceWrapper',
    'tileWrapper',
    'tilePriceContainer',
    'tileDiscount',
    'tileImageWrapper',
    'tileStrikeoffPrice',
    'tilePriceTextColor',
  ],
  baseStyle: ({ theme }) => ({
    tileNameWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mx: 0,
        mt: theme.space.m,
      },
      '& p': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-16)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-extended-bold)',
          fontSize: 'var(--text-16)',
        },
      },
    },
    tilePriceText: {
      lineHeight: theme.lineHeights.xl,
      fontFamily: 'var(--font-face1-extended-normal)',
      color: 'var(--color-black-base)',
      textAlign: 'center',
      fontSize: 'var(--text-16)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-16)',
      },
    },
    tileStrikeoffPrice: {
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: 'var(--text-16)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-16)',
      },
    },
    tileWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mr: 0,
        width: '54.7vw',
        minWidth: '54.7vw',
        maxWidth: 'fit-content',
      },
      width: '100%',
      maxWidth: '100%',
    },
    tileImageWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        height: 'auto',
        width: '100%',
        maxWidth: 'none',
        img: {
          height: 'inherit',
          width: 'inherit',
        },
      },
    },
    tilePriceWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        px: 0,
        marginTop: theme.space.s1,
      },
    },
    tileComparablePriceWrapper: {
      '& p': {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-12)',
          color: 'var(--color-primary)',
          lineHeight: 'var(--line-height-xl)',
          letterSpacing: 'var(--letter-spacing-xs)',
        },
      },
    },
    tileDiscount: {
      fontSize: theme.fontSizes.sm,
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-140)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-success-primary)',
      },
    },
  }),
  variants: {
    PLP: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          width: '36.5vw',
          minWidth: '36.5vw',
        },
      },
      tileImageWrapper: {
        img: {
          height: 'inherit',
          width: 'inherit',
          objectFit: 'contain',
        },
      },
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s,
        },
        '& p': {
          color: 'var(--color-black-base)',
          textAlign: 'center',
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            color: 'var(--color-primary)',
            letterSpacing: theme.letterSpacings.xs,
            lineHeight: theme.lineHeights.xl,
          },
        },
      },
      tilePriceWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.space.s1,
      },
      tileComparablePriceWrapper: {
        '& p': {
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: 'var(--text-12)',
          fontStyle: 'normal',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          color: 'var(--color-neutral-medium)',
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontFamily: 'var(--font-face1-extended-normal)',
            fontSize: 'var(--text-10)',
            fontStyle: 'normal',
            lineHeight: 'var(--line-height-140)',
            letterSpacing: 'var(--letter-spacing-xs)',
            textAlign: 'center',
            color: 'var(--color-primary)',
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          lineHeight: theme.lineHeights.xl,
          letterSpacing: theme.letterSpacings.xs,
        },
      },
      tilePriceTextColor: {
        '&&': {
          color: 'var(--color-black-base)',
        },
      },
      tileDiscount: {
        '&&': {
          color: 'var(--color-success-primary)',
        },
      },
    }),
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      tileWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mr: 0,
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
            lineClamp: 1,
            WebkitLineClamp: 1,
            lineHeight: theme.lineHeights.lg,
          },
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: '0px',
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-s'],
            fontFamily: 'var(--font-face1-extended-normal)',
            lineHeight: theme.lineHeights.lg,
          },
        },
      },
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          lineHeight: theme.lineHeights.xl,
          color: 'var(--color-black-base)',
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.xs})`]: {
          ...theme.typography['text-display1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
          fontSize: theme.fontSizes.xs,
        },
      },
    }),
    aeDrawerGrid: ({ theme }) => ({
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-2)',
          mx: 0,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-2)',
          mx: 0,
        },
        '& p': {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            fontFamily: 'var(--font-face1-extended-bold)',
          },
        },
      },
      tilePriceWrapper: {
        alignItems: 'flex-start',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          m: 0,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          m: 0,
        },
      },
      tilePriceText: {
        ...theme.typography['text-body2-xl'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-black-base)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      tileDiscount: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-sale)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-success-primary)',
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
    }),
    aeDrawer: ({ theme }) => ({
      tileNameWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-2)',
          mx: 0,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mt: 'var(--spacing-2)',
          mx: 0,
        },
      },
      tilePriceWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          alignItems: 'center',
          m: 0,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          m: 0,
          alignItems: 'center',
        },
      },
      tilePriceText: {
        ...theme.typography['text-body2-xl'],
        fontFamily: 'var(--font-face1-extended-normal)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-normal)',
        },
      },
      tileDiscount: {
        ...theme.typography['text-body2-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-sale)',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-success-primary)',
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-extended-normal)',
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
      tilePriceText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          lineHeight: theme.lineHeights.lg,
        },
      },
    }),
    recomCarouselThink: ({ theme }) => ({
      tileComparablePriceWrapper: {
        gap: '2px',
        '& p': {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-neutral-1)',
        },
      },
      tileStrikeoffPrice: {
        ...theme.typography['text-body1-m'],
        fontFamily: 'var(--font-face1-extended-normal)',
        color: 'var(--color-neutral-1)',
      },
    }),
    similarProductRecommendationAdaptivePDP: ({ theme }) => ({
      tileComparablePriceWrapper: {
        '&& p': {
          color: 'var(--color-neutral-medium)',
        },
      },
      tilePriceTextColor: {
        '&&': {
          color: 'var(--color-black-base)',
        },
      },
      tileDiscount: {
        '&&': {
          color: 'var(--color-success-primary)',
        },
      },
    }),
    tabbedHP: ({ theme }) => ({
      tileComparablePriceWrapper: {
        '& p': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            fontFamily: 'var(--font-face1-extended-normal)',
            fontSize: 'var(--text-10)',
            color: 'var(--color-neutral-1)',
          },
        },
      },
      tileDiscount: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-extended-normal)',
          color: 'var(--color-success-primary)',
        },
      },
    }),
  },
}
