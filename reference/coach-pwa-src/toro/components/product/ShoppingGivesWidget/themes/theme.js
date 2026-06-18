export default {
  parts: [
    'shoppingGivesContainer',
    'shoppingGivesWidget',
    'shoppingGivesTitle',
    'shoppingGivesButtonContainer',
    'shoppingGivesButton',
    'shoppingGivesSelectSignInButton',
    'shoppingGives',
    'shoppingGivesBody',
    'poweredByContainer',
  ],
  baseStyle: ({ theme }) => {
    return {
      shoppingGivesContainer: {
        m: '5px 0',
        '& .shoppinggives-tag.contained': {
          background: '#fff',
          marginTop: 0,
        },
        pt: '5px',
      },
      shoppingGivesTitle: {
        mb: '4px',
        fontWeight: theme.fontWeights.bold,
      },
      shoppingGivesWidget: {
        position: 'absolute',
        top: '5px',
        left: '0',
        width: '100%',
        border: `1px solid ${theme.colors.main.inactive}`,
        p: '10px',
      },
      shoppingGivesButtonContainer: {
        mt: '6px',
      },
      shoppingGivesButton: {
        maxWidth: '120px',
        lineHeight: '12px',
        verticalAlign: 'baseline',
        borderBottom: 'none',
        textDecoration: 'underline',
        letterSpacing: 0,
        fontFamily: theme.fontFamily.primaryBold,
        '&:hover:not(:disabled), &:active': {
          color: 'var(--color-primary)',
          borderBottomColor: 'var(--color-primary)',
        },
        '&:disabled': {
          opacity: 1,
          cursor: 'default',
          boxShadow: 'none',
        },
        fontWeight: theme.fontWeights.bold,
      },
      shoppingGivesSelectSignInButton: {
        mr: '10px',
      },
      shoppingGivesBody: {
        '& > span': {
          fontWeight: theme.fontWeights.bold,
        },
      },
      poweredByContainer: {
        justifyContent: 'flex-start',
        alignItems: 'baseline',
        mt: '8px',
        minHeight: '17px',
      },
    }
  },
}
