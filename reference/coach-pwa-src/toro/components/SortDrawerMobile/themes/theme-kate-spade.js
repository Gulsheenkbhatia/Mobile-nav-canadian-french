import FilterIcon from 'design-tokens/icon/navigation/filter-and-sort.svg'
export default {
  baseStyle: ({ theme }) => ({
    mobileRadioFilterText: {
      ...theme.typography['text-body1-m'],
    },
    filterButtonText: {
      ...theme.typography['text-eyebrow1-m'],
    },
    sortByText: {
      ...theme.typography['text-eyebrow1-m'],
    },
    viewAllProductsWrapper: {
      ...theme.typography['text-cta1-s'],
    },
    FilterIcon,
  }),
  variants: {
    plpV3: ({ theme }) => ({
      mainWrapper: {
        backgroundColor: 'var(--color-product-image-bg)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-neutral-light-1, #f0f0f0)',
        },
      },
    }),

    shopByBrowseAll: ({ theme }) => ({
      mainWrapper: {
        backgroundColor: 'var(--color-product-image-bg)',
      },
      filterButtonText: {
        ...theme.typography['text-body1-m'],
        fontSize: 'var(--text-14)',
        fontWeight: '400',
        textTransform: 'none',
      },
    }),
  },
}
