export default {
  baseStyle: ({ theme }) => ({
    // container styles
    UGCContainerRoot: {
      position: 'relative',
      overflow: 'hidden',
      padding: 'var(--spacing-10) 0 var(--spacing-6)',
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    // top content styles
    topContent: {
      '& #product_body_slot_wyng .mol-banner .banner-container.solid-background .mol-header-block':
        {
          marginBottom: 'var(--spacing-3)',
        },
      '& .mol-banner .banner-container .mol-header-block-container': {
        '& .mol-header-block': {
          margin: '0 auto',
        },
        '& .at-text-block': {
          '& .at-eyebrow-text:empty': {
            display: 'none',
          },
          '& .at-headline-text': {
            ...theme.typography['text-display2-m'],
            color: 'var(--color-black-base)',
            textAlign: 'center',
            marginBottom: 'var(--spacing-2)',
            fontWeight: '400',
          },
          '& .at-body-text': {
            ...theme.typography['text-title1-m'],
            textAlign: 'center',
            fontWeight: '400',
            mb: 'var(--spacing-3)',
          },
        },
        '& .links-container a': {
          ...theme.typography['text-title1-m'],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          alignSelf: 'stretch',
          padding: '18px 20px',
          borderRadius: '800px',
          border: '1px solid var(--color-white, #FFF)',
          background: 'var(--color-white, #FFF)',
          textTransform: 'none',
          color: 'var(--color-black-base)',
          m: '2px var(--spacing-1) 2px',
        },
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        '& #product_body_slot_wyng .mol-banner .banner-container .mol-header-block-container .mol-header-block':
          {
            mt: 0,
          },
      },
    },

    // slider styles
    sliderContainer: {
      maxWidth: '100vw',
      '& .section-slider-container': {
        padding: 0,
      },
      '& .section-slider-custom-pagination': {
        display: 'none',
      },
    },
    imageContainer: {
      borderRadius: '12px',
      overflow: 'hidden',
    },
    imageOrVideo: {
      objectFit: 'cover',
      width: '230px',
      height: '437px',
      cursor: 'pointer',
    },
  }),
}
