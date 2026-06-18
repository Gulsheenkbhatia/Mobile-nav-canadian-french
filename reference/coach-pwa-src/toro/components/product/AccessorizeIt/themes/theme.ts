import { IPHONE_PRO_MAX_SCREEN_WIDTH } from 'toro/constants/adaptiveExperience'

const BUTTON_STYLES = {
  height: '54px',
  width: '100%',
  padding: 'var(--spacing-4) 0 var(--spacing-4) 0',
  borderRadius: 'var(--border-radius-full)',
  border: 'none',
  '& svg': {
    display: 'none',
  },
}
const BUTTON_TEXT_STYLES = ({ theme }) => ({
  ...theme.typography['text-cta2-s'],
  fontSize: 'var(--text-12)',
  fontWeight: 400,
  textTransform: 'none',
  [`@media (min-width: ${IPHONE_PRO_MAX_SCREEN_WIDTH}px)`]: {
    fontSize: 'var(--text-14)',
  },
})

export default {
  baseStyle: ({ theme }) => ({
    accessorizeItContainerRoot: {
      p: '30px 10px',
      position: 'relative',
      overflow: 'hidden',
    },
    accessorizeItTopLeftImageContainer: {
      position: 'absolute',
      top: '-22px',
      left: '-82px',
      width: '189px',
      height: '259px',
    },
    accessorizeItBottomRightImageContainer: {
      position: 'absolute',
      bottom: '-74px',
      right: '-6px',
      width: '207px',
      height: '259px',
    },
    accessorizeItContainerWrapper: {
      position: 'relative',
      zIndex: 1,
      borderRadius: 'var(--spacing-8)',
      boxShadow:
        '-48px 72px 24px 0px rgba(0, 0, 0, 0.00), -31px 46px 22px 0px rgba(0, 0, 0, 0.00), -17px 26px 19px 0px rgba(0, 0, 0, 0.02), -8px 11px 14px 0px rgba(0, 0, 0, 0.03), -2px 3px 8px 0px rgba(0, 0, 0, 0.03)',
      backdropFilter: 'blur(16px)',
      p: 'var(--spacing-8) 10px 14px 10px',
    },
    accessorizeItTitle: {
      ...theme.typography['text-display3-xs'],
      color: 'var(--color-black-base)',
      fontWeight: 400,
      textAlign: 'center',
    },
    accessorizeItSubtitle: {
      ...theme.typography['text-cta2-xs'],
      color: 'var(--color-neutral-1)',
      fontWeight: 400,
      padding: '0 var(--spacing-3)',
      textAlign: 'center',
    },
    accessorizeItImageContainer: {
      margin: 'var(--spacing-4) auto',
      display: 'flex',
      justifyContent: 'center',
      height: '258px',
    },
    accessorizeItImage: {
      height: '100%',
      objectFit: 'cover',
    },
    accessorizeItPriceLabel: {
      ...theme.typography['text-cta3-m'],
      color: 'var(--color-black-base)',
      textTransform: 'none',
    },
    accessorizeItPrice: {
      ...theme.typography['text-cta2-s'],
      color: 'var(--color-black-base)',
    },
    accessorizeItButtonWrapper: {
      position: 'absolute',
      top: 'var(--spacing-16)',
      right: 'var(--spacing-4)',
      zIndex: 10,
      h: '35px',
      w: '153px',
      '.splide__slide:has([data-cta-type="tangiblee"]) &': {
        display: 'none',
      },
    },
    accessorizeItButton: {
      position: 'relative',
      padding: 'var(--spacing-2) var(--spacing-4)',
      background: 'var(--color-white-base)',
      border: '1.4px solid transparent',
      borderRadius: 'var(--border-radius-full)',
      backgroundClip: 'padding-box',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        margin: '-1.4px',
        borderRadius: 'inherit',
        background:
          'linear-gradient(90deg, #FDDE5C 0%, #F8AB5C 16%, #F56A62 34%, #A176C8 51%, #759BEB 66%, #65BEB3 84%, #70DB96 100%)',
      },
    },
    accessorizeItButtonText: {
      ...theme.typography['text-cta2-s'],
      color: 'var(--color-black-base)',
      fontWeight: 400,
      mr: 'var(--spacing-1)',
      mt: '2px',
      textTransform: 'none',
    },
    accessorizeItContanerTabsWrapper: {
      p: '10px 10px 20px',
      background: 'transparent',
      borderRadius: 'var(--spacing-8) var(--spacing-8) 0 0',
      border: '1px solid var(--color-white-base)',
      mask: 'linear-gradient(to right, transparent 0%, white 0%, white 100%, transparent 100%) top/100% 3px no-repeat, linear-gradient(to bottom, white 0%, white 40%, transparent 60%) left/3px 100% no-repeat, linear-gradient(to bottom, white 0%, white 40%, transparent 60%) right/3px 100% no-repeat, linear-gradient(white, white) 3px 3px/calc(100% - 6px) calc(100% - 6px) no-repeat',
      gap: 'var(--spacing-4)',
      flexDirection: 'column',
    },
    accessorizeItTabs: {
      w: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0px',
      alignSelf: 'stretch',
    },
    accessorizeItTabList: {
      w: '100%',
      p: '6px',
      background: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-full)',
      border: 'none',
    },
    accessorizeItTab: {
      ...theme.typography['text-cta2-xxs'],
      w: '100%',
      p: '15px var(--spacing-3)',
      background: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-full)',
      mb: '0',
      border: 'none',
      '&.active-tab': {
        color: 'var(--color-white-base)',
        background: 'var(--color-black-base)',
      },
    },
    accessorizeItTabPanel: {
      marginTop: 'var(--spacing-4)',
      p: '0',
      '& .scrollableContent': {
        gap: '2px',
      },
    },
    accessorizeItProduct: {
      minWidth: '48px',
      h: '58px',
      borderRadius: '9px',
      overflow: 'hidden',
      border: '2px solid transparent',
      '&.accessorize-it-product-chosen': {
        border: '2px solid var(--color-black-base)',
      },
      '& img': {
        w: '48px',
        h: '58px',
        objectFit: 'cover',
      },
    },
    accessorizeItATBButtonsContainer: {
      gap: '2px',
    },
    accessorizeItATBWrapper: {
      w: '100%',
    },
    accessorizeItATBButton: {
      ...BUTTON_STYLES,
      background: 'var(--color-black-base)',
      '&:hover': {
        backgroundColor: 'var(--color-black-base) !important',
      },
      '&:active': {
        backgroundColor: 'var(--color-black-base) !important',
      },
    },
    accessorizeItATBButtonText: {
      ...BUTTON_TEXT_STYLES({ theme }),
      color: 'var(--color-white-base)',
    },
    accessorizeItATBBundleButton: {
      ...BUTTON_STYLES,
      background: 'var(--color-white-base)',
    },
    accessorizeItATBBundleButtonText: {
      ...BUTTON_TEXT_STYLES({ theme }),
      color: 'var(--color-black-base)',
    },
    accessorizeItPriceContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    // skeleton styles
    rootSkeleton: {
      h: '100%',
      w: '100%',
      p: '30px 20px',
      '& *': {
        visibility: 'visible',
      },
    },
    contentSkeleton: {
      position: 'relative',
      zIndex: 1,
      borderRadius: 'var(--spacing-8)',
      background: 'var(--color-white-base)',
      p: 'var(--spacing-8) 10px var(--spacing-3) 10px',
    },
    topSectionSkeleton: {
      flexDirection: 'column',
      alignItems: 'center',
    },
    titleSkeleton: {
      height: '24px',
      width: '200px',
      borderRadius: '4px',
      mb: 'var(--spacing-2)',
    },
    subtitleSkeleton: {
      height: '12px',
      width: '280px',
      borderRadius: '4px',
      mx: 'var(--spacing-3)',
    },
    imageContainerSkeleton: (isPdpV6) => ({
      margin: 'var(--spacing-4) auto',
      display: 'flex',
      justifyContent: 'center',
      height: isPdpV6 ? '416px' : '258px',
      aspectRatio: '105/129',
    }),
    imageSkeleton: {
      height: '100%',
      width: '100%',
      borderRadius: '8px',
    },
    tabsSectionSkeleton: {
      p: '0 10px 20px',
      borderRadius: 'var(--spacing-8) var(--spacing-8) 0 0',
      gap: 'var(--spacing-4)',
    },
    tabsSectionInnerSkeleton: {
      w: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--spacing-4)',
    },
    tabsListSkeleton: {
      w: '100%',
      p: '6px',
      background: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-full)',
    },
    tabsListItemSkeleton: {
      height: '40px',
      width: '50%',
      borderRadius: 'var(--border-radius-full)',
    },
    productsRowSkeleton: {
      gap: '2px',
      justifyContent: 'flex-start',
      width: '100%',
      overflowX: 'hidden',
    },
    productSkeleton: {
      minWidth: '48px',
      h: '58px',
      borderRadius: '9px',
    },
    addToBagButtonsSkeleton: {
      gap: '2px',
      justifyContent: 'space-between',
      width: '100%',
    },
    addToBagButtonSkeleton: {
      height: '54px',
      width: '50%',
      borderRadius: 'var(--border-radius-full)',
    },
  }),
  variants: {
    bento: ({ theme }) => ({
      accessorizeItButtonWrapper: {
        top: 'unset',
        bottom: 'var(--spacing-3)',
        width: 'auto',
      },
      accessorizeItButton: {
        paddingTop: '13px',
      },
      accessorizeItButtonText: {
        ...theme.typography['text-title1-s'],
        margin: '0',
      },
    }),
  },
}
