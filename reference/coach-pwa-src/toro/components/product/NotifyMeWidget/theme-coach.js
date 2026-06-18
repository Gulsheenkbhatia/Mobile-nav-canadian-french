export default {
  parts: [
    'pdpTxtNotifymeModalHeader',
    'pdpTxtNotifymeModalHdng2',
    'pdpTxtNotifymeModalEmailLabel',
    'emailErrorMessageStyle',
    'pdpBtnNotifymeModalSubmit',
    'somethingWentWrongMsg',
    'successModalPopUpHeading1',
    'successModalPopUpHeading2',
    'continueShoppingButton',
    'pdpModalNotifymeSection',
    'modalCloseButtonStyles',
    'pdpTxtNotifymeFormContainer',
    'pdpTxtNotifymeOptInHeading',
    'input',
    'pdpNotifyMeStickyCloseButton',
    'successModalContainer',
    'pdpTxtNotifymeModalTitle',
    'productDetailsContainer',
    'productImageContainer',
    'productImage',
    'productDetails',
    'productName',
    'productColorAndSize',
    'productPrice',
  ],
  baseStyle: ({ theme }) => {
    const { colors, space, fontSizes } = theme
    return {
      pdpTxtNotifymeModalHeader: {
        fontWeight: 'normal',
        mb: space.m,
        textAlign: 'center',
      },
      pdpTxtNotifymeModalHdng2: {
        textAlign: 'center',
        mb: space.xl,
      },
      pdpTxtNotifymeModalEmailLabel: {
        mb: space.s,
      },
      emailErrorMessageStyle: {
        color: colors.error.primary,
        mt: 'xs',
      },
      pdpBtnNotifymeModalSubmit: {
        mt: space.l,
      },
      somethingWentWrongMsg: {
        color: 'red',
        pt: space.l,
      },
      successModalPopUpHeading1: (isDesktop) => ({
        fontWeight: 'normal',
        mb: isDesktop ? space.m : space.l,
        textAlign: 'center',
        fontSize: theme.fontSizes.double,
      }),
      successModalPopUpHeading2: (isDesktop) => ({
        textAlign: 'center',
        mb: space.xl,
        p: !isDesktop && `0 ${space.mar}`,
      }),
      continueShoppingButton: {
        m: '0 auto',
        mt: space.l,
      },
      pdpModalNotifymeSection: (isDesktop) => ({
        p: isDesktop ? `109px 72px` : `120px ${space.m} 32px`,
        my: 0,
        backgroundColor: colors.main.white,
        borderRadius: 2,
        overflow: !isDesktop && 'hidden',
      }),
      modalCloseButtonStyles: {
        fontSize: fontSizes.md,
        '&:focus': {
          boxShadow: 'none',
        },
      },
      successModalContainer: {
        display: 'flex',
        flexDirection: 'column',
      },
    }
  },
  variants: {
    optInOnNotifyMe: ({ theme }) => ({
      pdpNotifyMeStickyCloseButton: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          padding: '7px 6px 5px var(--spacing-3)',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingBottom: 'var(--spacing-4)',
        },
      },
      pdpTxtNotifymeFormContainer: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          padding: '0 var(--spacing-3) var(--spacing-3) var(--spacing-3)',
          '& .chakra-checkbox': {
            alignItems: 'flex-start',
            p: 0,
            '& .chakra-checkbox__control': {
              borderRadius: 'var(--border-radius-s)',
            },
            '& .chakra-checkbox__control[data-checked]': {
              backgroundColor: 'var(--color-standout-primary)',
            },
            '& .chakra-checkbox__label': {
              ...theme.typography['text-body1-s'],
              fontFamily: 'var(--font-face1-normal)',
              color: 'var(--color-neutral-1)',
              a: {
                textDecoration: 'underline',
              },
              strong: {
                fontFamily: 'var(--font-face1-bold)',
                fontWeight: 700,
              },
            },
          },
        },
      },
      pdpTxtNotifymeModalTitle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display4-xxs'],
          textAlign: 'left',
          fontWeight: 700,
        },
      },
      pdpTxtNotifymeModalHeader: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-extended-bold)',
          textAlign: 'left',
          fontWeight: 700,
          marginBottom: 'var(--spacing-4)',
          '#pdp-sticky-container': {
            borderRadius: '18px 18px 0 0',
          },
        },
      },
      input: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-normal)',
          borderRadius: 'var(--spacing-2)',
          padding: '15px var(--spacing-4) 13px var(--spacing-4)',
          border: '1px solid var(--color-inactive)',
          '&.error-state': {
            borderColor: theme.colors.error.primary,
          },
          '::placeholder, :-ms-input-placeholder, ::-ms-input-placeholder': {
            ...theme.typography['text-body1-m'],
            fontFamily: 'var(--font-face1-normal)',
            color: 'var(--color-neutral-medium)',
          },
        },
      },
      emailErrorMessageStyle: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-normal)',
          mt: '6px',
        },
      },
      pdpTxtNotifymeOptInHeading: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-bold)',
          fontWeight: 700,
          borderTop: '1px solid var(--color-neutral-light-2)',
          marginTop: 'var(--spacing-6)',
          paddingTop: 'var(--spacing-6)',
          paddingBottom: 'var(--spacing-3)',
        },
      },
      pdpBtnNotifymeModalSubmit: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-cta2-s'],
          fontFamily: 'var(--font-face1-normal)',
          borderRadius: '130px',
          padding: '10px 22px',
          textTransform: 'lowercase',
          fontSize: 'var(--text-14)',
          '& p::first-letter': {
            textTransform: 'uppercase',
          },
        },
      },
      successModalContainer: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          padding: '0 var(--spacing-3) var(--spacing-3) var(--spacing-3)',
        },
      },
      successModalPopUpHeading1: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display4-xs'],
          fontFamily: 'var(--font-face1-extended-bold)',
          textAlign: 'left',
          fontWeight: 700,
          mb: 'var(--spacing-2)',
        },
      }),
      successModalPopUpHeading2: () => ({
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-normal)',
          textAlign: 'left',
          color: 'var(--color-neutral-medium)',
          m: 0,
          p: 0,
        },
      }),
      productDetailsContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: 'var(--spacing-4)',
      },
      productImageContainer: {
        height: '125px',
        width: '100px',
        aspectRatio: '4/5',
      },
      productImage: {
        height: '125px',
        width: '100px',
        objectFit: 'cover',
        borderRadius: 'var(--border-radius-m)',
        border: '1px solid var(--color-neutral-light-2)',
      },
      productDetails: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-1)',
        padding: 'var(--spacing-4)',
      },
      productName: {
        ...theme.typography['text-body1-m'],
        fontFamily: 'var(--font-face1-normal)',
        color: 'var(--color-black-base)',
      },
      productColorAndSize: {
        ...theme.typography['text-body1-s'],
        fontFamily: 'var(--font-face1-normal)',
        color: 'var(--color-neutral-1)',
      },
      productPrice: {
        ...theme.typography['text-body1-m'],
        color: 'var(--color-black-base)',
        fontWeight: 700,
      },
    }),
  },
}
