export default {
  baseStyle: () => ({
    certonaTitleHome: () => ({
      '@media (max-width: 769px)': {
        fontSize: 'var(--text-28)',
      },
      fontSize: 'var(--text-44)',
      fontFamily: 'var(--font-face1-extended-bold)',
      lineHeight: 'var(--line-height-xs)',
      letterSpacing: 'var(--letter-spacing-xs)',
      color: 'var(--color-black-base)',
      textAlign: 'center',
      textTransform: 'capitalize',
    }),
    productName: {
      lineClamp: 2,
      WebkitLineClamp: 2,
    },
    clickToShopbtn: {
      borderRadius: 'var(--border-radius-m)',
      borderColor: 'var(--color-neutral-base)',
    },
  }),
}
