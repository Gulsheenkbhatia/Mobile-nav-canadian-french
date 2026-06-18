export default {
  baseStyle: ({ theme }) => ({
    similarToLabel: {
      fontWeight: 500,
      lineHeight: 'var(--line-height-135) !important',
      color: 'var(--color-primary)',
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        letterSpacing: 'var(--letter-spacing-l)',
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-cta2-xs'],
        lineHeight: 'var(--line-height-115) !important',
      },
    },
    similarToProductName: {
      fontSize: 'var(--text-20)',
      color: 'var(--color-primary)',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
      },
    },
    drawerContent: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderRadius: 'var(--spacing-1) var(--spacing-1) 0px 0px',
      },
    },
    drawerBody: {
      '.certona_title': {
        fontFamily: 'var(--font-face2-normal)',
        fontSize: 'var(--text-24)',
        fontWeight: 400,
        color: 'var(--color-black-base)',
      },
      '.recommendation-tile-name-wrapper': {
        display: 'flex',
        justifyContent: 'left',
        padding: 0,
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          justifyContent: 'center',
          paddingTop: 'var(--spacing-2)',
        },
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          paddingBottom: '3.5px',
          marginLeft: 0,
        },
        paddingTop: 'var(--spacing-2)',
      },
      '.content-divider': {
        '.certona_wrapper': {
          paddingTop: '10px',
        },
      },
      '.recommendation-price-comparable': {
        paddingBottom: '2px',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          justifyContent: 'left',
        },
      },
      '.recommended-price': {
        marginTop: '6px !important',
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          marginTop: '0px !important',
        },
      },
      '.recommendSlider': {
        marginTop: '8.5px',
      },
      '.recommendation-tile-price-wrapper': {
        justifyContent: 'left',
        alignItems: 'center',
        [`@media (min-width: ${theme.breakpoints.md})`]: {
          justifyContent: 'center',
        },
        span: {
          fontStyle: 'normal',
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            letterSpacing: 'var(--letter-spacing-s)',
          },
        },
      },
      '.recommendation-tile-image-wrapper': {
        backgroundColor: 'var(--color-product-image-bg)',
      },
    },
  }),
}
