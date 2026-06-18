export default {
  parts: ['prodVariationLabelWrapper', 'sizeVariantsWrapper'],
  baseStyle: ({ theme }) => ({
    sizeVariantsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: 'var(--spacing-2) 0 5px',
        fontSize: 'var(--text-12)',
        lineHeight: 1,
      },
    },
    btnWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        flexWrap: 'wrap',
        columnGap: 'var(--spacing-2)',
        '&.controls-btn-wrapper-grid-large .controls-btn-child, .controls-btn-tabs-child': {
          minWidth: '111.6px',
          flex: 'none',
          marginRight: '0',
          marginBottom: 'var(--spacing-2)',
        },
        '.controls-btn-child': {
          minWidth: '63.8px',
          width: `calc((100% / 5) - var(--spacing-2) + 1.6px)`,
          marginRight: '0',
          marginBottom: 'var(--spacing-2)',
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
        mr: '2px',
        lineHeight: 1,
      },
      textTransform: 'capitalize',
    },
    variationLabelValue: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        fontSize: 'var(--text-12)',
        fontWeight: 400,
        textTransform: 'capitalize',
        color: 'var(--color-black-base)',
        lineHeight: 1,
      },
    },
    colorVariantsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
        overflowX: 'unset',
      },
      '&.color-variants:not(.color-variants-mega-pdp)': {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '22px',
        },
      },
    },
    prodVariationLabelWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '14px 0 4px',
      },
    }),
    productImagesContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        minHeight: 'auto',
        width: 'calc(100vw - var(--spacing-3))',
      },
    },
    productImagesInnerContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& > div:last-child': {
          minWidth: 'calc(60px + var(--spacing-3))',
        },
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
          mt: '7px',
        },
      },
      '&.color-value.mega-pdp .product-variation-label': {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          m: 'var(--spacing-2) 0px 15px',
        },
      },
    },
  }),
  variants: {
    size: ({ theme }) => ({
      prodVariationLabelWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          width: '100%',
          justifyContent: 'space-between',
          margin: 'var(--spacing-2) 0 6px',
        },
      }),
    }),
    bundle: ({ theme }) => ({
      prodVariationLabelWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: 'var(--spacing-2) 0 var(--spacing-3)',
        },
      }),
      sizeVariantsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '10px 0 0',
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
    tabbedPDP: ({ theme }) => ({
      sizeVariantsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: 0,
        },
      },
    }),
  },
}
