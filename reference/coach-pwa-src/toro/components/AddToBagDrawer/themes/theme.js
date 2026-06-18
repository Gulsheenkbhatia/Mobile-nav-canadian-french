export default {
  baseStyle: ({ theme }) => ({
    drawerMessage: {
      textAlign: 'center',
      color: theme.colors.main.black,
      marginTop: '6px',
      size: 'md',
    },
    bagDrawerOverlay: {
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: theme.colors.main.black,
      opacity: '.2',
      zIndex: '1500',
    },
    bagDrawerBtns: {
      margin: 'var(--spacing-2) var(--spacing-3) 0',
    },
    ATCStickyDrawerContainer: {
      paddingBottom: 'var(--spacing-4)',
      '@media (max-height: 600px)': {
        '.recomm-sec-ATC': {
          display: 'none',
        },
      },
      '.recomm-sec-ATC': {
        marginTop: 'var(--spacing-12)',
      },
      '.productName': {
        lineClamp: 1,
        WebkitLineClamp: 1,
      },
      '.content-divider': {
        marginBottom: 'var(--spacing-4)',
        '&::before': {
          display: 'none',
        },
      },
      '.content-divider > div': {
        padding: 0,
        marginTop: '-16px',
      },
      '.certona_title': {
        marginBottom: theme.space.m,
      },
    },
    retentionMessageWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      margin: 'var(--spacing-4) var(--spacing-3) 0',
      p: {
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-14)',
        color: 'var(--color-black-base)',
      },
      svg: {
        minWidth: '16px',
        minHeight: '16px',
        marginRight: 'var(--spacing-2)',
      },
    },
    viewBagButtonVariant: {
      variant: 'secondary',
    },
    checkoutButtonVariant: {
      variant: 'primary',
    },
    viewBagButtonWrapper: {
      width: '100%',
      mt: 'var(--spacing-3)',
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
    },
    ATCDrawerRecommendationLink: {
      textAlign: 'center',
      paddingBottom: 'var(--spacing-2)',
      marginTop: 'var(--spacing-4)',
      '& > a': {
        color: 'var(--color-primary)',
        paddingBottom: '3px',
        borderBottom: 'var(--border-width-s) solid var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-16)',
        lineHeight: 'var(--line-height-l)',
        letterSpacing: 'var(--letter-spacing-xs)',
      },
    },
    ATCDrawerRecommendationCarouselItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: '160px',
      maxHeight: '200px',
      '& > a': {
        color: 'var(--color-primary)',
        paddingBottom: 0,
        borderBottom: 'var(--border-width-s) solid var(--color-black-base)',
        fontFamily: 'var(--font-face1-normal)',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: 'var(--letter-spacing-xs)',
        fontSize: 'var(--text-14)',
      },
    },
    minibagDisclaimerTop: {
      mt: 'var(--spacing-6)',
      mb: 'var(--spacing-2)',
    },
    minibagDisclaimerBottom: {
      mt: 'var(--spacing-4)',
      mx: 'var(--spacing-3)',
    },
    drawerRecommendation: {
      minHeight: '313px',
      height: '100%',
    },
  }),
  variants: {
    enchncedATBRecommendationMobile: ({ theme }) => ({
      ATCStickyDrawerContainer: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          paddingBottom: 0,
          '.recomm-sec-ATC': {
            marginTop: 0,
            marginLeft: 'var(--spacing-3)',
          },
        },
      },
      drawerMessageWrapper: {
        p: '30px 11px 0',
        justifyContent: 'start',
        '& svg': {
          width: '32px',
          height: '32px',
        },
      },
      closeIconWrapper: {
        position: 'absolute',
        top: 'var(--spacing-3)',
        right: 'var(--spacing-2)',
      },
      drawerMessage: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display4-xxs'],
        },
      },
      retentionInfoMessage: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mb: 0,
          backgroundColor: 'unset',
          p: 0,
        },
      },
      minibagDisclaimerTop: {
        mt: 'var(--spacing-3)',
        mb: 'var(--spacing-3)',
      },
      checkoutButtonVariant: {
        sx: {
          ...theme.typography['text-cta2-xs'],
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-xs)',
          padding: '10px 14px',
          height: '35px',
          borderRadius: '130px',
          textTransform: 'capitalize',
        },
      },
      viewBagButtonVariant: {
        sx: {
          ...theme.typography['text-cta2-xs'],
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-xs)',
          borderColor: '#C4C4C4',
          padding: '10px 14px',
          height: '35px',
          borderRadius: '130px',
          textTransform: 'capitalize',
        },
      },
      viewBagButtonWrapper: {
        mt: 'var(--spacing-3)',
      },
      certonaTitleWrapper: {
        m: 'var(--spacing-6) var(--spacing-3) var(--spacing-3)',
      },
      certonaSubTitle: {
        color: 'var(--color-neutral-medium)',
        leadingTrim: 'both',
        textEdge: 'cap',
        fontFamily: 'var(--font-face1-normal)',
        fontSize: 'var(--text-12)',
        fontStyle: 'normal',
        fontWeight: 400,
        lineHeight: 'var(--line-height-120)',
        letterSpacing: 'var(--letter-spacing-s)',
      },
      certonaTitle: {
        ...theme.typography['text-display4-xxs'],
      },
    }),
    postATBMobile: ({ theme }) => ({
      bagDrawerOverlay: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          opacity: '1',
          backdropFilter: 'blur(15px)',
          background: 'rgba(32, 32, 32, 0.80)',
        },
      },
      drawerMessageWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          p: '0 var(--spacing-3) 0',
          flexDirection: 'row',
        },
      },
      drawerMessage: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display4-xxs'],
          fontWeight: 700,
          textAlign: 'start',
          mt: 0,
        },
      },
      retentionInfoMessage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mb: 'var(--spacing-4)',
        },
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          mb: 'var(--spacing-4)',
          backgroundColor: 'unset',
          p: 0,
          '& div': {
            ...theme.typography['text-body1-m'],
            alignItems: 'start',
            ml: 0,
          },
        },
      },
      bagDrawerBtns: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          margin: 'var(--spacing-1) var(--spacing-3) 0',
        },
      },
      ATCStickyDrawerContainer: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          py: 'var(--spacing-6)',
          borderTopLeftRadius: 'var(--spacing-4)',
          borderTopRightRadius: 'var(--spacing-4)',
        },
        '.content-divider': {
          marginBottom: 0,
        },
        '.content-divider > div': {
          padding: 0,
          marginTop: 0,
        },
      },
      closeIconWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          position: 'absolute',
          top: 'var(--spacing-3)',
          right: 'var(--spacing-3)',
          width: '40px',
          height: '40px',
          padding: '10px',
          borderRadius: '20px',
          backgroundColor: 'var(--color-neutral-light-1)',
          '& svg': {
            width: '20px',
            height: '20px',
          },
        },
      },
      viewBagButtonWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          width: '100%',
          mt: 'var(--spacing-2)',
        },
      },
      checkoutButtonVariant: {
        sx: {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-cta2-s'],
            textTransform: 'capitalize',
            display: 'flex',
            height: '46px',
            padding: '10px 14px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '100px',
            color: 'var(--color-white-base)',
          },
        },
      },
      viewBagButtonVariant: {
        sx: {
          [`@media (max-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-cta2-s'],
            textTransform: 'capitalize',
            display: 'flex',
            height: '46px',
            padding: '10px 14px',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '100px',
            border: '1px solid var(--color-neutral-light-2)',
            background: 'var(--color-white-base)',
          },
        },
      },
      minibagDisclaimerTop: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          m: 0,
        },
      },
      shippingReturns: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          display: 'flex',
          width: 'fit-content',
          minWidth: '202px',
          padding: 'var(--spacing-1) var(--spacing-3)',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--spacing-1)',
          borderRadius: '30px 30px 0 0',
          background: 'var(--color-neutral-light-1)',
          margin: '0 auto',

          '& p': {
            ...theme.typography['text-body1-xs'],
            color: 'var(--color-neutral-dark)',
          },
          'svg > use[href="#icon-shipping"]': {
            color: 'var(--color-neutral-dark)',
          },
        },
      },
    }),
  },
}
