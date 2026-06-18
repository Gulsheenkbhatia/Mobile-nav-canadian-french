export default {
  baseStyle: () => ({
    wrapper: {
      '& span:not(:last-child), & a:not(:last-child)': {
        mr: 'var(--spacing-2)',
      },
    },
  }),
  variants: {
    pdpV4Enhanced: () => ({
      wrapper: {
        '& span:not(:last-child), & a:not(:last-child)': {
          mr: 'var(--spacing-2)',
        },
      },
    }),
  },
}
