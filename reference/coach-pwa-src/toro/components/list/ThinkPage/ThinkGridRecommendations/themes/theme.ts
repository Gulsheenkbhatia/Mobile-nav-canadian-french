export default {
  parts: [
    'container',
    'wrapper',
    'title',
    'description',
    'gridWrapper',
    'ctaWrapper',
    'ctaButton',
    'desktopGrid',
    'desktopGridItem',
  ],
  baseStyle: ({ theme }) => ({
    container: {
      width: '100%',
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '0',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        padding: '0',
      },
    },
    wrapper: {
      width: '100%',
    },
    gridWrapper: {
      display: 'grid',
      width: '100%',
      gap: 'var(--spacing-4)',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      padding: 'var(--spacing-0)',
      [`@media (min-width: ${theme.breakpoints.xl})`]: {
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      },
    },
    title: {
      ...theme.typography['text-display4-s'],
      textAlign: 'center',
      color: 'var(--color-black-base)',
      margin: 'var(--spacing-4) 0',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display4-2xl'],
      },
    },
    description: {
      ...theme.typography['text-eyebrow2-m'],
      color: 'var(--color-black-base)',
      textAlign: 'center',
      marginBottom: 'var(--spacing-3)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display3-s'],
        marginBottom: 'var(--spacing-6)',
      },
    },
    ctaWrapper: {
      padding: '20px 10px',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        marginTop: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-6)',
        padding: '0',
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        my: 'var(--spacing-2)',
      },
    },
    ctaButton: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-3)',
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      fontSize: 'var(--text-14)',
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-13)',
      },
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&:active': {
        backgroundColor: 'transparent',
      },
      '&:focus': {
        backgroundColor: 'transparent',
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-cta2-m'],
        fontWeight: 400,
        gap: 'var(--spacing-2)',
      },
    },
    desktopGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
      alignItems: 'stretch',
      gap: 'var(--spacing-6)',
    },
    desktopGridItem: {
      placeItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      alignItems: 'stretch',
      '&.lazySlot': {
        gridColumn: 'span 2',
        gridRow: 'span 2',
      },
    },
  }),
}
