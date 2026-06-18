export default {
  baseStyle: ({ theme }) => ({
    rootWrapper: {
      padding: '0 var(--spacing-3)',
      mb: 'var(--spacing-12)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        mt: 'var(--spacing-12)',
      },
    },
    productCard: {
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-6)',
      boxShadow:
        '0 -1px 4px 0 rgba(0, 0, 0, 0.04), 0 4px 4px 0 rgba(0, 0, 0, 0.04), 0 8px 24px 0 rgba(0, 0, 0, 0.04)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'var(--spacing-6) 43px var(--spacing-8) 44px',
      },
    },
    productCardNotConnectedIcon: {
      '& svg': {
        width: '16px',
        height: '16px',
      },
      '& path': {
        fill: 'var(--color-black-base)',
      },
    },
    productImage: {
      aspectRatio: '4 / 5',
      objectFit: 'cover',
    },
    title: {
      fontSize: 'var(--text-26)',
      textAlign: 'center',
      marginBottom: 'var(--spacing-6)',
      fontFamily: 'var(--font-face1-extrabold)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-44)',
        marginBottom: 'var(--spacing-8)',
      },
    },
    connectionStatusWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      mb: 'var(--spacing-4)',
      gap: 'var(--spacing-1)',
    },
    connectionStatus: {
      ...theme.typography['text-cta1-xs'],
      fontWeight: 800,
    },
    disclaimer: {
      ...theme.typography['text-body2-s'],
      textAlign: 'center',
      fontWeight: 500,
      marginTop: 'var(--spacing-3)',
    },
    certificateTitle: {
      ...theme.typography['text-display1-l'],
      textAlign: 'center',
      fontWeight: 800,
      mb: 'var(--spacing-4)',
    },
    digitalIdBadge: {
      display: 'flex',
      justifyContent: 'center',
      padding: 'var(--spacing-3) var(--spacing-4)',
      backgroundColor: 'var(--color-neutral-light-1)',
      borderRadius: '6px',
      width: 'fit-content',
      margin: '0 auto',
      mb: 'var(--spacing-4)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        mb: 'var(--spacing-8)',
      },
    },
    digitalIdText: {
      ...theme.typography['text-body1-m'],
      fontFamily: 'var(--font-face1-medium)',
      fontWeight: 400,
    },
    productContainer: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        justifyContent: 'space-between',
      },
    },
    productImageCentered: {
      width: '100%',
      mb: 'var(--spacing-4)',
      display: 'block',
      aspectRatio: '4 / 5',
      overflow: 'hidden',
      '& img': {
        objectFit: 'cover',
        width: '100%',
        height: '100%',
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        maxWidth: '349px',
        margin: 0,
      },
    },
    productDetailsContainer: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '400px',
      },
    },
    productName: {
      ...theme.typography['text-display1-s'],
      textAlign: 'center',
      fontWeight: 800,
      mb: 'var(--spacing-4)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display1-m'],
        mb: 'var(--spacing-6)',
      },
    },
    button: {
      ...theme.typography['text-cta1-m'],
      fontWeight: 800,
      width: '100%',
      padding: 'var(--spacing-3) var(--spacing-6)',
      color: 'var(--color-secondary)',
    },
    circularServicesSubcopy: {
      ...theme.typography['text-body1-m'],
      fontFamily: 'var(--font-face1-medium)',
      fontWeight: 400,
      textAlign: 'center',
      mt: 'var(--spacing-4)',
    },
    connectButtonPoshmark: {
      mt: 'var(--spacing-2)',
    },
  }),
}
