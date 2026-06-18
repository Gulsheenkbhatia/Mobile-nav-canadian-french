export default {
  baseStyle: ({ theme }) => ({
    // container styles
    UGCContainerRoot: {
      position: 'relative',
      overflow: 'hidden',
      // change the height based on figma
      minHeight: '820px',
      paddingBottom: '112px',
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
            ...theme.typography['text-display4-xl'],
            color: 'var(--color-black-base, #000)',
            marginBottom: 'var(--spacing-4)',
          },
          '& .at-body-text': {
            ...theme.typography['text-display3-xxs'],
            color: 'var(--color-black-base, #000)',
          },
        },
        '& .links-container a': {
          ...theme.typography['text-cta2-xs'],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          alignSelf: 'stretch',
          minWidth: '110px',
          padding: '10px 18px',
          borderRadius: '130px',
          border: '1px solid var(--Neutrals-color-neutral-light-2, #E1E1E1)',
          background: 'var(--color-white, #FFF)',
          lineHeight: '28px',
          color: 'var(--cta-color-desktop, var(--color-primary))',
          transition: 'all 0.3s ease',

          '&:hover': {
            background: 'var(--color-background-cta-focus, var(--color-neutral-medium))',
          },
        },
      },
    },

    // slider styles
    sliderContainer: {
      maxWidth: '100vw',
      '& .section-slider-container': {
        padding: 'var(--spacing-6) 0',
        '@media (max-height: 800px)': {
          padding: 'var(--spacing-3) 0',
        },
      },
    },
    imageContainer: {
      borderRadius: '24px',
      overflow: 'hidden',
    },
    imageOrVideo: {
      objectFit: 'cover',
      width: '307px',
      height: '546px',
      cursor: 'pointer',
      '@media (max-height: 800px)': {
        width: '216px',
        height: '383px',
      },
    },

    // skeleton styles
    rootContainerSkeleton: {
      w: '100vw',
      minHeight: '820px',
      py: 'unset',
    },
    headerGridSkeleton: {
      gridColumnGap: 'var(--chakra-space-mar)',
      gridTemplateColumns: '1fr',
      width: '513px',
    },
    headerSkeleton: {
      h: '138px',
    },
    titleSkeleton: {
      w: '100%',
      mb: 'var(--spacing-2)',
      h: '40px',
    },
    subtitleSkeleton: {
      w: '100%',
      mb: 'var(--spacing-6)',
      h: '16px',
    },
    buttonSkeleton: {
      w: '100%',
      h: '50px',
    },
    gridWrapperSkeleton: {
      mt: 'var(--spacing-10)',
      mb: 'var(--spacing-24)',
    },
    gridSkeleton: {
      w: '100%',
      gridColumnGap: 'var(--chakra-space-mar)',
      gridTemplateColumns: `repeat(5, 1fr)`,
    },
    itemSkeleton: {
      w: '307px',
      h: '546px',
    },
  }),
}
