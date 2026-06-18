import { HORIZONTAL_FILTERS_WRAPPER_Z_INDEX } from 'toro/components/list/HorizontalFiltersBar/themes/theme-kate-spade'

const plpV3BackgroundColor = 'var(--color-neutral-light-1, #f0f0f0)'

export default {
  baseStyle: ({ theme }) => ({
    ResultText: (isMobile) => ({
      textAlign: 'center',
      ...(isMobile ? theme.typography['text-display2-s'] : theme.typography['text-display2-m']),
    }),
    NoResultFoundText: (isMobile) => ({
      p: 'var(--spacing-8) var(--spacing-12) 0',
      textAlign: 'center',
      ...(isMobile ? theme.typography['text-display2-s'] : theme.typography['text-display2-m']),
    }),
    DidYouMeanText: (isMobile) => ({
      m: 'var(--spacing-2) 0 var(--spacing-12)',
      p: '0 var(--spacing-3)',
      textAlign: 'center',
      ...(isMobile ? theme.typography['text-body2-s'] : theme.typography['text-body2-l']),
    }),
    NoResultText: (isMobile) => ({
      color: theme.colors.main.black,
      textAlign: 'center',
      ...(isMobile ? theme.typography['text-display2-s'] : theme.typography['text-display2-m']),
    }),
    NoResultTextQuery: (isMobile) => ({
      color: theme.colors.main.black,
      ...(isMobile ? theme.typography['text-display2-s'] : theme.typography['text-display2-m']),
    }),
    SearchResultSkeletonSorryText: (isMobile) => ({
      textAlign: 'center',
      ...(isMobile ? theme.typography['text-display2-s'] : theme.typography['text-display2-m']),
    }),
    SearchResultSkeletonText: (isMobile) => ({
      mt: theme.space.s,
      textAlign: 'center',
      ...(isMobile ? theme.typography['text-body2-s'] : theme.typography['text-body2-l']),
    }),
    SearchResultSkeletonMessageText: (isMobile) => ({
      color: theme.colors.main.black,
      textAlign: 'center',
      m: `0 ${theme.space.xxl}`,
      ...(isMobile ? theme.typography['text-body2-s'] : theme.typography['text-body2-l']),
    }),
  }),
  variants: {
    srpV3: ({ theme }) => ({
      ResultText: () => ({
        ...theme.typography['text-display2-xs'],
        color: 'var(--color-primary)',
      }),
    }),
    plpV3: ({ theme }) => ({
      NoResultTextQuery: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-m'],
        },
      }),
      NoResultText: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-m'],
        },
      }),
      ResultText: () => ({
        ...theme.typography['text-display2-xs'],
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-m'],
        },
        color: 'var(--color-primary)',
      }),
      SearchResultWrapper: () => ({
        pt: '14px',
        pb: theme.space.xs,
        borderBottom: '1px solid var(--color-neutral-light-2, #e1e1e1)',
        display: 'flex',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--color-product-image-bg)',
        background: plpV3BackgroundColor,
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          maxWidth: '1344px',
          margin: 'auto',
          pt: '42px',
          mb: '-26px',
          border: 'none',
          position: 'relative',
          zIndex: HORIZONTAL_FILTERS_WRAPPER_Z_INDEX + 1,
          paddingLeft: 'var(--spacing-6)',
        },
      }),
    }),
  },
}
