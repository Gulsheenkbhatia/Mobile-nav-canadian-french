export default {
  parts: ['selectorWrapper', 'atbWrapper'],
  baseStyle: ({ theme }) => ({
    mobileHeroContainer: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginBottom: 'var(--spacing-4)',
      },
    }),
    ReviewAndRating: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        minHeight: 'auto',
      },
    }),
    buyNowWrapper: {
      '& button.buy-now-button': {
        color: 'var(--color-white-base)',
        fontFamily: 'var(--font-face1-medium)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          height: '57px',
          fontSize: 'var(--text-12)',
        },
      },
    },
    addToBagButtonWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        marginTop: 'var(--spacing-2)',
      },
    },
    BottomProductVariationControls: {
      '&:empty': {
        mb: 0,
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '.size-guide-container': {
          marginBottom: '10.5px',
        },
        ':not(:has(.size-guide-container)):has(.controls-btn-wrapper)': {
          marginBottom: '16px',
        },
      },
    },
    addToBagCTA: () => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '&:empty': {
          mt: 0,
        },
      },
    }),
    mobileUpperMainContainer: {
      pt: 0,
    },
    mobileMainContainer: {
      pb: 'var(--spacing-6)',
    },
    NotifyMeWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
      },
    },
    AddToBagCTAWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 0,
      },
    },
  }),
  variants: {
    quantitySelectorV3: ({ theme }) => ({
      selectorWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: 0,
          '.chakra-select__wrapper': {
            height: '57px',
          },
        },
        [`@media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md})`]: {
          '.chakra-select__wrapper': {
            marginTop: '0',
          },
        },
      },
      atbNotifyMeWrapper: {
        '& .chakra-select__wrapper': {
          mr: 0,
        },
      },
      addToBagCTAButtons: {
        '& .chakra-select__wrapper': {
          mr: 0,
        },
      },
      atbWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          '.chakra-select__wrapper': {
            mr: 'var(--spacing-2)',
            mt: '0',
          },
        },
        [`@media (min-width: ${theme.breakpoints.sm}) and (max-width: ${theme.breakpoints.md})`]: {
          '.chakra-select__wrapper': {
            marginTop: '0',
          },
          '.chakra-select__wrapper select': {
            height: '57px',
          },
        },
      },
      atbWrapperGridGap: {
        gridGap: 'var(--spacing-3)',
        columnGap: 'var(--spacing-3)',
      },
    }),
  },
}
