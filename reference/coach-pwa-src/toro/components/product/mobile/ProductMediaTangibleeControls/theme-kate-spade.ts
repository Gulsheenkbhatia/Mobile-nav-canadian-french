export default {
  parts: [
    'tangibleeButtonWrapper',
    'tangibleeButton',
    'tangibleeButtonContainer',
    'tangibleeLabel',
  ],
  baseStyle: {},
  variants: {
    vpc: ({ theme }) => ({
      tangibleeButton: {
        bottom: '0',
        height: '52px',
        paddingX: 'var(--spacing-4)',
        borderRadius: 'var(--border-radius-m)',
      },
      tangibleeLabel: {
        ...theme.typography['text-body2-l'],
        textTransform: 'none',
        fontWeight: '500',
        fontSize: 'var(--text-16)',
        whiteSpace: 'nowrap',
      },
      plusIcon: {
        display: 'none',
      },
    }),
  },
}
