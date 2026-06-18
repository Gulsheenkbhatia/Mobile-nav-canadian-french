export default {
  baseStyle: ({ theme }) => ({
    ATCStickyDrawerContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        paddingBottom: '19.5px',
        '.content-divider': {
          marginBottom: 0,
        },
        '.content-divider > div': {
          marginTop: 0,
        },
        '.recomm-sec-ATC': {
          marginTop: '19.5px',
        },
      },
    },
    drawerMessageWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        paddingTop: '19.5px',
        paddingBottom: '8.5px',
        '& svg': {
          position: 'absolute',
          right: 'var(--spacing-3)',
          width: '20px',
          height: '20px',
        },
      },
    },
    drawerMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body2-l'],
        fontWeight: 500,
        textAlign: 'left',
        marginTop: 0,
        paddingRight: '20px',
      },
    },
    retentionInfoMessage: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '&.retentionToastMessage': {
          mb: 'var(--spacing-2)',
        },
      },
    },
    bagDrawerBtns: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: '0',
        marginBottom: '5px',
      },
    },
    checkoutButtonStyles: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-eyebrow1-l'],
        fontWeight: 500,
        color: 'var(--color-white-base)',
        backgroundColor: 'var(--color-black-base)',
        padding: '21px var(--spacing-6) 20px',
        borderRadius: 'var(--border-radius-s)',
        height: 'auto',
      },
    },
    viewBagButtonWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 'var(--spacing-2)',
      },
    },
    minibagDisclaimerTop: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: 'var(--spacing-2)',
      },
    },
    viewBagButtonStyles: {
      '&:active': {
        color: '#ebebeb',
        border: 'none',
        backgroundColor: theme.colors.main.black,
      },
      '&:hover': {
        color: 'var(--color-neutral-light)',
        backgroundColor: 'var(--color-primary)',
        border: '1px solid transparent',
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-eyebrow1-l'],
        fontWeight: 500,
        padding: '11.5px var(--spacing-6) 10.5px',
        borderRadius: 'var(--border-radius-s)',
        color: 'var(--color-black-base)',
        borderColor: 'var(--color-inactive)',
      },
    },
  }),
}
