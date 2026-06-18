export default {
  parts: ['breadcrumbLink', 'breadcrumbText'],

  baseStyle: () => ({
    breadcrumbLink: () => ({
      color: 'var(--color-black-base)',
      '&:focus': {
        boxShadow: 'none',
      },
    }),
    breadcrumbText: {
      fontSize: 'var(--text-12)',
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 'var(--chakra-fontWeights-normal)',
    },
    breadcrumbEllipsis: {
      backgroundColor: 'var(--color-white-base)',
      position: 'absolute',
      zIndex: 1,
      top: 0,
      right: 0,
      bottom: 0,
      userSelect: 'none',
      transition: 'opacity 100ms cubic-bezier(0.83, 0, 0.17, 1)',
      paddingLeft: '1px',
    },
  }),
  variants: {
    plpv3: ({ theme }) => ({
      breadcrumbText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          whiteSpace: 'nowrap',
        },
      },
    }),
  },
}
