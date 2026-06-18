export default {
  parts: [
    'productActionsAreaWrapperSticky',
    'productActionsArea',
    'productActionsContainer',
    'productActionsNotifySwap',
    'variationMessagesWrap',
    'leftColumnStack',
    'atcColumn',
    'swapSoldOutBtn',
    'addToBagBtn',
    'selectSizeBtn',
    'selectSizeHyphen',
    'selectSizeLabel',
    'alternateCtaSlot',
    'membershipExclusiveSlot',
  ],

  baseStyle: ({ theme }) => ({
    productActionsAreaWrapperSticky: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      animation: 'slideUpFadeIn 0.3s ease-out',
      pb: 'calc(env(safe-area-inset-bottom, 0px) + var(--spacing-2))',
      '& .atb-variation-messages': {
        display: 'none',
      },

      '@keyframes slideUpFadeIn': {
        '0%': {
          transform: 'translateY(100%)',
          opacity: 0,
        },
        '100%': {
          transform: 'translateY(0)',
          opacity: 1,
        },
      },
    },

    variationMessagesWrap: {
      width: '100%',
      mb: 'var(--spacing-2)',
      '& .product-info-message-alert': {
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 'var(--border-radius-full)',
        bg: 'var(--color-white-base)',
        mb: 'var(--spacing-1)',
        px: 'var(--spacing-2)',
        py: 'var(--spacing-3)',
        minHeight: '48px',
        alignItems: 'center',
      },
      '& .product-info-message-alert .chakra-text': {
        fontWeight: 500,
        maxWidth: '250px',
      },
      '& .product-info-message-alert > div:first-of-type > :first-child': {
        alignSelf: 'center',
        mt: 0,
      },
    },

    leftColumnStack: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-2)',
      minWidth: 0,
      width: '100%',
    },

    atcColumn: {
      minWidth: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'stretch',
    },

    productActionsNotifySwap: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      gap: 'var(--spacing-2)',
      width: '100%',
      alignItems: 'stretch',

      '& > button': {
        gridColumn: '1',
        minWidth: 0,
      },
      '& > [data-qa="pdp_alternate_cta_slot"]': {
        gridColumn: '2',
        minWidth: 0,
      },

      '&:has(> :only-child)': {
        gridTemplateColumns: 'minmax(0, 1fr)',
      },
      '& > :only-child': {
        gridColumn: '1 / -1',
        width: '100%',
        maxWidth: '100%',
      },
    },

    swapSoldOutBtn: {
      ...theme.typography['text-body2-l'],
      fontWeight: 500,
      bg: 'var(--color-neutral-light-3)',
      color: 'var(--color-neutral-medium)',
      opacity: 1,
      _disabled: {
        opacity: 1,
      },
      '&:hover:disabled, &:active:disabled': {
        bg: 'var(--color-neutral-light-3)',
        color: 'var(--color-neutral-medium)',
      },
      cursor: 'not-allowed',
    },
    productActionsArea: {
      p: '5px 10px 10px',
    },

    productActionsContainer: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      gap: 'var(--spacing-2)',
      width: '100%',
      alignItems: 'stretch',

      '&:has(> :only-child)': {
        gridTemplateColumns: 'minmax(0, 1fr)',
      },
      '& > :only-child': {
        gridColumn: '1 / -1',
        width: '100%',
        maxWidth: '100%',
      },
    },

    selectSizeHyphen: {
      mx: 'var(--spacing-1)',
    },

    selectSizeLabel: {
      color: 'var(--color-neutral-base, #949494)',
      mr: 'var(--spacing-1)',
    },

    selectSizeBtn: {
      ...theme.typography['text-body2-l'],
      fontWeight: 500,
      height: '60px',
      p: 'var(--spacing-4)',
      color: 'var(--color-primary)',
      minWidth: 0,
      width: '100%',
      maxWidth: '100%',
      bg: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-full)',
      justifySelf: 'stretch',
      textTransform: 'none',
      '&:hover:not(:disabled), &:active, &:focus': {
        bg: 'var(--color-white-base)',
        color: 'var(--color-primary)',
        boxShadow: 'none',
      },
    },

    addToBagBtn: {
      ...theme.typography['text-body2-l'],
      fontWeight: 500,
      height: '60px',
      p: 'var(--spacing-4)',
      minWidth: 0,
      width: '100%',
      maxWidth: '100%',
      borderRadius: 'var(--border-radius-full)',
      justifySelf: 'stretch',
      textTransform: 'none',
      transition: 'background-color 200ms ease',
    },

    alternateCtaSlot: {
      minWidth: 0,
      width: '100%',
      maxWidth: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifySelf: 'stretch',
      '& .alter-cta-wrapper': {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
        border: 'none',
        overflow: 'visible',
        flex: '1 1 auto',
        width: '100%',
        height: '60px',
        bg: 'var(--color-white-base)',
        boxShadow: 'none',
        borderRadius: 'var(--border-radius-full)',
      },
      '& .buy-now-button-wrapper': {
        width: '100%',
      },
      '& .buy-now-button': {
        ...theme.typography['text-body2-l'],
        fontWeight: 500,
        height: '60px',
        color: 'var(--color-primary)',
        width: '100%',
        bg: 'var(--color-white-base)',
        borderRadius: 'var(--border-radius-full)',
        flex: '1 1 0',
        textTransform: 'none',
        border: 'none',
        boxShadow: 'none',
        '&:hover:not(:disabled), &:active, &:focus': {
          bg: 'var(--color-white-base)',
          color: 'var(--color-primary)',
          boxShadow: 'none',
        },
      },
      '& .applePayContainer': {
        ...theme.typography['text-body2-l'],
        fontWeight: 500,
        width: '100%',
        height: '100%',
        borderRadius: 'var(--border-radius-full)',
        '& .adyen-checkout__applepay__button': {
          display: 'flex',
          height: 'var(--spacing-10)',
          margin: '10px 0',
          border: 'none',
          width: '100%',
          borderRadius: 'var(--border-radius-full)',
          '-webkit-appearance': '-apple-pay-button',
          '-apple-pay-button-style': 'white',
        },
        '& .merchant-checkout__payment-method': {
          backgroundColor: 'var(--color-white-base)',
          cursor: 'pointer',
          borderRadius: 'var(--border-radius-full)',
        },
        '&.applePayContainer-disabled': {
          '& .merchant-checkout__payment-method': {
            pointerEvents: 'none',
          },
        },
        '&:not(:has(button))': {
          flexGrow: 0,
        },
      },
      '& #notify-me.notify-me': {
        ...theme.typography['text-body2-l'],
        fontWeight: 500,
        gap: 'var(--spacing-1)',
        height: '60px',
        color: 'var(--color-black-base)',
        width: '100%',
        bg: 'var(--color-white-base)',
        borderRadius: 'var(--border-radius-full)',
        textTransform: 'none',
        border: 'none',
        boxShadow: 'none',
        '& .notify-me-button-icon': {
          order: -1,
          flexShrink: 0,
          margin: '0',
          '& path': {
            stroke: 'var(--color-black-base)',
          },
        },
        '&:hover:not(:disabled), &:active, &:focus': {
          bg: 'var(--color-white-base)',
          color: 'var(--color-black-base)',
          boxShadow: 'none',
        },
      },
    },

    membershipExclusiveSlot: {
      width: '100%',
      '& [data-qa="wrapper_mbr_exclsv_btn"]': {
        mb: 0,
        flexGrow: 1,
        width: '100%',
      },
      '& [data-qa="membership_exclusive_cta"]': {
        ...theme.typography['text-body2-l'],
        fontWeight: 500,
        height: '60px',
        minWidth: 0,
        width: '100%',
        maxWidth: '100%',
        bg: 'var(--color-black-base)',
        color: 'var(--color-text-cta-primary)',
        borderRadius: 'var(--border-radius-full)',
        justifySelf: 'stretch',
        textTransform: 'none',
        border: 'none',
        boxShadow: 'none',
        '&:hover:not(:disabled), &:active, &:focus': {
          bg: 'var(--color-black-base)',
          color: 'var(--color-text-cta-primary)',
          boxShadow: 'none',
        },
      },
      '& [data-qa="membership_exclusive_cta"] svg': {
        width: '22px',
      },
    },
  }),
}
