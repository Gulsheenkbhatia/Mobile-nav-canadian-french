const plpV3BackgroundColor = 'var(--color-neutral-light-1, #f0f0f0)'
export const viewSimilarButtonStyles = ({ theme }) => ({
  viewSimilarButton: {
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      width: 'auto',
      borderRadius: '130px',
      '&:hover:not(:disabled)': {
        backgroundColor: 'var(--color-black-base)',
        borderColor: 'transparent',
      },
      '& > svg': {
        width: '16px',
        height: '16px',
      },
    },
  },
  viewSimilarButtonText: {
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      ...theme.typography['text-body1-m'],
      fontSize: 'var(--text-14) !important',
      color: 'var(--color-black-base)',
      lineHeight: 'var(--line-height-135)',
      top: '0 !important',
    },
  },
})

export default {
  baseStyle: ({ theme }) => ({
    tileUpperBadgeWrapper: {
      justifyContent: 'center',
    },
    tileProductNameText: {
      ...theme.typography['text-body2-m'],
      textAlign: 'center',
      whiteSpace: 'normal',
      lineClamp: 0,
      WebkitLineClamp: 0,
      lineHeight: 'var(--line-height-150)',
    },
    tileMaterial: {
      ...theme.typography['text-body2-s'],
      textAlign: 'center',
    },
    tileSwatchWrapper: {
      display: 'flex',
      justifyContent: 'center',
      '.swatch-slider-chevron-right': {
        right: '0px',
      },
    },
    productThumbnail: {
      bg: 'var(--color-white-base)',
      overflow: 'visible',
    },
    tileImageBadgeWrapper: {
      left: 'var(--spacing-4)',
    },
    onPurposeBadgeWrapper: { zIndex: 5, left: 2, top: 12, position: 'absolute' },
    onPurposeImage: { height: 12, width: 'auto' },
    productColorSwatches: {
      swatchSlider: {
        justifyContent: 'center',
      },
    },
    addToBagWrapper: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        padding: '0 var(--spacing-4)',
      },
    },
    sizeDrawerLabel: {
      textTransform: 'uppercase',
      fontSize: 'var(--text-12)',
    },
    sizeDrawerBtn: {
      borderRadius: 'var(--border-radius-m)',
      overflow: 'hidden',
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      tileWrapper: {
        background: plpV3BackgroundColor,
      },
      ratingWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          justifyContent: 'center',
          alignItems: 'center',
        },
      },
      tilePromoCalloutWrapper: {
        '&:has(.promoCalloutWrapper)': {
          minHeight: 'var(--staircase-promoCallout-height)',
        },
      },
      ratingIconWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          paddingRight: '5px',
          svg: {
            width: 'var(--spacing-3)',
            height: 'var(--spacing-3)',
          },
        },
      },
      ...viewSimilarButtonStyles({ theme }),
      productThumbnail: {
        mb: 'var(--spacing-4)',
      },
      ratingStarCount: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontWeight: '400',
          marginLeft: 'var(--spacing-1)',
        },
      },
      ratingReviewCount: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-link1-s'],
          fontWeight: '400',
          textDecoration: 'underline',
        },
      },
      tileDescriptionWrapper: {
        background: plpV3BackgroundColor,
      },
      tileProductNameText: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          color: 'var(--color-black-base)',
          lineHeight: 'var(--line-height-150)',
        },
        lineHeight: 'var(--line-height-135)',
      },
      tileSwatchWrapper: {
        '&::before': {
          left: 0,
          background: `linear-gradient(-90deg, rgba(240, 240, 240, 0.00) 0%, ${plpV3BackgroundColor} 100%)`,
        },
        '&::after': {
          right: 0,
          background: `linear-gradient(90deg, rgba(240, 240, 240, 0.00) 0%, ${plpV3BackgroundColor} 100%)`,
        },
      },
      productColorSwatches: {
        wrapper: {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            padding: 'var(--spacing-3) var(--spacing-2)',
          },
        },
      },
      tileRatingsLink: {
        marginTop: '0',
      },
      tileImageBadgeWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          top: 'var(--spacing-8)',
        },
      },
    }),
    onModelPlp2Up: () => ({
      tileWrapper: {
        backgroundColor: 'var(--color-product-image-bg)',
      },
      tileInfoWrapper: {
        '& > *': {
          backgroundColor: 'var(--color-product-image-bg) !important',
        },
      },
    }),
  },
}
