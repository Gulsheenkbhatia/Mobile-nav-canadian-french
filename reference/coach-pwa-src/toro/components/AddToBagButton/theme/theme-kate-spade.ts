export default {
  parts: ['button', 'buttonText', 'wrapper'],
  baseStyle: ({ theme }) => ({
    button: {
      height: '38px',
    },
    buttonText: {
      ...theme.typography['text-body1-s'],
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-140)',
      color: 'var(--color-black-base)',
    },
  }),
  variants: {
    recommendationsStack: {
      wrapper: {
        justifyContent: 'stretch',
        '& svg': {
          display: 'none !important',
        },
      },
      button: {
        borderRadius: 'var(--border-radius-full)',
        width: '100%',
        bg: 'var(--color-black-base)',
        color: 'var(--color-white-base)',
        padding: '10px var(--spacing-4) 10px 14px',
      },
      buttonText: {
        color: 'var(--color-white-base)',
        fontWeight: 500,
        fontSize: 'var(--text-16)',
      },
    },
  },
}
