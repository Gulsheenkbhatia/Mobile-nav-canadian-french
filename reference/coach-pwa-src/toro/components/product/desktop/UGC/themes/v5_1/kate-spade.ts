export default {
  parts: ['UGCContainerRoot', 'topContent', 'sliderContainer'],
  baseStyle: ({ theme }) => ({
    UGCContainerRoot: {
      maxWidth: '1607px',
      marginX: 'auto',
      minHeight: '841px',
      paddingBottom: '36px',
    },
    topContent: {
      '& .mol-banner .banner-container .mol-header-block-container': {
        '& .at-text-block': {
          '& .at-headline-text': {
            marginBottom: '5px',
            ...theme.typography['text-display1-xl'],
            lineHeight: 'var(--line-height-115)',
            letterSpacing: 'var(--letter-spacing-s)',
          },
          '& .at-body-text': {
            marginBottom: '23px',
            ...theme.typography['text-body1-l'],
            lineHeight: 'var(--line-height-120)',
            letterSpacing: 'var(--letter-spacing-m)',
          },
        },
        '& .links-container': {
          display: 'flex',
          gap: 'var(--spacing-2)',
          '& a': {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: 'var(--spacing-12)',
            padding: '10px 18px',
            margin: 'var(--spacing-0)',
            ...theme.typography['text-body1-s'],
            lineHeight: 'var(--line-height-100)',
            letterSpacing: 'var(--letter-spacing-s)',
            color: 'var(--color-black-base, #000)',
            textTransform: 'none',
            borderRadius: '130px',
            borderColor: 'var(--color-neutral-light-2, #e1e1e1)',
            transition: 'all 0.3s ease',
            '& svg': {
              transition: 'all 0.3s ease',
            },
            '&:hover': {
              color: 'var(--color-white-base, #fff)',
              backgroundColor: 'var(--color-background-cta-focus, var(--color-neutral-medium))',
            },
          },
        },
      },
    },
    sliderContainer: {
      '& .section-slider-container': {
        padding: 'var(--spacing-10) var(--spacing-0)',
      },
      '& .splide__slide > div': {
        borderRadius: 'var(--border-radius-none)',
        paddingBottom: 'var(--spacing-6)',
      },
    },
  }),
}
