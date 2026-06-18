export default {
  baseStyle: ({ theme }) => ({
    drawerHeaderTitle: {
      ...theme.typography['text-display1-s'],
      color: 'var(--color-primary)',
      textTransform: 'capitalize',
      paddingRight: 'var(--spacing-6)',
    },
    drawerBody: {
      width: '100%',
      flexDirection: 'column',
      padding: 'var(--spacing-3)',
      '& li': {
        ...theme.typography['text-body2-l'],
        color: 'var(--color-primary)',
        marginBottom: 'var(--spacing-2)',
      },
    },
  }),
}
