export default {
  baseStyle: ({ theme }) => ({
    ErrorMessageContainer: (isSticky) => ({
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        mt: isSticky ? 'var(--spacing-2)' : 0,
        mb: 0,
        '&:empty': {
          m: 0,
        },
      },
    }),
    infoMessage: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontStyle: 'normal',
        fontWeight: '400',
        color: 'var(--color-black-base)',
      },
    },
  }),
}
