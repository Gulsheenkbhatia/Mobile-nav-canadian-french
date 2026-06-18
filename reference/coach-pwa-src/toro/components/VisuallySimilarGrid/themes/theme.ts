const VisuallySimilarGridTheme = {
  baseStyle: ({ theme }) => ({
    container: {
      width: '100%',
      p: 'var(--spacing-10) 0 var(--spacing-6)',
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    titleWrapper: {
      mb: theme.space.m,
      px: theme.space.m,
    },
    title: {
      fontSize: theme.fontSizes.xl,
      color: theme.colors.neutral.dark,
      fontFamily: 'var(--font-face1-extended-bold)',
      lineHeight: theme.lineHeights.s,
      letterSpacing: theme.letterSpacings.xs,
    },
    gridContainer2Up: {
      gap: `${theme.space.xl} ${theme.space.s3}`,
    },
    gridContainer3Up: {
      gap: theme.space.s3,
    },
    skeletonTitleWrapper: {
      mb: theme.space.m,
      px: theme.space.m,
    },
    skeletonTitle: {
      height: '32px',
      width: '60%',
    },
    skeletonGridContainer: {
      gap: theme.space.s,
      px: theme.space.s3,
    },
    skeletonImage: {
      height: '248px',
      width: '100%',
      mb: theme.space.s,
    },
    skeletonName: {
      height: '16px',
      width: '80%',
      mb: theme.space.s1,
    },
    skeletonPrice: {
      height: '16px',
      width: '60%',
    },
  }),
}

export default VisuallySimilarGridTheme
