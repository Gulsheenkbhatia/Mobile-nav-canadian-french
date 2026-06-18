export default {
  baseStyle: ({ theme }) => ({
    productHeaderTitle: ({ variant, bundle }) => ({
      ...(variant === 'mobile' || bundle
        ? {
            ...theme.typography['text-display2-xs'],
          }
        : theme.typography['text-display2-m']),
      fontFamily: 'var(--font-face1-normal)',
    }),
    productSku: {
      ...theme.typography['text-body1-s'],
    },
  }),
}
