export default {
  baseStyle: ({ theme }) => ({
    drawerContent: {
      width: '495px !important',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        height: '74vh',
        width: '100%',
      },
      '& .chakra-modal__close-btn': {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          top: 'var(--spacing-2)',
          right: 'var(--spacing-2)',
        },
        top: 'var(--spacing-3)',
        right: 'var(--spacing-3)',
      },
      '.content-divider::before': {
        display: 'none',
      },
    },
    drawerHeader: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        padding: 'var(--spacing-3) var(--spacing-2)',
        paddingRight: 'var(--spacing-10)',
      },
      padding: 'var(--spacing-3) 20px',
      paddingRight: 'var(--spacing-12)',
      gap: '10px',
      alignItems: 'center',
      borderBottom: '1px solid var(--color-inactive)',
    },
    drawerHeaderTitle: {
      flexDirection: 'column',
      gap: '2.5px',
    },
    productThumbnailImage: {
      objectFit: 'contain',
      flexShrink: '0',
      width: '72px',
      aspectRatio: '0.84',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: '48px',
        aspectRatio: '1',
      },
    },
    similarToLabel: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-badge1-xs'],
        fontSize: 'var(--text-10)',
        lineHeight: 'var(--line-height-115)',
      },
      ...theme.typography['text-label1-m'],
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-12)',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: 'var(--line-height-135)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    similarToProductName: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
      },
      ...theme.typography['text-body1-l'],
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-16)',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: 'var(--line-height-135)',
      letterSpacing: '0.2px',
      textTransform: 'capitalize',
    },
    drawerBody: {
      padding: '0',
      overflowY: 'auto',
      overflowX: 'hidden',
      flexDirection: 'column',
      flex: '1 1 0',
    },
    whoopsMessage: {
      fontSize: 'var(--text-16)',
      padding: 'var(--spacing-4) var(--spacing-6)',
      textAlign: 'center',
    },
    drawerCloseBtnWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '7.5px',
    },
    drawerCloseBtn: {
      height: '48px',
      padding: 'var(--spacing-4) var(--spacing-6)',
      borderRadius: 'var(--border-radius-xs)',
      border: '1px solid var(--color-primary)',
      background: 'var(--color-secondary)',
      color: 'var(--color-primary)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-115)',
      letterSpacing: 'var(--letter-spacing-xl)',
      fontWeight: 400,
      '&:hover': {
        backgroundColor: 'var(--color-primary) !important',
        color: 'var(--color-secondary)',
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: '80px',
        height: '30px',
        padding: 'var(--spacing-2)',
        fontSize: 'var(--text-10)',
      },
    },
  }),
}
