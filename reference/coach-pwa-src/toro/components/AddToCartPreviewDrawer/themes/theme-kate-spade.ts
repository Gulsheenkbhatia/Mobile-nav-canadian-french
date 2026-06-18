export default {
  baseStyle: ({ theme }) => ({
    drawerTitle: {
      ...theme.typography['text-display1-s'],
      fontWeight: '400',
    },
    drawerShipping: {
      ...theme.typography['text-body1-s'],
    },
    drawerCheckoutButton: {
      ...theme.typography['text-body1-l'],
      fontWeight: '500',
      textTransform: 'none',
    },
    drawerShoppingButton: {
      ...theme.typography['text-body1-l'],
      fontWeight: '500',
      textTransform: 'none',
    },
    '&:hover:not(:disabled), &:active:not(:disabled), &:focus, &:focus-visible': {
      backgroundColor: '#fffffe',
    },
  }),
}
