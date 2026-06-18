export default {
  parts: ['alertIconContainer', 'infoMessageContainer', 'infoMessage', 'infoMsgWrapper'],
  baseStyle: ({ theme }) => ({
    alertIconContainer: {
      margin: 'auto',
      position: 'relative',
      paddingLeft: '20px',
      '&::before': {
        content: '"i"',
        position: 'absolute',
        top: '50%',
        left: 0,
        transform: 'translateY(-50%)',
        width: 'var(--spacing-3)',
        height: 'var(--spacing-3)',
        fontSize: '8px',
        color: '#cc0000',
        textAlign: 'center',
        verticalAlign: 'middle',
        border: 'var(--border-width-s) solid #cc0000',
        borderRadius: 'var(--border-radius-full)',
      },
      '& svg': {
        display: 'none',
      },
    },
  }),
  variants: {
    alert: () => ({
      infoMessageContainer: {
        background: 'var(--color-white-base)',
        mb: '18px',
        p: 'var(--spacing-4) var(--spacing-3)',
        borderRadius: 'var(--border-radius-s)',
      },
      infoMsgWrapper: {
        gap: '10px',
      },
      alertIconContainer: {
        margin: 0,
        height: 'var(--spacing-4)',
        width: 'var(--spacing-4)',
        pl: 'var(--spacing-0)',
        alignSelf: 'center',
        '&::before': {
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
      },
      infoMessage: {
        fontFamily: 'var(--font-face1-medium)',
        fontWeight: 500,
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        ml: 'var(--spacing-0)',
      },
    }),
  },
}
