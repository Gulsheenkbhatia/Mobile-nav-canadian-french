export default {
  baseStyle: ({ theme }) => ({
    infoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        marginLeft: '0',
        lineHeight: 'var(--line-height-140)',
        color: 'var(--color-black-base)',
      },
    },
    alertIconContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        alignSelf: 'flex-start',
        marginTop: '3px',
        '& svg': {
          marginRight: 'var(--spacing-2)',
          width: 'var(--spacing-3)',
          height: 'var(--spacing-3)',
        },
      },
    },
    infoMessageContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mb: 'var(--spacing-3)',
        padding: '13px var(--spacing-3) 14px',
        backgroundColor: '#f7f7f7', // missing in the design token
        borderRadius: 'var(--border-radius-s)',
      },
    },
  }),
}
