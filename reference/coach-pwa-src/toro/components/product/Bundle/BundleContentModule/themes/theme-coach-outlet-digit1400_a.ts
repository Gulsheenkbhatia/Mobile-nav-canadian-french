export default {
  baseStyle: ({ theme }) => ({
    bundleModuleWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: 'var(--spacing-6)',
        mb: 0,
      },
    },
  }),
  variants: {
    pdpv42: ({ theme }) => ({
      bundleModuleWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          backgroundColor: 'var(--color-secondary)',
          borderRadius: '800px',
          mt: 0,
          mb: 'var(--spacing-3)',
          padding: 'var(--spacing-2) var(--spacing-4) var(--spacing-2) var(--spacing-2)',
          width: '94vw',
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
