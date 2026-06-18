export default {
  parts: ['horizontalFilterButton'],
  baseStyle: () => ({
    horizontalFilterButton: {
      fontFamily: 'var(--font-face1-normal)',
    },
    activeFilterCount: {
      paddingTop: 'var(--spacing-1)',
    },
    filterColorButtonWrapper: {
      '& a, & button': {
        fontSize: 'var(--text-12)',
      },
    },
  }),
}
