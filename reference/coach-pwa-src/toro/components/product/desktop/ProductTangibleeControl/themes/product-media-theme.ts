export default {
  parts: ['tangibleeButton', 'tangibleeButtonContainer', 'tangibleeLabel'],
  variants: {
    pdpV5: ({ theme }) => ({
      tangibleeButton: {
        top: '23px',
        left: '22px',
        transform: 'none',
        padding: 'var(--spacing-3) 22px var(--spacing-3) 18px',
        boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.05)',
        background: '#000003',
        color: 'var(--color-white-base)',

        '& svg': {
          transform: 'scale(0.75)',
          '& > use': {
            stroke: 'var(--color-white-base)',
          },
        },
      },
      tangibleeButtonContainer: {
        flexDirection: 'row-reverse',
        gap: '6px',
      },
      tangibleeLabel: {
        ...theme.typography['text-cta2-xs'],
        fontSize: 'var(--text-12)',
        lineHeight: '100%',
        letterSpacing: 'var(--letter-spacing-xs)',
        textTransform: 'none',
      },
    }),
  },
}
