export default {
  baseStyle: ({ theme }) => ({
    goneViralWrapper: {
      bg: 'var(--color-neutral-light-1)',
      padding: 'var(--spacing-3)',
    },
    goneViralContainer: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '20px',
      bg: 'var(--color-neutral-light)',
      padding: 'var(--spacing-6) 0 var(--spacing-6) var(--spacing-4)',
      gap: 'var(--spacing-4)',
    },
    containerOneItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 'var(--spacing-4)',
      '& > div:last-child': {
        marginRight: '9px',
      },
    },
    titleContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    subtitle: {
      ...theme.typography['text-eyebrow2-s'],
      color: 'var(--color-neutral-medium)',
      textAlign: 'left',
    },
    title: {
      ...theme.typography['text-display4-s'],
    },
  }),
  variants: {
    pdp: {
      goneViralContainer: {
        bg: 'var(--color-white-base)',
      },
    },
  },
}
