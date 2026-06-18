export default {
  baseStyle: ({ theme }) => ({
    breadcrumbLink: () => ({
      ...theme.typography['text-body1-s'],
      textTransform: 'uppercase',
    }),
    separator: {
      '*': {
        ...theme.typography['text-body1-s'],
      },
      lineHeight: 'var(--line-height-2xl)',
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      breadcrumbLink: () => ({
        ...theme.typography['text-body1-s'],
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          color: 'var(--color-black-base)',
          lineHeight: 'var(--line-height-140)',
          fontWeight: '400',
        },
      }),

      separator: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          color: 'var(--color-black-base)',
          lineHeight: 'var(--line-height-140)',
          fontWeight: '400',
        },
      },
    }),
  },
}
