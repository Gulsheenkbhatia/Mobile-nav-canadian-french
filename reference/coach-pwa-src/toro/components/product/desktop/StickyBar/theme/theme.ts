import { StickyBarStateClassName } from 'toro/components/product/desktop/StickyBar/stickyBarStates'

const STICKY_BAR_ANIMATION_TRANSITION = '400ms'
// const STICKY_BAR_ANIMATION_SHIFT = '26px'
// const STICKY_BAR_ANIMATION_SHIFT_MARGIN = '50px'
const STICKY_BAR_ADAPTIVE_WIDTH = 'min(100%, 1440px)'

/**
 * Animation Implementation:
 * The animation is separated into two parts:
 * - Horizontal
 * - Vertical
 *
 * Horizontal Animation:
 * - We set a dynamic width for the StickyBar: `min(100%, 1600px)`.
 * - In the "Inactive" state, the width is set to `100%`.
 * - In the "Active" state, the width becomes dynamic, including margins, which are also animated.
 *
 * Vertical Animation:
 * - For `StickyBarTop`, we apply a `translateY` with a negative value (shift value of 26px + margin-bottom).
 * - For `StickyBarBottom`, we apply a similar animation but also increase the height (`100% + shift value of 26px`) to reveal the green part by 26px.
 *
 * Note:
 * The StickyBar operates in three main states:
 * - **Active:** Controlled by the `StickyBarStateClassName.Active` className.
 * - **Scrolled (Inactive):** Controlled by the `StickyBarStateClassName.Inactive` className, based on the scroll value.
 * - **Hovered (when scrolled):** Triggered by the hover state: `&:hover .sticky-bar--bottom/.sticky-bar--top`.
 */

export default {
  parts: [
    'stickyBar',
    'stickyBarTop',
    'stickyBarBottomWrapper',
    'stickyBarAtbArea',
    'stickyBarProductThumbnail',
    'stickyBarProductThumbnailHeader',
  ],
  baseStyle: ({ theme }) => ({
    stickyBarWrapper: {
      position: 'relative',
      marginBottom: '6px',
    },
    stickyBar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      zIndex: 2,
      width: STICKY_BAR_ADAPTIVE_WIDTH,
      [`@media (min-width: 1441px)`]: {
        left: '50%',
        transform: 'translateX(-50%)',
      },
      '&:has(.evergreenBar-container:empty)': {
        [`&:hover .sticky-bar--top,
          & .sticky-bar--top.${StickyBarStateClassName.Active}`]: {
          transform: `translateY(0)`,
          marginRight: 'var(--spacing-6)',
        },
      },
      [`&:hover .sticky-bar--top,
        & .sticky-bar--top.${StickyBarStateClassName.Active}`]: {
        transform: `translateY(-34px)`,
        marginRight: 'var(--spacing-6)',
      },
      [`&:hover .sticky-bar--bottom,
        & .sticky-bar--bottom.${StickyBarStateClassName.Active}`]: {
        height: '34px',
        opacity: 1,
        marginRight: 'var(--spacing-6)',
      },
      [`&:hover .sticky-bar-badge,
        &.${StickyBarStateClassName.Active} .sticky-bar-badge`]: {
        maxHeight: '50px',
        opacity: 1,
        maxWidth: '100%',
      },
    },
    stickyBarTop: {
      position: 'relative',
      zIndex: 2,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: '16px',
      transition: `transform ${STICKY_BAR_ANIMATION_TRANSITION}`,
      background: 'var(--color-text-cta-primary)',
      p: 'var(--spacing-3) var(--spacing-3) var(--spacing-3) 17px',
      borderRadius: '24px 24px 0px 0px',
      '&:has( .promo-rotation-banner-wrapper):has( .size-selector-wrapper)': {
        gap: '9px',
        [`@media (min-width: 1440px)`]: {
          gap: '16px',
        },
        '& .color-swatches-wrapper': {
          maxWidth: '16%',
        },
        '& .size-selector-wrapper': {
          maxWidth: '19%',
        },
        '& .sticky-product-info-wrapper': {
          maxWidth: '20%',
        },
      },
      '&:has( .promo-rotation-banner-wrapper):not(:has( .size-selector-wrapper))': {
        '& .color-swatches-wrapper': {
          maxWidth: '27%',
        },
      },
      [`@media (min-width: 1440px)`]: {
        gap: '27px',
      },
      [`&.${StickyBarStateClassName.Inactive}`]: {
        transform: 'translateY(0)',
      },
      '& .sticky-bar-delimiter': {
        height: 'var(--spacing-4)',
        borderColor: 'var(--color-black-20)',
      },
    },
    stickyBarDivider: {
      w: '1px',
      h: '34px',
      background:
        'linear-gradient(180deg, rgba(225, 225, 225, 0.00) 0%, rgba(225, 225, 225, 0.75) 25%, #E1E1E1 50%, rgba(225, 225, 225, 0.75) 75%, rgba(225, 225, 225, 0.00) 100%)',
    },
    stickyBarBottomWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      zIndex: 1,
      width: '100%',
      overflow: 'hidden',
      height: '100%',
      transition: `transform ${STICKY_BAR_ANIMATION_TRANSITION}, height ${STICKY_BAR_ANIMATION_TRANSITION}, opacity ${STICKY_BAR_ANIMATION_TRANSITION}, margin ${STICKY_BAR_ANIMATION_TRANSITION}, width ${STICKY_BAR_ANIMATION_TRANSITION}`,
      [`&.${StickyBarStateClassName.Inactive}`]: {
        opacity: 0,
      },
    },
    stickyBarBottom: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-border-cta-primary)',
      height: '100%',
      width: '100%',
      ':has(.evergreenBar-container:empty)': {
        display: 'none',
      },
    },
    '.sticky-bar-delimiter': {
      opacity: '1',
    },
    stickyBarBottomContentWrapper: {
      padding: 'var(--spacing-1)',
      alignItems: 'center',
    },
    stickyBarProductThumbnail: {
      height: '100%',
      flexGrow: 1,
      maxWidth: '25%',
      minWidth: '14%',
      alignItems: 'center',
      gap: 'var(--spacing-4)',
    },
    stickyBarProductThumbnailImage: {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      flexShrink: 0,
      [`@media (min-width: 1440px)`]: {
        width: '60px',
        height: '60px',
      },
    },
    stickyBarProductTitleBadge: {
      lineHeight: 'var(--line-height-100)',
      display: 'flex',
      alignItems: 'stretch',
      '& > div': {
        display: 'flex',
        alignItems: 'stretch',
      },
    },
    stickyBarProductThumbnailRatingBadge: {
      mb: '6px',
      '&:has(.sticky-bar-badge:empty)': {
        '& .star-rating-review': {
          border: 'none',
        },
      },
    },
    stickyBarProductThumbnailHeader: {
      ...theme.typography['text-cta3-s'],
      marginTop: 'var(--spacing-1)',
      pb: '1px',
      maxWidth: '100%',
      fontWeight: '700',
      color: 'var(--color-black-base)',
      display: '-webkit-box',
      '-webkit-line-clamp': '2',
      '-webkit-box-orient': 'vertical',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      transition: 'margin 400ms',
    },
    inventoryBadge: {
      display: 'inline',
      color: 'var(--color-success-primary, #057550)',
    },
    inventoryBadgeWrapper: {
      display: 'inline',
      ...theme.typography['text-cta2-xxs'],
    },
  }),
  variants: {
    coachtopia: {
      stickyBarProductThumbnailHeader: {
        fontFamily: 'var(--font-face1-bold)',
        letterSpacing: 'var(--letter-spacing-l)',
      },
    },
  },
}
