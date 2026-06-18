const v3SubTitleStyles = (theme) => ({
  ...theme.typography['text-display1-s'],
  fontFamily: theme.fontFamily.primaryNormal,
  fontSize: theme.fontSizes.xs,
  fontWeight: 400,
  lineHeight: theme.lineHeights.xl,
  letterSpacing: theme.letterSpacings.xs,
  color: theme.colors.neutral.medium,
})

const v3TitleStyles = {
  fontFamily: 'HelveticaNeue73ExtendedBold',
  fontSize: 'var(--text-16)',
  fontStyle: 'normal',
  fontWeight: '700',
  lineHeight: 'var(--line-height-120)',
  letterSpacing: 'var(--letter-spacing-s)',
  color: 'var(--color-primary, #000001)',
}

export default {
  parts: [
    'NoResultFoundText',
    'NoResultText',
    'NoResultTextQuery',
    'ResultText',
    'AiResultText',
    'DidYouMeanText',
    'SearchResultWrapper',
    'SearchResultSkeleton',
    'SearchResultSkeletonSorryText',
    'SearchResultSkeletonText',
    'SearchResultSkeletonBlock',
    'SearchResultSkeletonMessageText',
    'NoResultsTextWrapper',
    'ResultsTextWrapper',
    'AiSearchResultSkeletonMessageText',
  ],
  baseStyle: ({ theme }) => ({
    NoResultText: () => ({
      fontSize: theme.fontSizes.xxl,
      color: theme.colors.main.black,
      textAlign: 'center',
    }),
    NoResultTextQuery: () => ({
      color: theme.colors.main.black,
      textTransform: 'capitalize',
    }),
    NoResultFoundText: () => ({
      fontSize: theme.fontSizes.xl,
      p: '32px 48px 0',
      fontWeight: '400',
      textAlign: 'center',
      lineHeight: 'var(--line-height-xl)',
      letterSpacing: 'normal',
    }),
    DidYouMeanText: (isMobile) => ({
      m: `var(--spacing-2) 0 ${isMobile ? 'var(--spacing-2)' : 'var(--spacing-1)'}`,
      p: '0 12px',
      fontWeight: '400',
      fontSize: 'var(--text-18)',
      textAlign: 'center',
      lineHeight: 'var(--line-height-xl)',
      letterSpacing: 'normal',
    }),
    ResultText: () => ({
      fontSize: theme.fontSizes.xl,
      textAlign: 'center',
    }),
    SearchResultWrapper: (isMobile) => ({
      mt: isMobile ? theme.space.l : theme.space.xxl,
    }),
    SearchResultSkeleton: {
      margin: '0 auto',
      width: 'fit-content',
    },
    SearchResultSkeletonSorryText: () => ({
      fontSize: theme.fontSizes.xxl,
      textAlign: 'center',
    }),
    SearchResultSkeletonText: () => ({
      fontSize: theme.fontSizes.lg,
      mt: theme.space.s,
      textAlign: 'center',
    }),
    SearchResultSkeletonBlock: {
      margin: '0 auto',
      width: 'fit-content',
    },
    SearchResultSkeletonMessageText: (isMobile) => ({
      fontSize: isMobile ? 'sm' : 'lg',
      color: theme.colors.main.black,
      textAlign: 'center',
      m: `0 ${theme.space.xxl}`,
    }),
  }),
  variants: {
    plpV3: ({ theme }) => ({
      SearchResultWrapper: () => ({
        pt: '14px',
        pb: theme.space.xs,
        borderBottom: '1px solid var(--color-neutral-light-2, #e1e1e1)',
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--color-neutral-light-1)',

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          pt: '42px',
          pb: '0',
          justifyContent: 'start',
          px: 'var(--spacing-6)',
          border: 'none',
          maxWidth: '1344px',
          margin: 'auto',
        },
      }),
      SearchResultSkeletonBlock: {
        mx: theme.space.mar,

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ml: '0',
        },
      },
      NoResultText: () => ({
        ...v3TitleStyles,

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-24)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 'var(--line-height-s)',
          letterSpacing: 'var(--letter-spacing-s)',
          color: '#101820',
          pb: theme.space.xs,
        },
      }),
      NoResultTextQuery: () => ({
        ...v3TitleStyles,

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-24)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 'var(--line-height-s)',
          letterSpacing: 'var(--letter-spacing-s)',
          color: '#101820',
          pb: theme.space.xs,
          textTransform: 'lowercase',
        },
      }),
      SearchResultSkeletonMessageText: () => ({
        ...v3SubTitleStyles(theme),
        pb: theme.space.s,
        pt: '1px',

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-16)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 'var(--line-height-l)',
          letterSpacing: 'var(--letter-spacing-xs)',
          color: '#101820',
          pb: '0',
        },
      }),
      AiSearchResultSkeletonMessageText: {
        fontSize: 'var(--text-16)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: '400',
        lineHeight: 'var(--line-height-l)',
        letterSpacing: 'var(--letter-spacing-xs)',
        color: '#101820',
        pb: '0',
      },
      SearchResultSkeletonSorryText: () => ({
        ...v3TitleStyles,
      }),
      SearchResultSkeletonText: () => ({
        ...v3SubTitleStyles(theme),
        pb: '6px',
        pt: '1px',
      }),
      SearchResultSkeleton: {
        mx: theme.space.mar,
        margin: '0',
      },
      ResultText: () => ({
        ...v3TitleStyles,
        pb: theme.space.s,

        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-24)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 'var(--line-height-s)',
          letterSpacing: 'var(--letter-spacing-s)',
          color: '#101820',
          pb: '0',
        },
      }),
      AiResultText: {
        fontSize: 'var(--text-24)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-s)',
        letterSpacing: 'var(--letter-spacing-s)',
        color: '#101820',
      },
      NoResultFoundText: () => ({
        ...v3TitleStyles,
      }),
      DidYouMeanText: () => ({
        ...v3SubTitleStyles(theme),
        pt: '1px',
      }),
      NoResultsTextWrapper: {
        display: 'flex',
      },
      ResultsTextWrapper: {
        display: 'flex',
        pb: 'var(--spacing-1)',
      },
    }),
  },
}
