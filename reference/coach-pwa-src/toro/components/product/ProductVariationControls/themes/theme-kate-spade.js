export default {
  baseStyle: ({ theme }) => ({
    variationLabelText: {
      ...theme.typography['text-body1-m'],
      color: 'var(--color-black-base)',
      fontWeight: '400',
      mr: 'xs',
    },
    variationLabelValue: {
      ...theme.typography['text-body1-m'],
      color: 'var(--color-neutral-dark)',
    },
    fitReviewText: () => ({}),
    btnWrapper: {
      justifyContent: 'flex-start',
    },
    btnChild: {
      mr: 'var(--spacing-2)',
    },
  }),
  variants: {
    extendedAdaptiveTabbedPDP: ({ theme }) => ({
      variationLabelText: {
        marginRight: '2px',
      },
      colorVariantLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.color-value:not(.mega-pdp) .product-variation-label': {
            [`@media (max-width: ${theme.breakpoints.sm})`]: {
              mb: 'var(--spacing-1)',
            },
          },
        },
      },
      prodVariationLabelWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          paddingRight: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-1)',
          justifyContent: 'space-between',
          width: '100%',
        },
      }),
      colorVariantsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '&.color-variants:not(.color-variants-mega-pdp)': {
            mt: '0 !important',
          },
        },
      },
      tabControlsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 'unset',
          marginBottom: 'var(--spacing-6)',
        },
      },
      pdpImageSwatchBox: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginRight: 'var(--spacing-1)',
          width: 'var(--spacing-16)',
          height: 'var(--spacing-16)',
          borderRadius: 'var(--border-radius-m)',
        },
      },
      pdpImageSwatch: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderRadius: 'var(--border-radius-m)',
        },
      },
      btnWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ':not(.controls-btn-wrapper-grid-large) > .controls-btn-child': {
            '.variation-option': {
              ...theme.typography['text-body1-s'],
              borderColor: 'var(--color-neutral-light-2)',
            },
          },
          '.controls-btn-tabs-child': {
            flex: 'none',
          },
        },
      },
      fitReviewTextStyle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-s'],
        },
      },
      sizeVariantsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 'var(--spacing-3)',
          marginBottom: 'var(--spacing-6)',
          '&.product-size-mega-pdp': {
            marginTop: 'var(--spacing-3)',
            marginBottom: 'var(--spacing-6)',
          },
        },
      },
    }),
  },
}
