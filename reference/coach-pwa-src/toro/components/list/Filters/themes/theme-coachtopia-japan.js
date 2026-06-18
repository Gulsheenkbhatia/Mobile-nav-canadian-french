export default {
  parts: ['priceInputBox'],
  baseStyle: ({ theme }) => ({
    filterSection: {
      fontFamily: 'var(--font-face1-medium)',
    },
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
      color: 'var(--color-neutral-medium)',
    },
    priceCurrency: () => ({
      ...theme.typography['text-body2-m'],
      color: 'var(--color-neutral-medium)',
    }),
    priceInputBox: () => ({
      ...theme.typography['text-body2-m'],
      color: 'var(--color-neutral-medium)',
    }),
    refinementDefaultStyle: {
      '& a.selected': {
        backgroundColor: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
      },
    },
    filterText: {
      color: 'var(--color-neutral-medium)',
    },
    FilterByText: {
      ...theme.typography['text-eyebrow1-l'],
      textAlign: 'left',
      fontFamily: 'var(--font-face1-extrabold)',
    },
  }),
  variants: {
    plpV3: () => ({
      priceInputBox: () => ({
        paddingLeft: 'var(--spacing-6)',
        color: 'var(--color-black-base)',
      }),
    }),
    desktopFilterV3: ({ theme }) => ({
      priceInputBox: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          fontFamily: 'var(--font-face1-medium)',
          color: 'var(--color-black-base)',
          borderColor: '#000003',
          borderRadius: '3px',
          padding: '10px var(--spacing-4) 14px var(--spacing-8)',
          height: '44px',
          width: '118px',
        },
      }),
    }),
  },
}
