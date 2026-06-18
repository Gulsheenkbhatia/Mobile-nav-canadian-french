export default {
  baseStyle: ({ theme }) => ({
    ErrorMessageContainer: (isSticky) => ({
      mt: isSticky ? theme.space.m : '0',
      mb: isSticky ? '20px' : '0',
    }),
  }),
}
