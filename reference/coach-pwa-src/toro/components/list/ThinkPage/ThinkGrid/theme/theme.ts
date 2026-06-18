export default {
  baseStyle: {
    gridWrapper: {
      width: '100%',
      maxWidth: '1440px',
      margin: '0 auto',
    },
  },
  sizes: {
    '1up': ({ theme }) => ({
      gridWrapper: {
        gridTemplateColumns: 'repeat(1, 1fr)',
        width: '100%',
        // from mobile to 2k
        [`@media (min-width: ${theme.breakpoints.md}) and (max-width: 2560px)`]: {
          height: '100vh',
          '.product-tile': {
            height: '100vh',
            '.desktop-image-slider-wrapper': {
              height: '100%',
            },
            '& img': {
              objectFit: 'contain',
            },
            '& .desktop-image-slider-wrapper .swatch-slider-chevron-right': {
              right: '5% !important',
            },
            '& .desktop-image-slider-wrapper .swatch-slider-chevron-left': {
              left: '5% !important',
            },
          },
        },
      },
    }),
    '2up': ({ theme }) => ({
      gridWrapper: {
        gridTemplateColumns: 'repeat(2, 1fr)',
        width: '100%',
        [`@media (min-width: ${theme.breakpoints.md}) and (max-width: 1440px)`]: {
          height: '100vh',
          '.product-tile': {
            height: '100vh',
            '.desktop-image-slider-wrapper': {
              height: '100%',
            },
            '& img': {
              objectFit: 'contain',
            },
          },
        },
      },
    }),
    '3up': {
      gridWrapper: {
        gridTemplateColumns: 'repeat(3, 1fr)',
      },
    },
    '4up': {
      gridWrapper: {
        gridTemplateColumns: 'repeat(4, 1fr)',
      },
    },
    '5up': {
      gridWrapper: {
        gridTemplateColumns: 'repeat(5, 1fr)',
      },
    },
    fixedA: ({ theme }) => ({
      gridWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        gap: 'var(--spacing-2)',
        '.product-name': {
          marginBottom: 'var(--spacing-4)',
        },
        '.left-grid': {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
        },
        '.right-on-model': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-neutral-light-1)',
        },
      },
    }),
    fixedB: ({ theme }) => ({
      gridWrapper: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        width: '100%',
        gap: 'var(--spacing-2)',
        '.product-name': {
          marginBottom: 'var(--spacing-4)',
        },
        '.left-on-model': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          backgroundColor: 'var(--color-neutral-light-1)',
        },
        '.right-grid': {
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(2, 1fr)',
        },
      },
    }),
    fixedC: ({ theme }) => ({
      gridWrapper: {
        display: 'grid',
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        gap: 'var(--spacing-2)',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gridTemplateRows: 'repeat(2, minmax(0, 1fr))',
        minHeight: '100vh',
      },
    }),
    rowGrid: ({ theme }) => ({
      gridWrapper: {
        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
        maxWidth: '100%',
        columnGap: 's3',
        rowGap: '35px',
        '& .product-tile': {
          paddingBottom: 0,
        },
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          columnGap: 's1',
          rowGap: 's',
          '& .product-tile .product-thumbnail img': {
            objectFit: 'contain',
          },
        },
      },
    }),
  },
}
