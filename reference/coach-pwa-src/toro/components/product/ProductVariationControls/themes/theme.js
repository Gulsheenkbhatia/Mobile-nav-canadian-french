export default {
  parts: [
    'QVProductImageSwatchBox',
    'qvImageSwatchSelected',
    'QVProductImageSwatch',
    'pdpImageSwatchBox',
    'pdpImageSwatchSelected',
    'pdpImageSwatch',
    'swatchMonogramWrapper',
    'swatchMonogramContainer',
    'prodVariationLabelWrapper',
    'variationLabelText',
    'variationLabelNormalNoTransformText',
    'variationLabelValue',
    'showMoreShowLessWrapper',
    'showMoreShowLessText',
    'productSwatchToolTip',
    'colorVariantsWrapper',
    'sizeVariantsWrapper',
    'closeIconContainer',
    'btnText',
    'btnWrapper',
    'btnChild',
    'tabControlsWrapper',
    'fitReviewTextStyle',
    'colorVariantLabel',
    'productImagesInnerContainer',
    'selectBorders',
  ],
  baseStyle: ({ theme }) => ({
    productSwatchToolTip: {
      fontSize: 'xs',
    },
    QVProductImageSwatchBox: {
      cursor: 'pointer',
      margin: `0 ${theme.space.s1} ${theme.space.sm1}`,
      borderRadius: theme.borderRadius.rounded,
      border: `${theme.borderWidth.default} solid`,
      borderColor: 'var(--color-white-base)',
      padding: 0,
      height: '32px',
    },
    qvImageSwatchSelected: {
      border: `${theme.borderWidth.default} solid`,
      borderColor: theme.colors.black,
      padding: '3px',
    },
    QVProductImageSwatch: {
      borderRadius: '50%',
      cursor: 'pointer',
    },
    pdpImageSwatchBox: {
      cursor: 'pointer',
      marginRight: theme.space.s1,
      backgroundColor: '#f0f0f0',
      borderRadius: theme.borderRadius.default,
      border: `${theme.borderWidth.default} solid`,
      borderColor: theme.colors.main.white,
    },
    pdpImageSwatchSelected: {
      borderStyle: 'solid',
      borderWidth: theme.borderWidth.default,
      borderColor: theme.colors.black,
    },
    pdpImageSwatch: {
      borderRadius: theme.borderRadius.default,
      maxHeight: '95px',
    },
    swatchMonogramWrapper: {
      fontSize: '12px',
      top: '0px',
      left: '3px',
      fontWeight: 'bold',
      marginTop: '1px',
    },
    swatchMonogramContainer: (monogramFontName) => ({
      fontFamily: monogramFontName,
    }),
    prodVariationLabelWrapper: () => ({
      mb: 's',
      mt: 'var(--spacing-3)',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    }),
    variationLabelText: {
      mr: 'xs',
      color: theme.colors.main.black,
      textTransform: 'uppercase',
      fontFamily: theme.fontFamily.primaryNormal,
    },
    variationLabelNormalNoTransformText: {
      mr: 's',
      color: theme.colors.main.black,
      fontFamily: 'var(--font-face1-normal)',
    },
    variationLabelValue: {
      color: theme.colors.neutral.dark,
      mr: 's',
    },
    variationLabelValueMegaPDP: {
      textTransform: 'capitalize',
    },
    showMoreShowLessWrapper: {
      cursor: 'pointer',
      backgroundColor: '#f4f4f4',
    },
    showMoreShowLessText: {
      fontSize: theme.fontSizes.sm,
      fontFamily: theme.fontFamily.primaryNormal,
      fontWeight: 'normal',
      m: '0 auto',
      lineHeight: '1.4',
      letterSpacing: '0.2',
      color: theme.colors.neutral.base,
      width: 'min-content',
    },
    closeIconContainer: {
      top: '-5px',
      right: '5px',
      cursor: 'default',
    },
    fitReviewText: () => ({}),
    btnWrapper: {
      flexWrap: 'wrap',
      '.controls-sticky-btn-child button': {
        borderRadius: '2px',
      },
    },
    sizeButtonText: {
      display: 'flex',
      justifyContent: 'center',
    },
    countryTabs: (isActive) => ({
      color: 'black',
      padding: 0,
      marginRight: { base: 'var(--spacing-2)', lg: 'var(--spacing-3)' },
      '&:last-child': {
        marginRight: { base: 'var(--spacing-1)', lg: 'var(--spacing-2)' },
      },
      '&:focus-visible': {
        boxShadow: 'none',
      },
      borderBottom: `2px solid ${isActive ? 'black' : 'transparent'}`,
      fontFamily: isActive ? 'var(--font-face1-bold)' : 'var(--font-face1-normal)',
      fontSize: 'sm',
    }),
    btnDisabled: {
      pointerEvents: 'none',
    },
  }),
  variants: {
    sizeVariation: () => ({
      btnWrapper: {
        display: { base: '-webkit-box', lg: 'flex' },
        flexWrap: { base: 'nowrap', lg: 'wrap' },
        overflowX: { base: 'scroll', lg: 'unset' },
        '::-webkit-scrollbar': { display: 'none' },
        '::-webkit-scrollbar-track': { display: 'none' },
        '::-webkit-scrollbar-thumb': { display: 'none' },
        '-ms-overflow-style': 'none' /* IE and Edge */,
        'scrollbar-width': 'none' /* Firefox */,
      },
      btnChild: {
        mr: 'var(--spacing-2)',
        mb: 'var(--spacing-2)',
      },
    }),
    tabbedPDP: ({ theme }) => ({
      colorVariantsWrapper: {
        '&.color-variants:not(.color-variants-mega-pdp)': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            mt: '16px',
          },
        },
      },
      pdpImageSwatchBox: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mb: '2px',
        },
      },
    }),
    extendedAdaptiveTabbedPDP: ({ theme }) => ({
      tabControlsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          mt: '20px',
        },
      },
      btnWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          flexWrap: 'nowrap',
          columnGap: 'var(--spacing-1)',
          overflowX: 'scroll',
          mb: 'var(--spacing-1)',
          '::-webkit-scrollbar': { display: 'none' },
          '::-webkit-scrollbar-track': { display: 'none' },
          '::-webkit-scrollbar-thumb': { display: 'none' },
          '-ms-overflow-style': 'none' /* IE and Edge */,
          'scrollbar-width': 'none' /* Firefox */,
          '&  > :first-child': {
            ml: 'var(--spacing-4)',
          },
          '&  > :last-child': {
            mr: 'var(--spacing-4)',
          },
          '.controls-btn-tabs-child': {
            minWidth: 'min(100px, 30%)',
            mb: 0,
          },
          '.controls-btn-child': {
            minWidth: 'min(80px, 23%)',
            width: 'auto',
            flexShrink: 0,
            mb: 0,
          },
        },
      },
      variationLabelText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
          pl: 'var(--spacing-4)',
        },
      },
      variationLabelValue: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
        },
      },
      fitReviewTextStyle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          ...theme.typography['text-body1-m'],
        },
      },
      prodVariationLabelWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          pr: 'var(--spacing-4)',
          margin: '0 0 5px',
          lineHeight: 1,
          justifyContent: 'space-between',
          width: '100%',
        },
      }),

      colorVariantsWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          display: 'flex',
          flexDirection: 'column-reverse',
          mt: '14px',
          '&.color-variants:not(.color-variants-mega-pdp)': {
            mt: '18px !important',
            mb: 'var(--spacing-2)',
          },
        },
      },
      colorVariantLabel: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& .color-name': {
            ...theme.typography['text-body1-m'],
            color: theme.colors.main.black,
          },
          '& .variation-wrapper': {
            mb: '6px',
          },
          '&.color-value:not(.mega-pdp) .product-variation-label': {
            [`@media (max-width: ${theme.breakpoints.sm})`]: {
              mb: '5px',
              mt: 0,
            },
          },
        },
      },
      productImagesInnerContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '& > div:first-child': {
            ml: 'var(--spacing-4)',
          },
          '& > div:last-child': {
            pr: 'var(--spacing-4)',
          },
        },
      },
      pdpImageSwatchBox: {
        width: '64px',
        height: '64px',
        borderRadius: '8px',
        borderColor: 'var(--color-neutral-light-3)',
        mr: 'var(--spacing-2)',
      },
      pdpImageSwatch: {
        borderRadius: '8px',
      },
      pdpImageSwatchSelected: {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: theme.colors.main.black,
      },
    }),
  },
}
