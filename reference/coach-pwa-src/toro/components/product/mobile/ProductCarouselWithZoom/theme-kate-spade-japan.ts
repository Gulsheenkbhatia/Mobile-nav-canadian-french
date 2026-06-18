export default {
  parts: ['container'],
  baseStyle: () => ({
    container: {
      '& .splide__arrows': {
        h: 0,
        width: '100%',
        position: 'absolute',
        top: '50%',
        display: 'flex',
        justifyContent: 'space-between',
        '& .splide__arrow--prev': {
          left: '0',
          '& svg': {
            transform: 'rotate(180deg)',
          },
        },
        '& .splide__arrow--next': {
          right: '0',
        },
        '& .splide__arrow': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          padding: 0,
          border: 'none',
          background: 'transparent',
          position: 'relative',
          outline: 'none',
          borderRadius: '72px',
          '&:focus': {
            outline: 'none',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '44px',
            height: '34px',
            borderRadius: 'var(--border-radius-full)',
            border: '1px solid var(--color-white-base)',
            background: 'rgba(250, 250, 250, 0.70)',
            backdropFilter: 'blur(6px)',
            zIndex: -1,
          },
          '& svg': {
            height: '20px',
            width: '20px',
            fill: 'var(--color-white-10)',
            outline: 0,
          },
        },
      },
    },
  }),
}
