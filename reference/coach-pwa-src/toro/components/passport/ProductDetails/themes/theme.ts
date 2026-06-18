export default {
  baseStyle: ({ theme }) => ({
    rootWrapper: {
      padding: '0 var(--spacing-3)',
      mb: 'var(--spacing-12)',
    },
    infoCard: {
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-6) var(--spacing-6)',
      boxShadow:
        '0 -1px 4px 0 rgba(0, 0, 0, 0.04), 0 4px 4px 0 rgba(0, 0, 0, 0.04), 0 8px 24px 0 rgba(0, 0, 0, 0.04)',
      gap: '18px',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'var(--spacing-6) var(--spacing-6) var(--spacing-8)',
      },
    },
    infoCardContainer: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        width: '100%',
        maxWidth: '424px',
        margin: '0 auto',
      },
    },
    infoCardTitle: {
      ...theme.typography['text-display1-m'],
      textAlign: 'center',
      mb: '18px',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        fontWeight: 800,
        mb: 'var(--spacing-6)',
      },
    },
    infoCardContent: {
      '& div:last-child': {
        marginBottom: 0,
      },
    },
    detailsDescriptionRow: {
      display: 'grid',
      gridTemplateColumns: '3fr 7fr',
      gap: 'var(--spacing-1)',
      marginBottom: '10px',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        marginBottom: 'var(--spacing-4)',
      },
    },
    detailsDescriptionTitle: {
      ...theme.typography['text-body1-s'],
      fontWeight: 800,
      minWidth: '80px',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-l'],
      },
    },
    detailsDescriptionText: {
      ...theme.typography['text-body2-s'],
      fontWeight: 500,
      whiteSpace: 'normal',
      overflowWrap: 'break-word',
      textAlign: 'right',
      minWidth: 0,
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body2-l'],
      },
    },
    button: {
      ...theme.typography['text-cta1-m'],
      fontWeight: 800,
      width: '100%',
      padding: 'var(--spacing-3) var(--spacing-6)',
      color: 'var(--color-secondary)',
      mt: '18px',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        mt: 'var(--spacing-6)',
      },
    },
  }),
}
