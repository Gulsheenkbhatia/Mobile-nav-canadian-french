export default {
  baseStyle: ({ theme }) => ({
    drawerOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(15px)',
    },
    drawerContent: {
      maxWidth: '420px',
      paddingTop: 'var(--spacing-6)',
      paddingLeft: 'var(--spacing-3)',
      paddingRight: 'var(--spacing-3)',
    },
    drawerHeader: {
      padding: 0,
      marginBottom: 'var(--spacing-6)',
      color: 'var(--color-black-base)',
    },
    drawerTitle: {
      ...theme.typography['text-display4-xxs'],
      marginBottom: 'var(--spacing-1)',
    },
    drawerSubtitle: {
      marginBottom: 'var(--spacing-4)',
      ...theme.typography['text-body1-m'],
      fontWeight: 400,
    },
    drawerCloseButton: {
      position: 'static',
      float: 'right',
      width: '40px',
      height: '40px',
      marginTop: 'calc(var(--spacing-3)*-1)',
      padding: '10px',
      color: 'var(--color-black-base)',
      borderRadius: '20px',
      border: '0.5px solid var(--color-neutral-light-1)',
      background: 'var(--color-neutral-light-1)',
    },
    drawerShippingWrapper: {
      width: 'fit-content',
      minWidth: '202px',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: 'var(--spacing-1)',
      paddingBottom: 'var(--spacing-1)',
      gap: 'var(--spacing-1)',
      justifyContent: 'center',
      borderRadius: '30px 30px 0 0',
      backgroundColor: 'var(--color-neutral-light-1)',
      '& svg': {
        width: 'var(--spacing-4)',
        height: 'var(--spacing-4)',
      },
      'svg > use[href="#icon-shipping"]': {
        color: 'var(--color-neutral-dark)',
      },
    },
    drawerShipping: {
      ...theme.typography['text-body1-xs'],
      fontWeight: 400,
      color: 'var(--color-neutral-dark)',
    },
    drawerButtonsWrapper: {
      gap: 'var(--spacing-2)',
    },
    drawerLink: {
      '&:focus, &:focus-visible': {
        outline: '0 none',
      },
    },
    drawerButton: {
      width: '100%',
      height: '46px',
      padding: '10px 14px',
    },
    drawerCheckoutButton: {
      ...theme.typography['text-cta2-s'],
      color: 'var(--color-white-base)',
      backgroundColor: 'var(--color-black-base)',
      borderRadius: '100px',
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--color-neutral-medium)',
      },
      '&:active:not(:disabled)': {
        backgroundColor: 'var(--color-grey-80)',
      },
      '&:focus, &:focus-visible': {
        outline: '0 none',
        boxShadow: 'none',
        backgroundColor: 'var(--color-black-base)',
      },
    },
    drawerShoppingButton: {
      ...theme.typography['text-cta2-s'],
      borderRadius: '130px',
      border: '1px solid var(--color-neutral-light-2)',
      color: 'var(--color-black-base)',
      backgroundColor: 'var(--color-white-base)',
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--color-secondary)',
      },
      '&:active:not(:disabled)': {
        backgroundColor: 'var(--color-secondary)',
      },
      '&:focus, &:focus-visible': {
        outline: '0 none',
        boxShadow: 'none',
        backgroundColor: 'var(--color-secondary)',
      },
    },
    drawerBody: {
      padding: 0,
      overflowY: 'auto',
      '-ms-overflow-style': 'none',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  }),
}
