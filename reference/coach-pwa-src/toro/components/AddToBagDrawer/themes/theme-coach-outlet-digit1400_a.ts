export default {
  baseStyle: ({ theme }) => ({
    drawerMessageWrapper: {
      p: '19px var(--spacing-3) 0',
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
        ...theme.typography['text-label1-m'],
        fontFamily: 'var(--font-face1-normal)',
        fontWeight: 700,
        letterSpacing: 'var(--letter-spacing-l)',
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-s)',
        textAlign: 'left',
        mt: 0,
      },
    },
    retentionInfoMessage: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mb: 'var(--spacing-2)!important',
        borderRadius: 'var(--border-radius-s)',
        '& div': {
          fontSize: 'var(--text-12)!important',
        },
      },
    },
    bagDrawerBtns: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        mt: 'var(--spacing-4)',
      },
    },
    checkoutButtonVariant: {
      sx: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-xs'],
          borderRadius: 'var(--border-radius-s)',
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-115)',
          color: 'var(--color-white-base)',
          padding: 'var(--spacing-6)',
          height: '57px',
        },
      },
    },
    viewBagButtonVariant: {
      sx: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-cta1-s'],
          borderRadius: 'var(--border-radius-s)',
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-115)',
          color: 'var(--color-black-base)',
          borderColor: '#C4C4C4',
        },
      },
    },
    viewBagButtonWrapper: {
      mt: 'var(--spacing-2)',
    },
    ATCStickyDrawerContainer: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '.content-divider': {
          marginBottom: 0,
        },
        '.content-divider > div': {
          marginTop: 0,
        },
        '.recomm-sec-ATC': {
          marginTop: '21px',
        },
      },
    },
    drawerRecommendation: {
      minHeight: '230px',
      height: '100%',
    },
  }),
}
