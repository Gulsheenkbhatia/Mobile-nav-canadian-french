import { HORIZONTAL_FILTERS_WRAPPER_Z_INDEX } from 'toro/components/list/HorizontalFiltersBar/themes/theme-kate-spade'

const plpV3BackgroundColor = 'var(--color-neutral-light-1, #f0f0f0)'

export default {
  baseStyle: ({ theme }) => ({
    plpHeading: () => ({
      fontWeight: '400',
      ...theme.typography['text-display1-m'],
      textTransform: 'uppercase',
    }),
    mobileBreadcrumbText: {
      ...theme.typography['text-body1-s'],
    },
    mobilePlpHeading: {
      mt: 'var(--spacing-2)',
      ...theme.typography['text-display1-xs'],
      textTransform: 'uppercase',
      fontWeight: '400',
    },
  }),
  variants: {
    plpV3: ({ theme }) => ({
      wrapper: {
        background: plpV3BackgroundColor,
      },
      mobileBreadcrumbWrapper: {
        background: plpV3BackgroundColor,
      },
      productListingGrid: {
        background: plpV3BackgroundColor,
      },
      stickyNav: (stickyHeight, isStickyFilterEnabled) => ({
        position: isStickyFilterEnabled ? 'sticky' : '',
        zIndex: 11,
        top: stickyHeight ? `${stickyHeight}px` : null,
        background: plpV3BackgroundColor,
        width: '100%',
      }),
      mainContainerWrapper: {
        pt: 'var(--spacing-1)',
        pb: 'm',
        background: plpV3BackgroundColor,
      },
      mobileBottomBreadcrumbWrapper: {
        backgroundColor: 'var(--color-product-image-bg)',
        '& > ::after': {
          backgroundColor: 'var(--color-product-image-bg)',
        },
      },
      searchResultCSS: {
        background: plpV3BackgroundColor,
      },
      mobilePlpHeading: {
        ...theme.typography['text-display2-xs'],
        color: 'var(--color-primary)',
        letterSpacing: 'var(--letter-spacing-s)',
      },
    }),

    completePlpV3Desktop: ({ theme }) => ({
      plpHeading: () => ({
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          ...theme.typography['text-display1-m'],
          fontSize: 'var(--text-36)',
          fontWeight: '400',
          ml: 'none',
          px: 'var(--spacing-3)',
          width: 'fit-content',
          textTransform: 'none',
          color: 'var(--color-primary, #101820)',
        },
      }),
      plpHeadingWrapper: {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          '&.plp-v3-1': {
            position: 'relative',
            zIndex: HORIZONTAL_FILTERS_WRAPPER_Z_INDEX + 1,
          },
        },
      },
    }),
  },
}
