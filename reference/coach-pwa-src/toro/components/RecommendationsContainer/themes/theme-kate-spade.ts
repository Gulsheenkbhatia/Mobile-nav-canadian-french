const drawerBodyStyles = {
  baseRecommendationTitle: {
    fontFamily: 'var(--font-face2-normal)',
    fontSize: 'var(--text-24)',
    fontWeight: 400,
    color: 'var(--color-black-base)',
  },
  baseRecommendationWrapper: {
    paddingTop: '10px',
  },
  baseRecommendationDesktopSliderWrapper: {
    marginTop: '8.5px',
  },
}

export default {
  parts: [
    'baseRecommendationRoot',
    'baseRecommendationContentDivider',
    'baseRecommendationWrapper',
    'baseRecommendationTitle',
    'baseRecommendationDesktopSliderWrapper',
    'baseRecommendationArrowStyles',
    'baseRecommendationArrowPrev',
    'baseRecommendationArrowNext',
    'baseRecommendationSplidePadding',
    'baseRecommendationMobileWrapper',
    'baseRecommendationMobileItems',
    'fallbackMessageContainer',
    'fallbackMessage',
    'baseRecommendationSliderContainer',
    'baseRecommendationSubtitle',
    'grid2Up',
  ],
  baseStyle: ({ theme }) => ({
    baseRecommendationTitle: {
      fontFamily: 'var(--font-face2-normal)',
      fontSize: 'var(--text-36)',
      letterSpacing: '0',
      textAlign: 'center',
      lineHeight: 'var(--line-height-xxs)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face2-normal)',
        fontSize: 'var(--text-28)',
        letterSpacing: 'var(--letter-spacing-s)',
        textAlign: 'left',
        px: 'var(--spacing-3)',
      },
    },
    baseRecommendationWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        pt: 'var(--spacing-8)',
        pb: 'var(--spacing-8)',
      },
    },
  }),
  variants: {
    PLP: ({ theme }) => ({
      baseRecommendationContentDivider: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          minHeight: '1px',
          mb: 0,
          mx: 'var(--spacing-12)',
        },
      },
      baseRecommendationWrapper: {
        '&&': {
          pl: 'var(--spacing-3)',
          p: 'var(--spacing-12) 0',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            pl: 0,
          },
        },
      },
      baseRecommendationTitle: {
        ...theme.typography['text-display1-m'],
        textAlign: 'center',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face2-normal)',
          lineHeight: theme.lineHeights.xs,
          fontSize: 'var(--text-36)',
        },
      },
      baseRecommendationMobileItems: {
        mt: 'var(--spacing-6)',
      },
      baseRecommendationDesktopSliderWrapper: {
        '& .splide__slide div': {
          maxWidth: '100%',
        },
        maxWidth: '100%',
        mt: 'var(--spacing-6)',
        mx: 0,
        px: 0,
      },
      baseRecommendationArrowStyles: {
        boxShadow: 'none',
      },
      baseRecommendationArrowPrev: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          left: '-35px',
        },
      },
      baseRecommendationArrowNext: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          right: '-35px',
        },
      },
      baseRecommendationSplidePadding: {
        left: 'initial',
        right: 'initial',
      },
    }),
    recommendationsOnHP: ({ theme }) => ({
      baseRecommendationTitle: {
        ...theme.typography['text-display1-m'],
        px: '0px',
        py: '0px',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
          textAlign: 'center',
        },
      },
      baseRecommendationMobileItems: {
        mt: 'var(--spacing-6)',
        gridGap: 'var(--spacing-1)',
      },
    }),
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-l'],
          fontWeight: 500,
          color: 'var(--color-black-base)',
        },
      },
      baseRecommendationMobileItems: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: '9px',
        },
      },
    }),
    recommendationsStack: ({ theme }) => ({
      baseRecommendationTitle: {
        fontFamily: 'var(--font-face2-normal)',
        fontSize: 'var(--text-44)',
        fontWeight: 'var(--font-weight-normal)',
        textAlign: 'center',
        lineHeight: 'var(--line-height-l)',
        bg: 'var(--color-neutral-light-1)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face2-normal)',
          fontSize: 'var(--text-44)',
          fontWeight: 'var(--font-weight-normal)',
          textAlign: 'center',
          lineHeight: 'var(--line-height-l)',
          bg: 'var(--color-neutral-light-1)',
        },
      },
      baseRecommendationSubtitle: {
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 400,
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-l)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: 'var(--color-black-base)',
        textAlign: 'center',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          textAlign: 'center',
          px: 'var(--spacing-3)',
        },
      },
      baseRecommendationRoot: {
        pt: '0',
        bg: 'var(--color-neutral-light-1)',
      },
      baseRecommendationWrapper: {
        pt: 0,
        pb: 0,
        py: 0,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          pt: 0,
          pb: 0,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          py: 0,
          pt: 0,
          pb: 0,
        },
      },
      baseRecommendationContentDivider: {
        bg: 'var(--color-neutral-light-1)',
        mt: '20px',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          minHeight: 'unset',
        },
      },
      baseRecommendationMobileWrapper: {
        maxWidth: '100%',
        width: '100%',
      },
      baseRecommendationMobileItems: {
        flexDirection: 'column',
        alignItems: 'stretch',
        width: '100%',
        maxWidth: '100%',
        overflowX: 'visible',
        overflowY: 'visible',
        rowGap: 'var(--spacing-4)',
        columnGap: 0,
        mt: 'var(--spacing-3)',
        pl: 'var(--spacing-3)',
        pr: 'var(--spacing-3)',
        '& > *': {
          width: '100%',
          maxWidth: '100%',
          flexShrink: 0,
        },
        bg: 'transparent',
      },
    }),
    aeDrawer: ({ theme }) => ({
      baseRecommendationMobileItems: {
        p: 0,
        m: 0,
        gridGap: 'var(--spacing-1)',
        '&::after': {
          content: "''",
          flex: '0 0 var(--spacing-1)',
        },
      },
      baseRecommendationWrapper: {
        '&&': drawerBodyStyles.baseRecommendationWrapper,
      },
      baseRecommendationTitle: {
        '&&': drawerBodyStyles.baseRecommendationTitle,
      },
      baseRecommendationDesktopSliderWrapper: {
        px: '20px',
        width: '100%',
        ...drawerBodyStyles.baseRecommendationDesktopSliderWrapper,
      },
    }),
    aeDrawerGrid: ({ theme }) => ({
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          px: 'var(--spacing-2)',
          py: 'var(--spacing-4) !important',
        },
        px: '20px', // missing in the design token
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          py: 0,
        },
        '&&': drawerBodyStyles.baseRecommendationWrapper,
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-s'],
          p: 0,
          paddingBottom: 'var(--spacing-4)',
        },
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-s)',
        textAlign: 'left',
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          paddingBottom: 'var(--spacing-2)',
        },
        '&&': drawerBodyStyles.baseRecommendationTitle,
      },
      baseRecommendationDesktopSliderWrapper:
        drawerBodyStyles.baseRecommendationDesktopSliderWrapper,
    }),

    aeDrawerGridSocial: ({ theme }) => ({
      baseRecommendationMobileItems: {
        display: 'grid',
        gap: 'var(--spacing-4)',
        width: '100%',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        m: 0,
        p: 0,
      },
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          py: 'var(--spacing-6) !important',
        },
        px: '20px', // missing in the design token
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          py: 0,
        },
        '&&': drawerBodyStyles.baseRecommendationWrapper,
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-display1-s'],
          p: 0,
          paddingBottom: 'var(--spacing-4)',
        },
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-s)',
        textAlign: 'left',
        [`@media (min-width: ${theme.breakpoints.sm})`]: {
          paddingBottom: 'var(--spacing-2)',
        },
        '&&': drawerBodyStyles.baseRecommendationTitle,
      },
      baseRecommendationDesktopSliderWrapper:
        drawerBodyStyles.baseRecommendationDesktopSliderWrapper,
    }),

    tabbedHP: ({ theme }) => ({
      baseRecommendationRoot: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          backgroundColor: 'var(--color-product-image-bg)',
        },
      },
      baseRecommendationTitle: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-m'],
        },
      },
      fallbackMessage: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& strong': {
            ...theme.typography['text-display1-ms'],
            fontWeight: 400,
          },
        },
      },
    }),
    tabbedPLP: ({ theme }) => ({
      baseRecommendationRoot: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          backgroundColor: 'var(--color-product-image-bg)',
        },
      },
      baseRecommendationContentDivider: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          minHeight: '455px',
          m: '0 auto',
        },
      },
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: theme.space.l,
          paddingBottom: theme.space.l,
          background: theme.colors.main.white,
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontSize: theme.fontSizes.xxl,
          lineHeight: theme.lineHeights.s,
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-m'],
        },
      },
      fallbackMessage: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '& strong': {
            ...theme.typography['text-display1-ms'],
            fontWeight: 400,
          },
        },
      },
    }),

    goneViralRecommendation: () => ({
      baseRecommendationWrapper: {
        '&&': {
          backgroundColor: 'var(--color-white-base)',
          pt: '0',
          pb: '0',
        },
      },
    }),
    goneViralRecommendationPLP: () => ({
      baseRecommendationWrapper: {
        '&&': {
          backgroundColor: 'var(--color-white-base)',
          pt: '0',
          pb: '0',
        },
      },
    }),
    recentlyViewedV7: ({ theme }) => ({
      baseRecommendationContentDivider: {
        '&.content-divider::before': {
          display: 'none',
        },
      },

      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '&&': {
            padding: 'var(--spacing-12) var(--spacing-3) !important',
          },

          background: 'var(--color-neutral-light-1, var(--color-page-bg, #f0f0f0))',
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-l'],
          textAlign: 'center',
          fontWeight: 400,
          lineHeight: 'var(--line-height-100)',
        },
      },
      baseRecommendationMobileItems: {
        gridGap: '10px',
        mt: 'var(--spacing-3)',
        p: 0,
      },
    }),
    postATBMobile: ({ theme }) => ({
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
          fontWeight: 400,
        },
      },
    }),
    postAddToCartDrawer: ({ theme }) => ({
      baseRecommendationTitle: {
        ...theme.typography['text-display1-s'],
      },
    }),
  },
}
