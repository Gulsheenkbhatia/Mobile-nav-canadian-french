export default {
  parts: [
    'baseRecommendationContentDivider',
    'baseRecommendationWrapper',
    'baseRecommendationTitle',
    'baseRecommendationDesktopSliderWrapper',
    'baseRecommendationArrowStyles',
    'baseRecommendationArrowPrev',
    'baseRecommendationArrowNext',
  ],
  variants: {
    pdpv5_1: ({ theme }) => ({
      baseRecommendationContentDivider: {
        '&:before': {
          display: 'none',
        },
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          mb: '36px',
        },
      },
      baseRecommendationWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          py: 0,
        },
      },
      baseRecommendationTitle: {
        color: 'var(--color-black-base)',
        fontFamily: 'var(--font-face2-normal)',
        fontSize: 'var(--text-52)',
        fontWeight: 400,
        lineHeight: 'var(--line-height-115)',
        letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
      },
      baseRecommendationDesktopSliderWrapper: {
        p: 'var(--spacing-10) 0 0 !important',
        mt: 0,
        maxWidth: '1350px',
        '& .splide__slide': {
          mr: '18px !important',
          height: 'auto',
          width: '324px !important',
        },
        '@media (max-width: 1482px)': {
          maxWidth: 'calc(100vw - 150px)', // 150px = left arrow + right arrow + 18px last gap
          '& .splide__slide': {
            width: 'auto !important',
          },
        },
      },
      baseRecommendationArrowStyles: {
        transform: 'translateY(-50%)',
        top: '50%',
        bottom: 'auto',
        width: '48px',
        height: '48px',
        p: '12px',
        '& svg': {
          transform: 'scale(1.7)',
        },
      },
      baseRecommendationArrowPrev: {
        left: '-66px',
      },
      baseRecommendationArrowNext: {
        right: '-66px',
      },
    }),
  },
}
