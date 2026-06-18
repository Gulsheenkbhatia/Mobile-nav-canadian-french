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
    'baseRecommendationSliderContainer',
  ],
  baseStyle: ({ theme }) => ({
    baseRecommendationTitle: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-extended-bold)',
        fontSize: 'var(--text-24)',
        lineHeight: 'var(--line-height-s)',
        letterSpacing: 'var(--letter-spacing-s)',
        textAlign: 'left',
        paddingLeft: 'var(--spacing-3)',
      },
      fontFamily: 'var(--font-face1-extended-bold)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-44)',
        lineHeight: 'var(--line-height-xs)',
        letterSpacing: 'var(--letter-spacing-xs)',
        textAlign: 'center',
        color: 'var(--color-black-base)',
      },
    },
  }),
  variants: {
    PLP: ({ theme }) => ({
      baseRecommendationContentDivider: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          minHeight: '1px',
          mb: 0,
          mx: 'var(--spacing-6)',
        },
      },
      baseRecommendationWrapper: {
        '&&': {
          pl: 'var(--spacing-3)',
          pt: '28px',
          pb: '35px',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            pl: 0,
          },
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          textAlign: 'left',
          lineHeight: theme.lineHeights.xs,
        },
      },
      baseRecommendationMobileItems: {
        mt: 'var(--spacing-3)',
      },
      baseRecommendationDesktopSliderWrapper: {
        '& .splide__slide': {
          m: '0 6px!important',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            width: 'calc(25% - 12px)!important',
          },
          '& > div': {
            maxWidth: '228px',
            m: 'auto',
          },
        },
        maxWidth: '100%',
        mt: 'var(--spacing-12)',
        mx: 0,
        px: 0,
      },
      baseRecommendationArrowStyles: {
        width: '56px',
        height: '56px',
        transform: 'none',
        boxShadow: '0px 7px 16px rgba(0,0,0,0.05)',
        backgroundColor: 'var(--color-white-base)',
        '& svg': {
          margin: 'auto',
          height: 'var(--spacing-6)',
          width: 'var(--spacing-6)',
        },
        '&:disabled': {
          backgroundColor: 'var(--color-neutral-light)',
          '& svg': { opacity: 0.4 },
        },
      },
      baseRecommendationArrowPrev: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          transform: 'none',
          left: '-24px',
        },
      },
      baseRecommendationArrowNext: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          transform: 'none',
          right: '-24px',
        },
      },
      baseRecommendationSplidePadding: {
        left: 'initial',
        right: 'initial',
      },
    }),
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      baseRecommendationContentDivider: {
        mt: 'var(--spacing-6)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          minHeight: '0px',
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: theme.colors.main.black,
        },
      },
      baseRecommendationMobileItems: {
        mt: 'var(--spacing-2)',
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          pt: 'var(--spacing-6)',
          pb: 'var(--spacing-8)',
        },
      },
    }),
    recommendationsOnHP: ({ theme }) => ({
      baseRecommendationTitle: {
        px: '0px',
        py: '0px',
      },
    }),
    aeDrawerGrid: ({ theme }) => ({
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          px: 'var(--spacing-2)',
          py: '14px', // missing in the design token
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          px: '20px', // missing in the design token
          py: '14px', // missing in the design token
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
          fontFamily: 'var(--font-face1-extended-bold)',
          paddingBottom: '10px', // missing in the design token
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
          fontFamily: 'var(--font-face1-extended-bold)',
          paddingBottom: '10px', // missing in the design token
          textAlign: 'left',
          px: 0,
        },
      },
    }),
    aeDrawer: ({ theme }) => ({
      baseRecommendationWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingTop: '13px',
          paddingLeft: 'var(--spacing-2)',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          paddingTop: '13px',
          paddingLeft: 0,
        },
        paddingBottom: 'var(--spacing-3)',
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
          fontFamily: 'var(--font-face1-extended-bold)',
          paddingBottom: '10px', // missing in the design token
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
          fontFamily: 'var(--font-face1-extended-bold)',
          textAlign: 'left',
        },
      },
      baseRecommendationMobileWrapper: {
        mt: 0,
      },
      baseRecommendationDesktopSliderWrapper: {
        marginTop: 'var(--spacing-3)',
        padding: '0 20px',
      },
    }),
  },
}
