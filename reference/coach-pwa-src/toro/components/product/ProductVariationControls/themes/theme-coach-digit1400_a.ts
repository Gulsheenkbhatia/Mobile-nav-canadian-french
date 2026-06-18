export default {
  parts: ['prodVariationLabelWrapper', 'sizeVariantsWrapper', 'variationLabelValue'],
  baseStyle: ({ theme }) => ({
    sizeVariantsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '14px 0 4px',
        lineHeight: 1,
      },
    },
    tabControlsWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: '15px',
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
        lineHeight: 1,
      },
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
          mt: '20px',
        },
      },
    },
    prodVariationLabelWrapper: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '0 0 6px',
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
          margin: '0 0 6px',
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
          mt: 'var(--spacing-2)',
        },
      }),
      sizeVariantsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '10px',
          mb: 'var(--spacing-2)',
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
    tabbedPDP: ({ theme }) => ({
      sizeVariantsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: 'var(--spacing-2) 0 5px',
          lineHeight: 1,
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      variationLabelValue: {
        ...theme.typography['text-body1-m'],
      },
    }),
  },
}
