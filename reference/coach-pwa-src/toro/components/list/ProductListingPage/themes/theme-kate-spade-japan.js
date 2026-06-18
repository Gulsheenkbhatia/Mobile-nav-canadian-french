export default {
  baseStyle: ({ theme }) => ({
    plpHeading: (isDesktop) => ({
      fontWeight: '500',
      ...(isDesktop ? theme.typography['text-display1-m'] : theme.typography['text-display1-xs']),
    }),
    mobilePlpHeading: {
      mt: 'var(--spacing-2)',
      ...theme.typography['text-display1-xs'],
      textTransform: 'none',
      '&::first-letter': {
        textTransform: 'none',
      },
    },
  }),
  variants: {
    completePlpV3Desktop: ({ theme }) => ({
      wrapper: {
        backgroundColor: 'var(--color-product-image-bg)',
      },
      mainContainerWrapper: {
        backgroundColor: 'var(--color-product-image-bg)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-product-image-bg)',
        },
      },
      mobileBottomBreadcrumbWrapper: {
        backgroundColor: 'var(--color-product-image-bg)',
      },
    }),
    plpV3: ({ theme }) => ({
      wrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-product-image-bg)',
        },
      },
      mobileBreadcrumbWrapper: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-product-image-bg)',
        },
      },
      productListingGrid: {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-product-image-bg)',
        },
      },
      mainContainerWrapper: {
        pt: 'var(--spacing-1)',
        pb: 'm',
        backgroundColor: 'var(--color-product-image-bg)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-product-image-bg)',
        },
      },
      searchResultCSS: {
        backgroundColor: 'var(--color-product-image-bg)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-product-image-bg)',
        },
      },
    }),
  },
}
