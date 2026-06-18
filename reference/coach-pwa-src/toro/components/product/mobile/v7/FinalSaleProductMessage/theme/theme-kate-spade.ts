export default {
  parts: ['infoMessage', 'infoMessageContainer', 'alertIconContainer', 'infoMsgWrapper'],
  baseStyle: ({ theme }) => ({
    infoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        lineHeight: 'var(--line-height-140)',
        color: 'var(--color-neutral-dark, #4A4A4A)',
      },
    },
    infoMessageContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        bg: 'var(--color-neutral-light-1, #F0F0F0)',
        padding: '20px',
        margin: 0,
      },
    },
    infoMsgWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--spacing-2)',
    },
    alertIconContainer: {
      '& svg > use[href="#icon-form-error-outline"]': {
        color: 'var(--color-neutral-dark, #4A4A4A)',
      },
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        alignSelf: 'center',
        margin: 0,
        '& svg': {
          width: 'var(--spacing-4)',
          height: 'var(--spacing-4)',
        },
      },
    },
  }),
}
