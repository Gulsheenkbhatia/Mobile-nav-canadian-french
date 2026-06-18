export default {
  baseStyle: ({ theme, shouldRenderIcons }) => ({
    headerContainer: {
      background: 'var(--color-product-image-bg)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        background: 'none',
        alignItems: 'baseline',
      },
    },
    headerText: {
      ...theme.typography['text-display2-xs'],
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display2-m'],
        fontWeight: '400',
        color: 'var(--color-primary)',
      },
    },
    totalText: {
      ...theme.typography['text-body1-s'],
      color: 'var(--color-neutral-medium)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        fontSize: 'var(--text-16)',
      },
    },
    sortFilterContainer: {
      background: 'var(--color-product-image-bg)',
      borderBottom: '1px solid var(--color-neutral-light-2)',
    },
    toggleContainerWrapper: {
      background: 'var(--color-product-image-bg)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        background: 'none',
      },
    },
    toggleContainer: {
      background: 'var(--color-secondary)',
      border: '1px solid var(--color-neutral-light-1)',
      padding: '3px var(--spacing-1)',
    },
    toggleLink: {
      ...theme.typography['text-body2-m'],
      letterSpacing: '0px',
      textDecoration: 'none',
      padding: '6px var(--spacing-3) 5px var(--spacing-3)',
      fontFeatureSettings: '"liga" off, "clig" off',
      color: 'var(--color-primary)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        color: 'var(--color-black-base)',
        lineHeight: 'var(--line-height-135)',
        padding: 'var(--spacing-4) var(--spacing-6) 14px var(--spacing-6)',
      },
      '&.active': {
        borderRadius: '52px',
        backgroundColor: 'var(--color-neutral-dark)',
        color: 'var(--color-secondary)',
        fontWeight: '500',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          backgroundColor: 'var(--color-grey-80)',
        },
      },
    },
    mobileFilterButton: {
      p: '10px 14px 10px 14px',
    },
    filterButtonText: {
      color: 'var(--color-black-base)',
      fontSize: 'var(--text-14)',
    },
    categorySection: {
      background: 'var(--color-product-image-bg)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        background: 'var(--color-neutral-light-1)',
      },
    },
    sectionTitle: {
      ...theme.typography['text-display2-s'],
      fontWeight: '400',
      fontSize: 'var(--text-20)',
      paddingX: 'var(--spacing-3)',
      color: 'var(--color-primary)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-display2-m'],
        fontWeight: '400',
        color: 'var(--color-primary)',
      },
    },
    viewMoreButton: {
      textTransform: 'none',

      [`@media (min-width: ${theme.breakpoints.md})`]: {
        '& svg': {
          mt: '0 !important',
        },
      },
    },
    viewMoreText: {
      ...theme.typography['text-body1-m'],
      fontWeight: '400',
      textTransform: 'none',
      color: 'var(--color-primary)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        ...theme.typography['text-body1-l'],
        textTransform: 'none',
      },
    },
    filterItemText: {
      ...theme.typography['text-body1-m'],
      fontWeight: '400',
      fontSize: 'var(--text-14)',
    },
    topCarouselWrapper: {
      overflowX: 'auto',
      width: '100%',
      padding: 'var(--spacing-3)',
      gap: '18px',
      borderBottom: 'unset',
      background: 'var(--color-product-image-bg)',
      '&.image-carousel-wrapper': {
        gap: 'var(--spacing-3)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          background: 'var(--color-page-bg)',
          gap: '40px',
          padding: 0,
        },
      },
      '& .image-carousel-item': {
        width: '27%',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          width: '120px',
          padding: 0,
        },
      },
    },
    listingContainer: {
      marginTop: 'var(--spacing-6)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        marginTop: 0,
      },
    },
    topCarouselItem: {
      width: 'auto',
      flexShrink: 0,
      '& img': {
        aspectRatio: '0.8',
        objectFit: 'cover',
        maxWidth: '60px',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          maxWidth: '120px',
          width: '75px',
        },
      },
      '& p': {
        ...theme.typography['text-body1-s'],
        color: 'var(--color-black-base)',
        textAlign: 'center',
        marginTop: 'var(--spacing-1)',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          marginTop: '5px',
          fontSize: '15px',
          letterSpacing: '0.25px',
        },
      },
      '& .aspect-ratio': {
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          display: 'none',
        },
      },
    },
    topActionsContainer: {
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        margin: 'var(--spacing-6) 0 var(--spacing-10) 0',
      },
    },
  }),
}
