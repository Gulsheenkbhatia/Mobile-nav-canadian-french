export default {
  parts: [
    'separator',
    'breadcrumbLink',
    'breadcrumbText',
    'emptyBreadcrumb',
    'breadcrumbContainer',
  ],
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
          lineHeight: 1,
          fontWeight: 400,
        },
      }),
      emptyBreadcrumb: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          display: 'none !important',
        },
      },
    }),
    TabbedPDPBreadcrumb: ({ theme }) => ({
      separator: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-12)',
          lineHeight: 'var(--line-height-140)',
        },
      },
      breadcrumbText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          lineHeight: 'var(--line-height-140)',
          fontWeight: 400,
        },
      },
      breadcrumbLink: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-black-base)',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          fontWeight: 400,
          fontStyle: 'normal',
        },
      }),
      emptyBreadcrumb: {
        '> span': {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            ml: 0,
          },
        },
      },
      breadcrumbContainer: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          w: 'calc(100% - var(--spacing-6))',
          m: 'var(--spacing-6) var(--spacing-3)',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      },
    }),
  },
}
