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
    'baseRecommendationMobileItems',
    'baseRecommendationTitle',
    'baseRecommendationDesktopSliderWrapper',
    'baseRecommendationArrowStyles',
    'baseRecommendationArrowPrev',
    'baseRecommendationArrowNext',
    'baseRecommendationSliderContainer',
    'baseRecommendationSubtitle',
    'grid2Up',
  ],
  variants: {
    pdpV3ATCRecommendationMobile: ({ theme }) => ({
      baseRecommendationContentDivider: {
        mt: '27px',
      },
      baseRecommendationMobileItems: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mt: theme.space.s,
        },
      },
      baseRecommendationTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body2-l'],
          color: 'var(--color-black-base)',
        },
      },
    }),
    recommendationsStack: ({ theme }) => ({
      baseRecommendationTitle: {
        fontFamily: 'var(--font-face2-normal)',
        fontSize: 'var(--text-44)',
        textAlign: 'center',
        lineHeight: 'var(--line-height-l)',
        bg: 'var(--color-neutral-light-1)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face2-normal)',
          fontSize: 'var(--text-44)',
          textAlign: 'center',
          lineHeight: 'var(--line-height-l)',
          bg: 'var(--color-neutral-light-1)',
        },
      },
      baseRecommendationSubtitle: {
        fontFamily: 'var(--font-face1-normal)',
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
      baseRecommendationWrapper: {
        '&&': drawerBodyStyles.baseRecommendationWrapper,
      },
      baseRecommendationDesktopSliderWrapper: {
        px: '20px',
        width: '100%',
        ...drawerBodyStyles.baseRecommendationDesktopSliderWrapper,
      },
    }),
  },
}
