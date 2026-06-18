export default {
  parts: ['priceCurrency'],
  variants: {
    desktopFilterV3: ({ theme }) => ({
      priceCurrency: (_, currencySymbolAfterPrice) => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-body1-m'],
          ...(!currencySymbolAfterPrice && { left: 'var(--spacing-4)' }),
          lineHeight: 1,
          color: 'var(--color-black-base)',
          bottom: '50%',
          transform: 'translateY(42%)',
        },
      }),
    }),
  },
}
