import { IPHONE_PRO_SCREEN_WIDTH } from 'toro/constants/adaptiveExperience'

export default {
  baseStyle: () => {
    const buttonStyle = { whiteSpace: 'normal' }

    return {
      accessorizeItButton: buttonStyle,
      accessorizeItATBButton: buttonStyle,
      accessorizeItATBBundleButton: buttonStyle,
      // scroll-margin-top ensures heading is visible when scrolling to this section (iPhone Pro Max / Plus)
      accessorizeItContainerRoot: {
        [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px) and (max-width: 450px)`]: {
          scrollMarginTop: 'var(--spacing-16)',
        },
      },
      // scroll target only (no padding/overflow) – used on skeleton so layout is unchanged
      accessorizeItScrollTarget: {
        [`@media (min-width: ${IPHONE_PRO_SCREEN_WIDTH}px) and (max-width: 450px)`]: {
          scrollMarginTop: 'var(--spacing-16)',
        },
      },
    }
  },
}
