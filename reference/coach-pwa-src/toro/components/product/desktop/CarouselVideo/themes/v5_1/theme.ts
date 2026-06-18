export default {
  baseStyle: {
    heroImgIconStyleProps: {
      display: 'flex',
      flexDirection: 'row-reverse',
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      gap: '6px',
      cursor: 'pointer',
      '& svg': {
        width: '40px',
        height: '40px',
      },
      '& > div': {
        position: 'relative',
        '&:before': {
          position: 'absolute',
          content: '""',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: '50%',
          border: '1.25px solid var(--color-neutral-light-2, #e1e1e1)',
        },
      },
    },
  },
}
