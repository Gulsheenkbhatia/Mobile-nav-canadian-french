export default {
  baseStyle: ({ theme }) => ({
    rvContainer: {
      backgroundColor: 'var(--color-product-image-bg)',
    },
    rvTitle: {
      fontFamily: 'var(--font-face2-normal)',
      fontSize: 'var(--text-20)',
      lineHeight: 'var(--line-height-s)',
      fontWeight: '400',
    },
    rvBadgeText: {
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-140)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      '&::after, &::before': {
        content: '""',
        position: 'absolute',
        display: 'block',
        margin: 'auto',
        left: '0px',
        right: '0px',
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        backdropFilter: 'none',
      },
      '&::after': {
        width: '11px',
        height: '11px',
        top: '25px',
        borderTop: '7px solid var(--color-white-base)',
      },
      '&::before': {
        width: '9px',
        height: '9px',
        top: '26px',
        borderTop: '7px solid rgba(0, 0, 0, 0.05)',
      },
    },
  }),
}
