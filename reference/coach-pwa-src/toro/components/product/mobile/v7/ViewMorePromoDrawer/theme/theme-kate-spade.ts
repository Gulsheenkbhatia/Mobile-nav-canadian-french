export default {
  baseStyle: ({ theme }) => ({
    viewMorePromoWrapper: { px: '10px' },
    viewMorePromoButton: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        borderRadius: 'var(--border-radius-full)',
        bg: '#BAD3E9',
        minH: '46px',
      },
    },
    viewMorePromoText: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-title1-m'],
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-125)',
        fontStyle: 'normal',
        color: 'var(--color-primary, #101820)',
        textAlign: 'center',
        textTransform: 'capitalize',
        fontWeight: 400,
      },
    },
    drawerContent: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        width: '100%',
        paddingTop: 0,
        paddingBottom: '50px',
        px: 'var(--spacing-3)',
        borderRadius: 'var(--border-radius-xl) var(--border-radius-xl) 0 0',
        bg: 'var(--color-neutral-light-1, #F0F0F0)',
      },
    },
    drawerOverlay: { opacity: '0.5 !important', bg: 'rgba(0, 0, 0, 0.75)' },
    grabHandleWrapper: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        justifyContent: 'center',
        mt: 'var(--spacing-2)',
        mb: 'var(--spacing-6)',
      },
    },

    grabHandle: {
      width: '47px',
      height: '6px',
      borderRadius: '100px',
      bg: 'var(--color-neutral-light-2, #E1E1E1)',
    },
    drawerBody: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        p: 0,
        mt: 'var(--spacing-3)',
      },
    },
    drawerHeader: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-black-base)',
        p: 0,
      },
    },
    drawerHeaderTitle: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-xl'],
        fontSize: 'var(--text-20)',
        color: 'var(--color-black-base)',
        lineHeight: 'var(--line-height-135)',
        fontWeight: 400,
      },
    },
    promoListContainer: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        flexDirection: 'column',
      },
    },
    promoList: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        flexDirection: 'column',
        maxH: '40vh',
        overflowY: 'auto',
        gap: 'var(--spacing-1)',
      },
    },
    promoListItem: {
      display: 'flex',
      borderRadius: 'var(--border-radius-m)',
      padding: 'var(--spacing-3)',
      alignItems: 'center',
      minH: '54px',
      bg: 'var(--color-white-base)',
    },
    promoItemText: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-title2-m'],
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-125)',
        fontWeight: 500,
        color: 'var(--color-black-base)',
      },
    },
    closeButton: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        display: 'flex',
        padding: '16px 17px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px',
        mt: '10px',
        borderRadius: '100px',
        bg: '#475E72',
      },
    },
    closeButtonText: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body2-l'],
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-135)',
        textTransform: 'capitalize',
        fontWeight: 500,
        color: 'var(--color-white-base)',
      },
    },
  }),
}
