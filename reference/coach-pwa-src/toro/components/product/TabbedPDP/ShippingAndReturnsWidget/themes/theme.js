export default {
  baseStyle: ({ theme }) => ({
    shippingAndReturnLabel: {
      ...theme.typography['text-body1-s'],
      color: 'var(--color-black-base)',
      fontWeight: 400,
      fontStyle: 'normal',
      lineHeight: 'var(--line-height-xl)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontSize: 'var(--text-12)',
      textAlign: 'center',
      display: 'inline-flex',
      justifyContent: 'center',
      textTransform: 'capitalize',
    },
    infoIcon: {
      marginLeft: 'var(--spacing-2)',
    },
  }),
}
