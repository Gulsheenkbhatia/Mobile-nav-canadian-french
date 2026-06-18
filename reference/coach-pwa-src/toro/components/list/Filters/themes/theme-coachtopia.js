export default {
  baseStyle: ({ theme }) => ({
    FilterAccordionText: {
      ...theme.typography['text-cta2-m'],
    },
    checkBoxWrapper: {
      '.chakra-checkbox__label': {
        ...theme.typography['text-body2-m'],
      },
    },
    priceInputHeading: {
      ...theme.typography['text-cta2-xs'],
      color: theme.colors.neutral.medium,
    },
    priceCurrency: () => ({
      ...theme.typography['text-body2-m'],
      color: theme.colors.neutral.medium,
    }),
    priceInputBox: () => ({
      ...theme.typography['text-body2-m'],
      color: theme.colors.neutral.medium,
    }),
    refinementDefaultStyle: {
      '& a.selected': {
        backgroundColor: theme.colors.main.primary,
        borderColor: theme.colors.main.primary,
      },
    },
    filterText: {
      color: theme.colors.neutral.medium,
    },
    FilterByText: {
      ...theme.typography['text-eyebrow1-m'],
      textAlign: 'left',
    },
  }),
  variants: {
    desktopFilterV3: ({ theme }) => ({
      priceInputHeading: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-s'],
          fontFamily: 'var(--font-face1-medium)',
        },
      },
      priceCurrency: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          lineHeight: 1,
          fontFamily: 'var(--font-face1-medium)',
          color: 'var(--color-black-base)',
          left: 'var(--spacing-4)',
          bottom: '50%',
          transform: 'translateY(38%)',
        },
      }),
      priceInputBox: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-medium)',
          color: 'var(--color-black-base)',
          borderColor: '#000003',
          borderRadius: '3px',
          padding: '10px var(--spacing-4) 14px var(--spacing-6)',
          height: '44px',
          width: '118px',
        },
      }),
    }),
  },
}
