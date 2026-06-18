export default {
  baseStyle: ({ theme }) => ({
    baseRecommendationTitle: {
      fontFamily: 'var(--font-face1-bold)',
      fontSize: 'var(--text-26)',
      textAlign: 'center',
      color: 'var(--color-black-base)',
      fontWeight: 700,
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontFamily: 'var(--font-face1-bold)',
        fontSize: 'var(--text-20)',
        color: 'var(--color-black-base)',
        textAlign: 'center',
        fontWeight: 400,
      },
    },
  }),
  variants: {
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
  },
}
