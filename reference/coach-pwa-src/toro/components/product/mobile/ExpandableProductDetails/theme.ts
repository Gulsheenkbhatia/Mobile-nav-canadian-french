export default {
  baseStyle: ({ theme }) => ({
    accordionsWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    accordionItem: {
      borderBottom: '1px solid var(--color-border-filter-pill-default)',
    },
    accordionPanel: {
      p: 'var(--spacing-4) var(--spacing-3)',
    },
    accordionButton: {
      p: '20px var(--spacing-3) var(--spacing-4)',
    },
    accordionButtonText: {
      ...theme.typography['text-display4-xxs'],
      display: 'flex',
      justifyContent: 'space-between',
    },
    accordionIcon: {
      width: '24px',
      height: '24px',
    },
  }),
  variants: {
    collapsible: ({ theme }) => ({
      accordionsWrapper: {
        p: 'var(--spacing-4) 0 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      },
      accordionItem: {
        borderBottom: '1px solid var(--color-border-filter-pill-default)',
        _last: {
          borderBottom: '0 none',
        },
      },
      accordionButtonText: {
        ...theme.typography['text-title1-m'],
      },
      accordionPanel: {
        p: 'var(--spacing-4) var(--spacing-3)',
      },
      accordionIcon: {
        padding: '5px',
        stroke: '#1D1B20',
        strokeWidth: '2px',
      },
    }),
  },
}
