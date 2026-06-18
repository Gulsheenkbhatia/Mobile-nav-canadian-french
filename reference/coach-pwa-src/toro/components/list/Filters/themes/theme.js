export default {
  parts: [
    'filterText',
    'priceInputHeading',
    'priceCurrency',
    'priceInputBox',
    'priceErrorMessage',
    'FilterByText',
    'FilterAccordionText',
    'FilterButtons',
    'FilterCheckboxesLabel',
    'checkBoxWrapper',
    'AccordionIconColor',
    'accordionSVG',
    'FilterButtonsWrapper',
    'filterColorButtonWrapper',
    'ClearAllButton',
    'filterPriceWrapper',
    'filterBusyOverlay',
    'filterPriceFieldsWrapper',
  ],
  baseStyle: ({ theme }) => ({
    filterBusyOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      backgroundColor: 'var(--color-white-base)',
      opacity: 0.75,
      zIndex: 1,
    },
    accordionSVG: {
      '&:last-of-type': {
        borderBottomWidth: 0,
      },
      svg: {
        '&:focus': {
          outline: 'none !important',
        },
      },
    },
    filterText: {
      color: theme.colors.main.gray,
      pt: theme.space.m,
      ml: theme.space.mar,
      mr: theme.space.mar,
    },
    priceInputHeading: {
      textTransform: 'uppercase',
      fontSize: theme.fontSizes.xxs,
      color: theme.colors.main.gray,
      letterSpacing: theme.letterSpacings.lg,
    },
    priceCurrency: (dirtyFields) => ({
      fontSize: theme.fontSizes.sm,
      color: dirtyFields.price ? theme.colors.main.black : theme.colors.main.gray,
    }),
    priceInputBox: (dirtyFields) => ({
      color: dirtyFields.price ? theme.colors.main.black : theme.colors.main.gray,
    }),
    priceErrorMessage: {
      color: theme.colors.error.primary,
      mt: 's',
    },
    FilterButtons: {
      whiteSpace: 'break-spaces',
      height: '100%',
      textAlign: { base: 'center' },
      '&:hover': {
        background: theme.colors.main.black,
        color: theme.colors.main.white,
      },
      '&.selected': {
        backgroundColor: theme.colors.main.gray,
        color: theme.colors.main.white,
      },
    },
    AccordionIconColor: {
      color: theme.colors.main.black,
    },
    refinementDefaultStyle: {
      '& a.selected': {
        backgroundColor: theme.colors.main.gray,
      },
    },
    ClearAllButton: {
      width: 'auto',
      p: theme.space.s,
    },
    accordionButton: {
      px: 0,
      py: theme.space.mar,
      my: '6px',
    },
    filterColorButtonWrapper: {
      gridGap: 'var(--spacing-4)',
    },
    filterPriceWrapper: {
      width: '100%',
    },
    filterPriceFieldsWrapper: {
      justifyContent: 'space-between',
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      filterBusyOverlay: {
        backgroundColor: 'var(--color-neutral-light-1)',
      },
      checkBoxWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '.chakra-checkbox': {
            marginBottom: 0,
            '&:first-of-type': {
              paddingTop: '1px',
            },
            '&:last-of-type': {
              paddingBottom: '2px',
            },
          },
          '.chakra-checkbox__control': {
            backgroundColor: 'var(--color-white-base)',
            borderColor: 'var(--color-neutral-light-3)',
          },
          '.chakra-checkbox__label': {
            marginLeft: 'var(--spacing-3)',
          },
        },
      },
      FilterButtonsWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          marginBottom: '2px',
          marginTop: '1px',
        },
      },
      FilterButtons: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          paddingY: '9px',
          minHeight: 'var(--spacing-10)',
          borderColor: 'var(--color-neutral-light-3)',
          borderRadius: 'var(--border-radius-xs)',
        },
      },
      filterColorButtonWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          gridGap: '20px',
          marginTop: '5px',
          marginBottom: '6px',
        },
      },
      ClearAllButton: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          border: 'none',
          background: 'none',
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          letterSpacing: 'var(--letter-spacing-s)',
          lineHeight: 'var(--line-height-xl)',
          textTransform: 'none',
          textDecoration: 'underline',
          '&:disabled': {
            border: 'none',
            background: 'none',
            color: 'var(--color-neutral-light-1)',
          },
          '&:hover:not(:disabled)': {
            backgroundColor: 'transparent',
            color: theme.colors.main.black,
          },
        },
      },
      FilterByText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          letterSpacing: 'var(--letter-spacing-s)',
          lineHeight: 'var(--line-height-xl)',
          textTransform: 'none',
        },
      },
      FilterAccordionText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          textTransform: 'none',
        },
      },
      accordionSVG: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          borderColor: 'var(--border-color-inactive)',
        },
      },
      priceInputBox: (dirtyFields) => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          color: dirtyFields.price ? theme.colors.main.gray : theme.colors.main.black,
          backgroundColor: 'var(--color-white-base)',
          borderColor: 'var(--color-neutral-light-3)',
        },
      }),
      priceCurrency: (dirtyFields) => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontSize: theme.fontSizes.sm,
          color: dirtyFields.price ? theme.colors.main.gray : theme.colors.main.black,
          zIndex: 1,
          bottom: '5px',
        },
      }),
      filterText: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-eyebrow1-m'],
          color: 'var(--color-neutral-medium)',
        },
      },
      priceInputHeading: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-eyebrow1-m'],
          color: 'var(--color-neutral-medium)',
          zIndex: 1,
        },
      },
      filterPriceWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          marginBottom: '6px',
        },
      },
    }),
    desktopFilterV3: ({ theme }) => ({
      priceInputHeading: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          color: 'var(--color-neutral-medium)',
          paddingX: '2px',
          textTransform: 'capitalize',
          backgroundColor: 'var(--color-white-base)',
          zIndex: 1,
          top: '-8px',
          left: 'var(--spacing-4)',
        },
      },
      priceCurrency: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          lineHeight: 1,
          color: 'var(--color-black-base)',
          left: 'var(--spacing-4)',
          bottom: '50%',
          transform: 'translateY(42%)',
        },
      }),
      priceInputBox: (_, __, lengthOfCurrency) => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          color: 'var(--color-black-base)',
          borderColor: '#000003',
          borderRadius: '3px',
          padding: `10px var(--spacing-4) var(--spacing-3) ${
            12 + Math.max(lengthOfCurrency, 1) * 12
          }px`,
          height: '44px',
          width: '118px',
        },
      }),
    }),
  },
}
