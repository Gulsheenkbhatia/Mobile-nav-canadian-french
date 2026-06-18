export default {
  baseStyle: ({ theme }) => ({
    accordionSVG: {
      svg: {
        mr: 'var(--spacing-1)',
      },
    },
    FilterByText: {
      ...theme.typography['text-eyebrow1-m'],
    },
    FilterAccordionText: {
      ...theme.typography['text-body1-m'],
    },
    FilterCheckboxesLabel: {
      '*': {
        ...theme.typography['text-body1-m'],
      },
    },
    priceInputHeading: {
      ...theme.typography['text-eyebrow1-m'],
    },
    priceInputBox: (dirtyFields, isExtraSpacing) => ({
      color: dirtyFields.price ? theme.colors.main.black : theme.colors.main.gray,
      ...theme.typography['text-body1-m'],
      paddingLeft: isExtraSpacing ? '20px' : '14px',
    }),
    filterText: {
      ...theme.typography['text-eyebrow1-m'],
    },
    priceCurrency: (dirtyFields) => ({
      color: dirtyFields.price ? theme.colors.main.black : theme.colors.main.gray,
      ...theme.typography['text-body1-m'],
    }),
    FilterButtons: {
      textDecoration: 'none',
      height: '100%',
      whiteSpace: 'break-spaces',
      textAlign: { base: 'center' },
      ...theme.typography['text-body1-m'],

      '&:hover': {
        background: theme.colors.main.black,
        color: theme.colors.main.white,
      },

      '&.selected': {
        backgroundColor: theme.colors.main.gray,
        color: theme.colors.main.white,
      },
    },
    checkBoxWrapper: {
      '.chakra-checkbox__label': {
        ...theme.typography['text-body1-m'],
      },
    },
  }),
}
