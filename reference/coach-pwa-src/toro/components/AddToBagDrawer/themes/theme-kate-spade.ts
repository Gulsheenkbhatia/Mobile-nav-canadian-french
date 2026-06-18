export default {
  variants: {
    postATBMobile: ({ theme }) => ({
      drawerMessage: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-s'],
          fontWeight: 400,
        },
      },
      retentionInfoMessage: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '&.retentionToastMessage': {
            mb: 'var(--spacing-4)',
          },
        },
      },
      drawerMessageWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '& svg': {
            right: 'unset',
          },
        },
      },
      checkoutButtonVariant: {
        sx: {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-l'],
            fontWeight: 500,
            backgroundColor: 'var(--color-black-base)',
          },
        },
      },
      viewBagButtonVariant: {
        sx: {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-l'],
            fontWeight: 500,
            color: 'var(--color-black-base)',
          },
        },
      },
      shippingReturns: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '& p': {
            ...theme.typography['text-body1-s'],
            fontWeight: 400,
          },
        },
      },
    }),
  },
}
