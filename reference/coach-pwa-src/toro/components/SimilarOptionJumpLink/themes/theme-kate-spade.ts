export default {
  baseStyle: ({ theme }) => ({
    similarOptionsTitle: {
      ...theme.typography['text-display1-s'],
      fontFamily: 'ITCNewBaskervilleRoman, var(--font-face2-normal)',
      paddingTop: '22px',
      paddingBottom: 'var(--spacing-4)',
      fontWeight: 400,
      color: 'var(--color-white-base)',
      letterSpacing: 'var(--letter-spacing-s)',
      lineHeight: 'var(--line-height-120)',
      textAlign: 'center',
    },
    viewMoreSimilarButton: {
      borderRadius: '130px',
      border: '1px solid var(--color-neutral-light-2)',
      background: 'var(--color-white-base)',
      padding: 'var(--spacing-3) 18px',
      marginTop: 'var(--spacing-4)',
      fontSize: 'var(--text-14)',
      fontWeight: 500,
      lineHeight: 'var(--line-height-135)',
    },
    viewMoreButtonText: {
      ...theme.typography['text-body2-m'],
      fontWeight: '500',
      marginTop: 0,
      textTransform: 'none',
    },
  }),
  variants: {
    pdpv6: ({ theme }) => ({
      similarOptionJumpLinkText: {
        ...theme.typography['text-display2-s'],
        fontWeight: 400,
      },
      similarOptionJumpLinkButtom: {
        ...theme.typography['text-body2-l'],
        height: '40px',
        fontWeight: 500,
      },
      viewMoreOverlay: {
        maxHeight: 'min(380px, calc(100% - 10px))',
      },
      similarOptionsTitle: {
        ...theme.typography['text-display2-s'],
        fontWeight: 400,
      },
      viewMoreSimilarButton: {
        textSize: 'var(--text-16)',
        fontWeight: 500,
        height: '40px',
      },
      viewMoreButtonText: {
        ...theme.typography['text-body2-l'],
        fontWeight: 500,
      },
    }),
  },
}
