const toolTipMiniCartStyles = ['bagIconContainerTooltip', 'bagIconContainer']

const miniCartPopover = [
  'miniCartOverlay',
  'miniCartMainContainer',
  'miniCartContainer',
  'miniCartPriceDivider',
  'miniCartCloseButton',
  'miniCartSecondaryText',
  'mainDivider',
  'miniCartProductsContainer',
  'miniCartProductDetailContainer',
  'cartSecondaryDivider',
  'cartButtonsMainWrapper',
  'cartButtonsWrapper',
  'cartCheckoutButton',
  'viewShoppingBagButton',
  'viewBagButtonVariant',
  'checkoutButtonVariant',
  'cartContentContainer',
]

const miniCartPopoverItem = [
  'storePickupContainer',
  'miniCartProductContainer',
  'miniCartProductName',
  'miniCartProductOtherDetail',
  'customizerProductPriceContainer',
  'customizerProductPriceDiscout',
  'customizerProductPrice',
  'mainPriceContainer',
  'discountPrice',
  'mainPrice',
  'regularPrice',
  'miniCartProductInfoMessage',
]

export default {
  parts: [...toolTipMiniCartStyles, ...miniCartPopover, ...miniCartPopoverItem],

  baseStyle: ({ theme }) => {
    const { colors } = theme
    const { main } = colors
    return {
      promotionMsg: {
        '.promo-check-svg': {
          width: '16px',
          height: '16px',
          display: 'inline-block',
          marginRight: theme.space.xs,
          position: 'relative',
          bottom: '1px',
          verticalAlign: 'middle',
        },
        '.promo-check-svg > path': {
          fill: theme.colors.success.primary,
        },
      },
      bagIconContainerTooltip: {
        fontSize: theme.fontSizes.xs,
      },
      miniCartOverlay: {
        bg: 'rgba(0,0,0,0.7)',
        overflow: 'hidden',
        display: 'block',
      },
      miniCartOverlayClosed: {
        bg: 'rgba(0,0,0,0.7)',
        overflow: 'hidden',
        display: 'none',
      },
      miniCartMainContainer: {
        p: 'l',
        bg: main.white,
      },
      miniCartContainer: {
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderBottom: `10px solid ${main.white}`,
      },
      miniCartPriceDivider: {
        borderColor: main.gray,
        mx: 'mar',
      },
      miniCartCloseButton: {
        '& svg': {
          transform: 'scale(1.8)',
        },
        ml: 'auto',
      },

      mainDivider: {
        borderColor: main.inactive,
        mt: 'm',
        mb: 'mar',
        ml: 'auto',
      },
      miniCartSecondaryText: {
        color: main.gray,
      },
      miniCartProductsContainer: {
        pr: 'mar',
        mr: '-m',
        mt: 'l',
        '@media (max-width: 768px)': {
          pr: 'l',
          mr: '-l',
          mt: 's',
        },
      },
      miniCartProductDetailContainer: {
        my: 'm',
        flexWrap: 'wrap',
      },
      cartSecondaryDivider: {
        borderColor: main.gray,
      },
      cartButtonsMainWrapper: {
        bg: main.white,
        boxShadow: theme.boxShadow.miniCartPopover,
      },
      cartButtonsWrapper: {
        mb: 'mar',
      },
      cartCheckoutButton: {
        '&:focus': { boxShadow: theme.focus.boxShadow, outline: theme.focus.outline },
      },
      checkoutButtonVariant: {
        variant: 'primary',
      },
      viewBagButtonVariant: {
        variant: 'secondary',
      },
      viewShoppingBagButton: {
        '&:focus': { boxShadow: theme.focus.boxShadow, outline: theme.focus.outline },
        '&:hover': {
          backgroundColor: main.primary,
          color: main.white,
        },
      },
      storePickupContainer: {
        border: `solid 1px ${main.inactive}`,
        padding: theme.space.s,
      },
      miniCartProductContainer: {
        ml: 'm',
      },
      miniCartProductName: {
        mb: 's',
        color: colors.black,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
      miniCartProductOtherDetail: {
        mb: 'mar',
      },
      mainPriceContainer: {
        mb: 'mar',
      },
      discountPrice: (priceColor) => ({
        color: priceColor,
      }),
      mainPrice: {
        ml: 's',
        color: colors.cart.old,
        textDecoration: 'line-through',
      },
      miniCartProductInfoMessage: {
        pl: '16px',
        pr: '16px',
        color: main.gray,
        marginTop: '16px',
      },
      disclaimer: {
        fontFamily: theme.fontFamily.primaryNormal,
        fontSize: theme.fontSizes.sm,
        paddingBottom: theme.space.s,
        paddingTop: theme.space.s,
        textAlign: 'center',
        '& svg': {
          width: 'auto',
          height: 'auto',
          marginRight: theme.space.s,
          verticalAlign: 'middle',
        },
      },
      myBagHeader: {
        fontFamily: theme.fontFamily.primaryBold,
      },
      customModalContent: {
        maxWidth: 'none',
        minHeight: '268px',
        maxHeight: '74vh',
        padding: '24px',
        w: '600px',
        m: '0',
        borderRadius: 'none',
        overflow: 'auto',
      },
      customModalFormWrapper: { maxWidth: '411px', margin: '30px auto', position: 'relative' },
      customFormText: {
        fontFamily: 'New Baskerville ITC Pro',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: '24px',
        lineHeight: '120%',
        textAlign: 'center',
        letterSpacing: '0.2px',
        color: '#000000',
      },
      myBagInfo: () => ({}),
      miniCartBadge: {
        position: 'absolute',
        borderRadius: '20px',
        width: '18px',
        height: '18px',
        top: '-6px',
        right: '-6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-white-base)',
        border: '0.5px solid var(--color-white-base)',
        lineHeight: '1',
      },
    }
  },
  variants: {
    globalHeaderV2: () => ({
      cartContentContainer: {
        p: {
          fontSize: 'var(--text-8)',
        },
      },
    }),
    oneSiteMiniCart: () => ({
      discountPrice: () => ({
        color: 'var(--color-primary)', // OneSite: final price in black
      }),
      mainPrice: {
        color: 'var(--color-neutral-medium)',
      },
    }),
  },
}
