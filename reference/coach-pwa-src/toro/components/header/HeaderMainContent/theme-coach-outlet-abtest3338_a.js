export default {
  parts: ['headerMainContentBox', 'headerMainContentInnerBox', 'exposedSearchHeaderContainer'],
  variants: {
    globalHeaderV1: ({ theme }) => ({
      headerMainContentBox: {
        p: `0 var(--spacing-4)`,
      },
      headerMainContentInnerBox: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          m: 'var(--spacing-3) 0',
        },
      }),
    }),
    globalHeaderV2: () => ({
      exposedSearchHeaderContainer: {
        position: 'static',
        width: '100%',
        mt: 0,
      },
    }),
  },
}
