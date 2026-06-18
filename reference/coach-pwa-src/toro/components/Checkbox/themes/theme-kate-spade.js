export default {
  variants: {
    primary: () => ({
      control: {
        borderRadius: '0',
        '&[data-checked], &[data-checked]:hover': {
          backgroundColor: 'var(--color-black-base)',
          svg: {
            color: 'var(--color-white-base)',
          },
        },
      },
    }),
  },
}
