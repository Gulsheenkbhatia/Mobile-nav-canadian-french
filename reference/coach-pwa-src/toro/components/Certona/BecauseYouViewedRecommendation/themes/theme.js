export default {
  baseStyle: ({ theme }) => ({
    becauseYouViewedRecommendationContainer: {
      minH: 'auto',
    },
    becauseYouViewedWrapper: {
      pt: 'var(--spacing-8)',
      pb: 'var(--spacing-10)',
      flexDirection: 'column',
      gap: 'var(--spacing-4)',
    },
    certonaHeaderContainer: {
      display: 'flex',
      px: 'var(--spacing-4)',
      gap: 'var(--spacing-2)',
    },
    certonaHeaderThumbnail: {
      minWidth: '50px',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',

      '& .product-image': {
        backgroundColor: 'var(--color-neutral-light-1)',
        width: '100%',
        height: '100%',
      },
      '& img': {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
      },
    },
    certonaHeaderTitleWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    certonaHeaderTitle: {
      ...theme.typography['text-eyebrow2-m'],
      fontWeight: '400',
      color: 'var(--color-neutral-medium)',
    },
    certonaHeaderSubTitle: {
      ...theme.typography['text-display4-xs'],
      fontWeight: '700',
      color: 'var(--color-black-base)',
    },
    skeletonBecauseYouViewedWrapper: {
      flexDirection: 'column',
    },
    skeletonHeaderThumbnail: {
      height: '50px',
      width: '50px',
      minWidth: '50px',
      borderRadius: '50%',
    },
    skeletonHeaderTitle: {
      height: '14px',
    },
    skeletonHeaderSubtitle: {
      height: '30px',
    },
  }),
  variants: {
    becauseYouViewedPLPV2: ({ theme }) => ({
      becauseYouViewedRecommendationContainer: {
        height: 'unset',
        borderLeft: '1px solid var(--color-neutral-light-3)',
      },
      becauseYouViewedWrapper: {
        pt: '16px',
        pb: '0',
        gap: '0',
      },
      certonaHeaderThumbnail: {
        minWidth: '32px',
        width: '32px',
        height: '32px',
        borderRadius: '27px',
        overflow: 'hidden',
        display: 'flex',
      },
      certonaHeaderTitleWrapper: {
        gap: 0,
      },
      certonaHeaderTitle: {
        fontFamily: 'var(--font-face1-extended-normal)',
        fontSize: 'var(--text-10)',
        lineHeight: 'var(--line-height-xxs)',
        letterSpacing: 'var(--letter-spacing-xs)',
        fontWeight: '400',
        color: 'var(--color-neutral-medium)',
      },
      certonaHeaderSubTitle: {
        ...theme.typography['text-display4-xxs'],
      },
    }),
  },
}
