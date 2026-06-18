export default {
  parts: ['variationMessagesContainer'],
  baseStyle: ({ theme }) => ({
    variationMessagesContainer: {
      position: 'static',
      width: '100%',
      transform: 'none',
      '& .product-variation-message-error-container': {
        maxWidth: '100%',
        marginTop: 0,
        marginBottom: '18px',
        borderRadius: 'var(--border-radius-s)',
        flexDirection: 'column',
        background: 'var(--color-neutral-light-1)',
        boxShadow: 'none',
        gap: 'var(--spacing-3)',
        padding: '0',
        '&:has(.product-info-message-alert)': {
          padding: 'var(--spacing-4) 70px var(--spacing-4) 14px',
        },
        '& > div.product-info-message': {
          width: '100%',
          background: 'var(--color-neutral-light)',
          borderRadius: 'var(--border-radius-s)',
          boxShadow: '0px 12px 20px 0px rgba(0, 0, 0, 0.05)',
          padding: '14px 28px 14px 20px',
        },
      },
      '& .product-info-message-alert > div .chakra-text': {
        ...theme.typography['text-body2-m'],
      },
    },
    '& .atb-variation-messages': {
      marginBottom: '20px',
    },
    ErrorMessageContainer: () => ({
      width: '100%',
      maxWidth: '100%',
      background: 'var(--color-neutral-light)',
      padding: '15px var(--spacing-4) var(--spacing-4) var(--spacing-4)',
      '&:after': {
        display: 'none',
      },
    }),
    customMessageWrapper: {
      padding: 'var(--spacing-0)',
    },
    infoMessage: {
      color: 'var(--color-black-base)',
      fontSize: 'var(--text-14)',
      fontFamily: 'var(--font-face1-medium)',
      lineHeight: 'var(--line-height-125)',
    },
  }),
}
