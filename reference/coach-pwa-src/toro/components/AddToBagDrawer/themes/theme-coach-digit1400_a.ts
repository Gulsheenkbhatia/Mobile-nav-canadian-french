export default {
  baseStyle: ({ theme }) => ({
    drawerMessageWrapper: {
      p: '22px var(--spacing-3) 0',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexDirection: 'row-reverse',
      '& svg': {
        width: '20px',
        height: '20px',
      },
    },
    drawerMessage: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mt: 0,
        fontSize: 'var(--text-16)',
        fontFamily: 'var(--font-face1-normal)',
        textAlign: 'left',
        letterSpacing: 'var(--letter-spacing-l)',
        fontWeight: 700,
        lineHeight: 'var(--line-height-s)',
      },
    },
    checkoutButtonVariant: {
      sx: {
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-xs)',
        padding: 'var(--spacing-6)',
        height: '57px',
      },
    },
    viewBagButtonVariant: {
      sx: {
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-xs)',
        borderColor: '#C4C4C4',
      },
    },
    viewBagButtonWrapper: {
      mt: 'var(--spacing-2)',
    },
    retentionInfoMessage: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mb: 'var(--spacing-2)',
      },
    },
    ATCStickyDrawerContainer: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        paddingBottom: 'var(--spacing-6)',
        '.content-divider': {
          marginBottom: 0,
        },
        '.content-divider > div': {
          marginTop: 0,
        },
        '.recomm-sec-ATC': {
          marginTop: '20px',
        },
      },
    },
    drawerRecommendation: {
      minHeight: '230px',
      height: '100%',
    },
  }),
}
