export default {
  baseStyle: () => ({
    mainWrapper: {
      mt: 'var(--spacing-2)',
      justifyContent: 'space-between',
      '& .scrollableContent': {
        gap: '11px',
        // this is the width of 7 swatches as per figma, the size is static
        width: '402px',
      },
      '& .swatch-wrapper': {
        justifyContent: 'center',
      },
      '& .left-arrow,& .right-arrow': {
        position: 'static',
      },
      '& .left-arrow': {
        marginRight: '4px',
      },
      '& .right-arrow': {
        marginLeft: '4px',
      },
    },
    containerWrapper: {
      maxWidth: '100%',
      marginBottom: '18px',
    },
    wrapper: {
      '&::before, &::after': {
        display: 'none',
      },
    },
    colorLabel: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-125)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
  }),
}
