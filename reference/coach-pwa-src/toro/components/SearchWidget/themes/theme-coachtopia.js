export default {
  baseStyle: ({ theme }) => ({
    input: {
      fontFamily: theme.fontFamily.secondaryNormal,
      fontSize: theme.fontSizes.sm,
      color: theme.colors.main.black,
      overflow: 'hidden',
      lineHeight: theme.lineHeights.xl,
      '&.searchIn': {
        '::placeholder': {
          color: 'var(--color-black-base)',
          ...theme.typography['text-body2-m'],
        },
        ':-ms-input-placeholder': {
          color: 'var(--color-neutral-base)',
        },
        '::-ms-input-placeholder': {
          color: 'var(--color-neutral-base)',
        },
      },
    },
  }),
  variants: {
    footer: ({ theme }) => ({
      input: {
        ...theme.typography['text-body2-m'],
        '::placeholder': {
          ...theme.typography['text-display2-s'],
          color: theme.colors.main.black,
        },
        color: theme.colors.main.primary,
        opacity: '0.5',
      },
    }),
    mobile: ({ theme }) => ({
      input: {
        '::placeholder': {
          ...theme.typography['text-body2-s'],
        },
      },
    }),
    searchV2: ({ theme }) => ({
      input: {
        ...theme.typography['text-title1-m'],
        fontWeight: `400`,
        color: `var(--color-black-base)`,
        borderRadius: '0px',
        overflow: 'auto',
        paddingLeft: '36px',
        paddingTop: 'var(--spacing-1)',
        '&.searchIn': {
          '::placeholder': {
            color: 'var(--color-neutral-medium)',
          },
          ':-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
          },
          '::-ms-input-placeholder': {
            color: 'var(--color-neutral-medium)',
          },
        },
      },
      SearchSuggestionCategoriesName: {
        ...theme.typography['text-title1-m'],
        fontSize: 'var(--text-14)', // typo class is 12px while figma is 14px
        lineHeight: '125%', // typo class is 100% while figma is 125%
        fontWeight: '400',
        color: `var(--color-black-base)`,
        marginBottom: '0px',
        textTransform: 'capitalize',
        transition: 'font-size 200ms ease',
      },
    }),
  },
}
