const BUTTON_TEXT_STYLES = (theme) => ({
  ...theme.typography['text-body2-l'],
  fontWeight: 500,
  lineHeight: 'var(--line-height-100)',
  textTransform: 'none',
})

const BUTTON_STYLES = (theme) => ({
  ...BUTTON_TEXT_STYLES(theme),
  p: '20px var(--spacing-10)',
  borderRadius: 'var(--border-radius-m)',
  height: 'auto',
})

const TAB_AND_PRICE_FONT_STYLES = (theme) => ({
  ...theme.typography['text-title1-m'],
  fontWeight: 400,
  textTransform: 'none',
})

export default {
  baseStyle: ({ theme }) => ({
    accessorizeItContainerRoot: {
      p: '92px 60px 94px',
      mb: 'var(--spacing-8)',
    },
    accessorizeItImageContainer: {
      p: '69.5px 75px',
      m: 'var(--spacing-0)',
      width: 'calc(50vw - 72px)',
      backgroundColor: 'var(--color-neutral-light-1)',
      borderRadius: '32px',
      height: 'auto',
    },
    accessorizeItImage: {
      aspectRatio: '4/5',
      maxHeight: '406px',
    },
    accessorizeItContainerWrapper: {
      width: 'calc(50vw - 72px)',
      p: '20px 0',
      boxShadow: 'none',
      borderRadius: 'var(--border-radius-none)',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    accessorizeItTitle: {
      ...theme.typography['text-display1-xs'],
      color: 'var(--color-black-base)',
      fontSize: '64px',
      fontWeight: 400,
      lineHeight: 'var(--line-height-115)',
      mb: 'var(--spacing-2)',
    },
    accessorizeItSubtitle: {
      ...theme.typography['text-title1-m'],
      p: 'var(--spacing-0)',
      textTransform: 'none',
      color: 'var(--color-black-base)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-120)',
      letterSpacing: 'var(--letter-spacing-m, 0.025rem)',
    },
    accessorizeItContanerTabsWrapper: {
      p: '20px var(--spacing-0) var(--spacing-0)',
      border: '0 none',
      mask: 'none',
      gap: 'var(--spacing-0)',
    },
    accessorizeItTabs: {
      gap: '50px',
      mb: '50px',
    },
    accessorizeItTabList: {
      w: 'auto',
      p: '3px',
      backgroundColor: 'var(--color-neutral-light-2)',
      borderRadius: '10px',
    },
    accessorizeItTab: {
      p: '18px 22px',
      w: '156px',
      backgroundColor: 'transparent',
      color: 'var(--color-black-base)',
      borderRadius: 'var(--border-radius-m)',
      boxSizing: 'content-box',
      ...TAB_AND_PRICE_FONT_STYLES(theme),
      '&.active-tab': {
        color: 'var(--color-black-base)',
        background: 'var(--color-white-base)',
        boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
      },
    },
    accessorizeItTabPanel: {
      marginTop: 'var(--spacing-0)',
    },
    accessorizeItPriceContainer: {
      width: '400px',
      m: '0 auto var(--spacing-3)',
    },
    accessorizeItPriceLabel: {
      color: 'var(--color-black-base)',
      ...TAB_AND_PRICE_FONT_STYLES(theme),
    },
    accessorizeItPrice: {
      color: 'var(--color-black-base)',
      ...TAB_AND_PRICE_FONT_STYLES(theme),
    },
    accessorizeItATBButtonsContainer: {
      width: '400px',
      m: '0 auto',
      gap: '6px',
    },
    accessorizeItATBButton: {
      ...BUTTON_STYLES(theme),
      width: '207px',
    },
    accessorizeItATBButtonText: {
      ...BUTTON_TEXT_STYLES(theme),
    },
    accessorizeItATBBundleButton: {
      ...BUTTON_STYLES(theme),
      width: '187px',
    },
    accessorizeItATBBundleButtonText: {
      ...BUTTON_TEXT_STYLES(theme),
    },
    scrollableContainer: {
      justifyContent: 'center',
    },
    scrollableContentWrapper: {
      maxWidth: '629.2px', // 629.2px = 118px (product width) * 5 + 9.8px * 4 (gap)
      gap: '9.8px !important',
      '@media (max-width: 1854px)': {
        maxWidth: '502.4px', // 502.4px = 118px (product width) * 4 + 9.8px * 3 (gap)
      },
      '@media (max-width: 1600px)': {
        maxWidth: '373.6px', // 373.6px = 118px (product width) * 3 + 9.8px * 2 (gap)
      },
      '@media (max-width: 1343px)': {
        maxWidth: '245.8px', // 245.8px = 118px (product width) * 2 + 9.8px * 1 (gap)
      },
      '@media (max-width: 1087px)': {
        maxWidth: '118px', // 118px = 118px (product width) * 1
      },
    },
    accessorizeItProduct: {
      minWidth: '118px',
      h: '140px',
      '& img': {
        w: '118px',
        h: '140px',
        objectFit: 'cover',
      },
    },
    scrollableContentArrow: {
      w: '74px',
      h: '74px',
      borderRadius: 'var(--border-radius-full)',
      border: '1px solid var(--color-neutral-light-2)',
      backgroundColor: 'var(--color-white-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      flexShrink: 0,
      '&.left-arrow': {
        m: '0 6.98px 0 var(--spacing-8)',
      },
      '&.right-arrow': {
        m: '0 var(--spacing-8) 0 6.98px',
      },
    },
    accessorizeItButtonWrapper: {
      top: '42px',
      right: '42px',
      width: 'auto',
      height: 'auto',
    },
    accessorizeItButton: {
      h: '40px',
      w: 'auto',
      p: 'var(--spacing-3) 18px var(--spacing-3) 22px',
      gap: '6px',
    },
    accessorizeItButtonText: {
      ...theme.typography['text-body2-s'],
      fontWeight: '500',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-100)',
      m: 'var(--spacing-0)',
      textTransform: 'lowercase',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
    // skeleton styles
    rootSkeleton: {
      h: 'auto',
      w: 'auto',
      p: '92px 60px 94px',
      position: 'relative',
      overflow: 'hidden',
    },
    imageContainerSkeleton: () => ({
      margin: 'auto',
      display: 'block',
      p: '69.5px 75px',
      m: 'var(--spacing-0)',
      width: 'calc(50vw - 72px)',
      backgroundColor: 'var(--color-white-base)',
      borderRadius: '32px',
      height: 'auto',
      aspectRatio: 'auto',
    }),
    imageSkeleton: {
      borderRadius: '32px',
      aspectRatio: '789/406',
    },
    containerWrapperSkeleton: {
      width: 'calc(50vw - 72px)',
      p: '20px 32px',
      boxShadow: 'none',
      borderRadius: 'var(--border-radius-none)',
    },
    titleSkeleton: {
      height: '74px',
      width: 'auto',
      maxWidth: '300px',
      mx: 'auto',
    },
    subtitleSkeleton: {
      height: '19px',
      width: 'auto',
      maxWidth: '400px',
      mx: 'auto',
    },
    tabsSectionSkeleton: {
      p: '20px var(--spacing-0) var(--spacing-0)',
      borderRadius: '0',
      gap: '0',
    },
    tabsSectionInnerSkeleton: {
      gap: '50px',
    },
    tabsListSkeleton: {
      maxWidth: '400px',
      p: '3px',
      borderRadius: '10px',
    },
    tabsListItemSkeleton: {
      height: '56px',
      borderRadius: 'var(--border-radius-m)',
      mx: 'auto',
    },
    productsRowSkeleton: {
      maxWidth: '500px',
      height: '142.25',
      borderRadius: '9px',
      mx: 'auto',
      gap: 0,
      overflowX: 'visible',
    },
    addToBagButtonsSkeleton: {
      gap: '6px',
      maxWidth: '400px',
      m: '0 auto',
    },
    addToBagButtonSkeleton: {
      height: '56px',
      borderRadius: 'var(--border-radius-m)',
      mx: 'auto',
    },
  }),
}
