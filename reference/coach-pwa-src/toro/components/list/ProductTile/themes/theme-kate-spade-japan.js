export default {
  baseStyle: ({ theme }) => ({
    productThumbnail: {
      '& button.quick-view-container': {
        backgroundColor: 'var(--color-scrim-dark)',
        color: 'var(--color-white-base)',
        ...theme.typography['text-cta1-s'],
        fontWeight: '700',
        '&:hover': {
          backgroundColor: 'var(--color-success-primary)',
        },
      },
    },
    tileSwatchWrapper: {
      '.swatch-slider-chevron-right': {
        right: '0px',
      },
    },
    tileProductNameText: {
      ...theme.typography['text-body2-m'],
    },
    productColorSwatches: {
      swatchSlider: {
        justifyContent: 'center',
      },
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      tileWrapper: {
        background: 'var(--color-product-image-bg)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-product-image-bg)',
        },
      },
      tileSwatchWrapper: {
        '&::before': {
          left: 0,
          background: `linear-gradient(-90deg, rgba(240, 240, 240, 0.00) 0%, var(--color-product-image-bg) 100%)`,

          [`@media (max-width: ${theme.breakpoints.md})`]: {
            background: `linear-gradient(-90deg, rgba(240, 240, 240, 0.00) 0%, var(--color-product-image-bg) 100%)`,
          },
        },
        '&::after': {
          right: 0,
          background: `linear-gradient(-90deg, rgba(240, 240, 240, 0.00) 0%, var(--color-product-image-bg) 100%)`,

          [`@media (max-width: ${theme.breakpoints.md})`]: {
            background: `linear-gradient(-90deg, rgba(240, 240, 240, 0.00) 0%, var(--color-product-image-bg) 100%)`,
          },
        },
      },
      tileProductNameText: {
        lineClamp: 2,
        WebkitLineClamp: 2,
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          display: '-webkit-box',
          lineClamp: 2,
          WebkitLineClamp: 2,
          whiteSpace: 'normal',
        },
      },
      productThumbnail: {
        bg: 'var(--color-product-image-bg)',
        mb: 'var(--spacing-3)',
      },
    }),
  },
}
