export default {
  baseStyle: ({ theme }) => ({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    parentItem: {
      borderBottom: '1px solid var(--color-border-filter-pill-default)',
    },
    parentButton: {
      p: '20px var(--spacing-3) var(--spacing-4)',
      justifyContent: 'space-between',
    },
    parentButtonText: {
      ...theme.typography['text-display4-xxs'],
      fontWeight: 'bold',
    },
    parentIcon: {
      width: '24px',
      height: '24px',
    },
    parentPanel: {
      p: 0,
    },
  }),
}
