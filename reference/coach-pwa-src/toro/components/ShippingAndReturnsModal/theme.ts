export default {
  baseStyle: ({ theme }) => ({
    drawerContent: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: '100%',
        minHeight: '311px',
      },
      '& .chakra-modal__close-btn': {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          top: 'var(--spacing-3)',
          right: 'var(--spacing-3)',
          width: '24px',
          height: '24px',
          svg: {
            width: '13px',
            height: '13ppx',
          },
        },
      },
    },
    drawerHeader: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: 'var(--spacing-3) var(--spacing-3)',
      },
    },
    drawerHeaderTitle: {
      ...theme.typography['text-display1-s'],
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-20)',
      lineHeight: 'var(--line-height-s)',
      fontWeight: 700,
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-primary)',
      textTransform: 'capitalize',
      paddingRight: 'var(--spacing-6)',
    },
    drawerBody: {
      width: '100%',
      flexDirection: 'column',
      padding: 'var(--spacing-3)',
      '.ship-text': {
        ...theme.typography['text-body1-m'],
        color: 'var(--color-primary)',
        fontSize: 'var(--text-14)',
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 400,
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
        marginBottom: 'var(--spacing-2)',
      },
    },
  }),
}
