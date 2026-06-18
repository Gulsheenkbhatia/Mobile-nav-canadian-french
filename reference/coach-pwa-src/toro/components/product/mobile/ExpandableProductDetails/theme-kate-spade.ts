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
      ...theme.typography['text-display2-s'],
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
      accordionPanel: {
        p: 'var(--spacing-4) var(--spacing-3)',
      },
    }),

    pdpv7: ({ theme }) => ({
      accordionButtonText: {
        ...theme.typography['text-body2-l'],
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 500,
      },
      accordionIcon: {
        width: 'var(--spacing-4)',
        height: 'var(--spacing-4)',
      },

      accordionButton: {
        p: '20px',
      },

      accordionPanel: {
        p: '20px',
      },

      accordionsWrapper: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-secondary)',
        borderRadius: 'var(--border-radius-m)',
      },
    }),
  },
}
