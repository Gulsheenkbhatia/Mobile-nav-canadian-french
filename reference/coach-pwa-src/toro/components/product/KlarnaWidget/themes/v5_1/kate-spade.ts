export default {
  parts: ['container', 'details'],
  baseStyle: ({ theme }) => ({
    container: {
      flexWrap: 'nowrap',
      alignItems: 'center',
      gap: 'var(--spacing-1, 4px)',
    },
    details: {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: '42px',
      marginRight: 0,
      gap: '2px',
      ...theme.typography['text-body2-xs'],
      fontWeight: '500',
      color: 'var(--color-white-base, #fff)',
      '& path': {
        fill: 'var(--color-white-base, #fff)',
      },
    },
  }),
}
