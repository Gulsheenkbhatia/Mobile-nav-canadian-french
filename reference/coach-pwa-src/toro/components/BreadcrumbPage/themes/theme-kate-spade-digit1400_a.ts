export default {
  parts: ['separator', 'breadcrumbLink', 'breadcrumbText', 'emptyBreadcrumb'],
  variants: {
    pdp: ({ theme }) => ({
      separator: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-12)',
          lineHeight: 1,
        },
      },
      breadcrumbText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          lineHeight: 1,
          fontWeight: 400,
        },
      },
      breadcrumbLink: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-black-base)',
          lineHeight: 1,
          letterSpacing: 'var(--letter-spacing-xs)',
          fontWeight: 400,
          fontStyle: 'normal',
        },
      }),
      emptyBreadcrumb: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          display: 'none',
        },
      },
    }),
  },
}
