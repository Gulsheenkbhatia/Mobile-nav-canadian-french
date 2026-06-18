export default {
  baseStyle: {
    rotatingBannerContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      gap: '6px',
      p: '28px var(--spacing-2) 21px',
      mb: 0,
      h: '73px',
      borderTop: '1px solid var(--color-neutral-light-2)',
      '& .klarna-container': {
        background: 'inherit !important',
        flexWrap: 'nowrap',
        p: 0,
      },
      '& .klarna-container .klarna-details .klarna-learn-more': {
        ml: 'var(--spacing-1) !important',
      },
    },
    slide: {
      background: 'inherit',
    },
  },
  variants: {
    horizontal: () => ({
      rootContainer: {
        display: 'flex',
        alignItems: 'center',
        width: 'auto',
        gap: '6px',
        p: '28px var(--spacing-2) 21px',
        mb: 0,
        borderTop: '1px solid var(--color-neutral-light-2)',
        '& .klarna-container': {
          background: 'inherit !important',
          flexWrap: 'nowrap',
          p: 0,
        },
        '& .klarna-container .klarna-details .klarna-learn-more': {
          ml: 'var(--spacing-1) !important',
        },
      },
      rotatingBannerContainer: {
        h: '27px',
        margin: 0,
        borderTop: 'none',
        p: 0,
        display: 'block',
        '@media(max-width: 380px)': {
          h: '33px',
        },
      },
      slide: {
        background: 'inherit',
      },
      slideActive: {
        animation: 'slideInHorizontal 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
      },
      slidePrev: {
        animation: 'slideOutHorizontal 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
      },
      slideActiveLeft: {
        opacity: 1,
        zIndex: 1,
        animation: 'slideInHorizontalLeft 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
      },
      slidePrevRight: {
        opacity: 1,
        animation: 'slideOutHorizontalRight 1s cubic-bezier(0.49, 0, 0.47, 0.98) forwards',
      },
      pauseButton: {
        '& svg': {
          transform: 'scale(2)',
          '& path:first-of-type': {
            fill: 'transparent',
          },
        },
      },
    }),
  },
}
