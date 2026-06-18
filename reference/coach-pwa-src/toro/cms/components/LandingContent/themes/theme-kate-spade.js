export default {
  baseStyle: () => ({
    htmlContent: () => ({
      '@media (max-width: 768.98px)': {
        '& .mol-content-card-container': {
          pt: '3rem',
          pb: '1rem',
          '& .desk-carousel-mob-stack .splide__slide, .desk-peekaboo-mob-stack .splide__slide': {
            p: '0 0.75rem 3rem',
          },
          '& .desk-carousel-mob-stack .color-swatches .splide__slide, .desk-peekaboo-mob-stack .color-swatches .splide__slide':
            {
              p: '0',
            },
        },
      },
    }),
  }),
}
