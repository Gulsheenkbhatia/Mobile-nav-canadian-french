const glassBaseStyle = {
  zIndex: 1,
  content: '""',
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '36px',
  maskComposite: 'intersect',
  backdropFilter: 'blur(2px)',
}

export default {
  baseStyle: () => ({
    marqueeBox: {
      position: 'relative',
      height: '42px',
      backgroundColor: 'var(--color-grey-80, #333)',
      borderRadius: '800px',
      overflow: 'hidden',
      '&::before': {
        ...glassBaseStyle,
        left: 0,
        backgroundImage:
          'linear-gradient(90deg, rgba(51, 51, 51, 0.70) 0%, rgba(51, 51, 51, 0.00) 100%)',
        maskImage: 'linear-gradient(to right, var(--color-grey-80, #333) 60%, transparent 100%)',
      },
      '&::after': {
        ...glassBaseStyle,
        right: 0,
        backgroundImage:
          'linear-gradient(270deg, rgba(51, 51, 51, 0.70) 0%, rgba(51, 51, 51, 0.00) 100%)',
        maskImage: 'linear-gradient(to left, var(--color-grey-80, #333) 60%, transparent 100%)',
      },
      '&:has(+ a[data-qa=part_of_bundle_cta])': {
        marginBottom: '46px',
      },
    },
    marqueeTrack: {
      display: 'inline-flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      height: 'inherit',
      width: 'max-content',
      willChange: 'transform',
      '&.animate': {
        animation: 'marquee 25s linear infinite',
        '&:hover': {
          animationPlayState: 'paused',
        },
      },
      '&:not(:has(.animate))': {
        display: 'flex',
        marginX: 'auto',
      },
      '@keyframes marquee': {
        from: {
          transform: 'translate3d(0, 0, 0)',
        },
        to: {
          transform: 'translate3d(-50%, 0, 0)',
        },
      },
    },
    marqueeItem: {
      position: 'relative',
      flexShrink: 0,
      paddingRight: '13px',
      paddingLeft: 'var(--spacing-3, 12px)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 'var(--spacing-3, 12px)',
        bottom: 'var(--spacing-3, 12px)',
        right: 0,
        width: '1px',
        backgroundImage:
          'linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, var(--color-white-base, #fff), 50%, rgba(255, 255, 255, 0.01) 100%)',
        borderRadius: '800px',
        opacity: '0.5',
      },
      '&:last-child': {
        '&::before': {
          display: 'none',
        },
      },
    },
  }),
}
