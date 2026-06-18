export default {
  baseStyle: () => ({
    bundleModuleWrapper: {
      p: 'var(--spacing-3)',
      border: '1px solid #d8d8d8',
      mb: 'var(--spacing-6)',
    },
  }),
  variants: {
    pdpv42: ({ theme }) => ({
      bundleModuleWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-secondary)',
          borderRadius: '800px',
          padding: 'var(--spacing-2) var(--spacing-4) var(--spacing-2) var(--spacing-2)',
          width: '94vw',
          mb: 'var(--spacing-3)',
        },
      },
      bundleImage: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderRadius: '800px',
          height: '35px',
          width: '35px',
        },
      },
    }),
  },
}
