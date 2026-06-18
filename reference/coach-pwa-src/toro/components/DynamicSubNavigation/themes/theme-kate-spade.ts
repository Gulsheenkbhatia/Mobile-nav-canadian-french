export default {
  variants: {
    plpV3: {
      scrollableWrapper: {
        background: 'var(--color-neutral-light-1, #f0f0f0)',
        '&::before': {
          left: 0,
          background:
            'linear-gradient(-90deg, rgba(240, 240, 240, 0.00) 0%, var(--color-neutral-light-1, #f0f0f0) 100%)',
        },
        '&::after': {
          right: 0,
          background:
            'linear-gradient(90deg, rgba(240, 240, 240, 0.00) 0%, var(--color-neutral-light-1, #f0f0f0) 100%)',
        },
      },
      categoryName: {
        color: 'var(--color-black-base)',
      },
    },
    shopBy: ({ theme }) => ({
      scrollableWrapper: {
        backgroundColor: 'var(--color-product-image-bg)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          backgroundColor: 'transparent',
          width: '100%',
        },
      },
    }),
  },
}
