export default {
  parts: [
    'buttonContainer',
    'iconWrapper',
    'buttonMainText',
    'buttonSubText',
    'learnMoreWrapper',
    'learnMoreText',
    'overlay',
    'contentWrapper',
    'header',
    'title',
    'closeButton',
    'subtitle',
    'description',
    'widgetsContainer',
    'disclaimer',
  ],
  baseStyle: ({ theme }) => ({
    buttonContainer: {
      p: '20px var(--spacing-3)',
      backgroundColor: 'var(--color-neutral-light)',
      borderTop: '1px solid var(--color-neutral-light-2)',
      borderBottom: '1px solid var(--color-neutral-light-2)',
      justifyContent: 'space-between',
      mb: '-1px',
    },
    iconWrapper: {
      mr: 'var(--spacing-2)',
    },
    buttonMainText: {
      ...theme.typography['text-title1-s'],
      fontWeight: 400,
    },
    buttonSubText: {
      ...theme.typography['text-title1-xs'],
      fontWeight: 400,
      opacity: 0.7,
    },
    learnMoreWrapper: {
      alignItems: 'center',
    },
    learnMoreText: {
      ...theme.typography['text-title1-s'],
      textDecoration: 'underline',
      mr: 'var(--spacing-1)',
      color: 'var(--color-grey-80)',
      fontWeight: 400,
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(27, 27, 27, 0.80)',
      zIndex: 1000,
    },
    contentWrapper: {
      position: 'absolute',
      bottom: '0',
      width: '100vw',
      backgroundColor: 'var(--color-white-base)',
      p: '26px 26px 50px 29px',
      borderRadius: '25px 25px 0 0',
    },
    header: {
      justifyContent: 'center',
      mb: '19px',
    },
    title: {
      ...theme.typography['text-display4-xxs'],
      textTransform: 'uppercase',
    },
    closeButton: {
      position: 'absolute',
      top: '3%',
      right: '4%',
    },
    subtitle: {
      ...theme.typography['text-title1-m'],
      fontFamily: 'var(--font-face1-extended-bold)',
      fontWeight: 400,
      mb: 'var(--spacing-3)',
    },
    description: {
      ...theme.typography['text-title1-s'],
    },
    widgetsContainer: {
      flexDirection: 'column',
      gap: '14px',
      m: '28px 0 42px',
      '& .klarna-container': {
        p: 0,
        m: 0,
        backgroundColor: 'inherit',
        '& .klarna-details': {
          w: '80%',
        },
      },
      '& .afterpay-wrapper': {
        justifyContent: 'start',
      },
    },
    disclaimer: {
      ...theme.typography['text-title1-xs'],
    },
  }),
}
