const SizeGuideTheme = {
  variants: {
    pdpV5: ({ theme }) => ({
      sizeGuideContainer: () => ({
        m: 0,
      }),
      sizeGuideButton: {
        ...theme.typography['text-cta2-s'],
        height: '48px',
        width: '199px',
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 18px',
        borderRadius: '130px',
        background: 'var(--color-black-base)',
        color: 'var(--color-white-base)',
        fontSize: 'var(--text-14)',
        lineHeight: '16px',
        letterSpacing: '0.28px',
        textTransform: 'none',
        '&:hover, &:active': {
          background: 'var(--color-black-base)',
          color: 'var(--color-white-base) !important',
        },
        '&:focus': {
          border: '1px solid var(--color-neutral-light-2)',
        },
      },
    }),
  },
}

export default SizeGuideTheme
