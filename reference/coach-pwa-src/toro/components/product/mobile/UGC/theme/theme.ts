export default {
  parts: ['rootContainerSkeleton'],
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
      '& .mol-banner .banner-container .mol-header-block-container': {
        '& .mol-header-block': {
          margin: '0 auto',
        },
        '& .at-text-block': {
          '& .at-eyebrow-text:empty': {
            display: 'none',
          },
          '& .at-headline-text': {
            color: 'var(--color-black-base)',
            textAlign: 'center',
            fontFamily: 'var(--font-face1-extended-bold)',
            fontSize: 'var(--text-24)',
            lineHeight: 'var(--line-height-120)',
            letterSpacing: 'var(--letter-spacing-s)',
            marginBottom: 'var(--spacing-2)',
          },
          '& .at-body-text': {
            color: 'var(--color-neutral-dark-1)',
            textAlign: 'center',
            fontFamily: 'var(--font-face1-extended-normal)',
            fontSize: 'var(--text-14)',
            lineHeight: 'var(--line-height-100)',
            letterSpacing: 'var(--letter-spacing-xs)',
            mb: 'var(--spacing-3)',
          },
        },
        '& .links-container a': {
          fontFamily: 'var(--font-face1-extended-normal)',
          textAlign: 'center',
          fontSize: 'var(--text-16)',
          fontWeight: '400',
          lineHeight: '125%',
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

    // skeleton styles
    rootContainerSkeleton: {
      w: '100vw',
      minHeight: 'unset',
      pt: '40px',
      pb: '24px',
      backgroundColor: 'var(--color-neutral-light-1)',
    },
    headerGridSkeleton: {
      gridColumnGap: 'var(--chakra-space-mar)',
      gridTemplateColumns: '1fr',
      width: '307px',
    },
    headerSkeleton: {
      h: '48px',
    },
    titleSkeleton: {
      w: '100%',
      mb: 'var(--spacing-2)',
      h: '24px',
    },
    subtitleSkeleton: {
      w: '100%',
      mb: 'var(--spacing-3)',
      h: '14px',
    },
    gridWrapperSkeleton: {
      mt: 'var(--spacing-3)',
      mb: 'var(--spacing-6)',
    },
    gridSkeleton: {
      w: '100%',
      gridColumnGap: 'var(--chakra-space-mar)',
      gridTemplateColumns: `repeat(3, 1fr)`,
    },
    itemSkeleton: {
      w: '230px',
      h: '441px',
    },
  }),
}
