export default {
  parts: ['horizontalFilterButton', 'filterPopup'],
  baseStyle: ({ theme }) => ({
    horizontalFilterButton: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        '& svg': {
          color: 'var(--color-icon-filter-pill-default, #000000)',
        },
      },
    },
    filterPopup: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        zIndex: '14',
      },
    },
  }),
}
