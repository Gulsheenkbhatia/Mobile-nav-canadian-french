export default {
  parts: ['prodVariationLabelWrapper', 'sizeVariantsWrapper'],
  baseStyle: ({ theme }) => ({
    sizeVariantsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '20.5px 0 5px',
        lineHeight: 1,
        '&.product-size-mega-pdp': {
          margin: '13px 0',
          '&:last-of-type': {
            margin: '13px 0 var(--spacing-4)',
          },
        },
      },
    },
    tabControlsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '12.5px 0',
        '&:last-of-type': {
          marginBottom: 'var(--spacing-4)',
        },
      },
    },
    controlWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: 'var(--spacing-2)',
      },
    },
    btnWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        flexWrap: 'wrap',
        columnGap: 'var(--spacing-2)',
        '.controls-btn-tabs-child': {
          minWidth: '111.6px',
          marginRight: '0',
          marginBottom: 'var(--spacing-2)',
        },
        '.controls-btn-child': {
          minWidth: `calc((100% / 5) - var(--spacing-2) + 1.6px)`,
          marginRight: '0',
          marginBottom: 'var(--spacing-2)',
        },
        ':not(.controls-btn-wrapper-grid-large)': {
          '.allow-disabled:after': {
            background: `linear-gradient(to bottom right, transparent calc(50% - 1px), #e6e6e6, transparent calc(50% + 1px)) !important`,
          },
        },
        ':not(.controls-btn-wrapper-grid-large) > .controls-btn-child': {
          '.variation-option': {
            paddingTop: '17.5px',
            paddingBottom: '17px',
            height: '47px',
            borderRadius: 'var(--border-radius-s)',
            border: '1px solid #e6e6e6', // doesn't exist in design tokens
            fontSize: 'var(--text-14)',
            lineHeight: 'var(--line-height-140)',
            '&.selected': {
              borderColor: 'var(--color-black-base) !important',
            },
            '&.selected.allow-disabled': {
              backgroundColor: 'var(--color-background-cta-disabled)',
              borderColor: 'var(--color-neutral-base) !important',
            },
          },
        },
      },
    },
    btnChild: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
      },
    },
    variationLabelText: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontWeight: 400,
        textTransform: 'capitalize',
        fontSize: 'var(--text-12)',
        color: 'var(--color-black-base)',
        lineHeight: 'var(--line-height-140)',
      },
    },
    variationLabelValue: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-12)',
        fontWeight: 400,
        textTransform: 'capitalize',
        color: 'var(--color-black-base)',
        lineHeight: 'var(--line-height-140)',
      },
    },
    colorVariantsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
        overflowX: 'unset',
        '&.color-variants-mega-pdp': {
          m: '12.5px 0 var(--spacing-4)',
          '&:last-of-type': {
            m: '12.5px 0 19.5px',
          },
        },
      },
      '&.color-variants:not(.color-variants-mega-pdp)': {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '20px',
        },
      },
    },
    prodVariationLabelWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '4.5px 0 var(--spacing-1)',
        lineHeight: 1,
      },
    }),
    productImagesContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        minHeight: 'auto',
      },
    },
    pdpImageSwatchBox: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        width: '15vw',
        height: '60px',
        borderRadius: 'var(--border-radius-s)',
        marginBottom: 'var(--spacing-1)',
        marginRight: '6px',
      },
    },
    pdpImageSwatch: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        height: '60px',
        objectFit: 'fill',
        borderRadius: 'var(--border-radius-s)',
      },
    },
    sizeControlsHeader: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    },
    fitReviewTextStyle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-12)',
        lineHeight: 1,
      },
    },
    colorVariantLabel: {
      '&.color-value:not(.mega-pdp) .product-variation-label': {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mb: 0,
          mt: '7px',
        },
      },
    },
    fitReviewText: () => ({
      lineHeight: 1,
    }),
  }),
  variants: {
    extendedAdaptiveTabbedPDP: ({ theme }) => ({
      btnWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ':not(.controls-btn-wrapper-grid-large) > .controls-btn-child': {
            '.variation-option': {
              mr: 'var(--spacing-1)',
              borderRadius: 'var(--border-radius-full)',
            },
          },
        },
      },
    }),
    sizeVariation: ({ theme }) => ({
      btnWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          display: 'flex',
          flexWrap: 'nowrap',
        },
      },
    }),
    size: ({ theme }) => ({
      prodVariationLabelWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '0 0 var(--spacing-1)',
          lineHeight: 1,
          justifyContent: 'space-between',
          width: '100%',
          alignItems: 'center',
        },
      }),
    }),
    bundle: ({ theme }) => ({
      prodVariationLabelWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '5.5px',
          mb: 'var(--spacing-1)',
        },
      }),
      sizeVariantsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '10px',
          mb: '10px',
        },
      },
      btnWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mb: '2px',
        },
      },
      sizeVariation: ({ theme }) => ({
        btnWrapper: {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            flexWrap: 'nowrap',
          },
        },
      }),
    }),
  },
}
