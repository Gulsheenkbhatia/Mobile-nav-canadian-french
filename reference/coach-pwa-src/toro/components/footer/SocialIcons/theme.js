export default {
  parts: ['flexSocialLinks', 'boxSocialLinks'],
  baseStyle: ({ theme }) => ({
    flexSocialLinks: (isDesktop) => ({
      padding: 'inherit',
      margin: `${isDesktop ? '10px 0px' : 's'}`,
      py: '1',
      justifyContent: {
        base: 'center',
        md: 'flex-start',
      },
    }),
    boxSocialLinks: (divider) => {
      const dividerProps = divider
        ? {
            borderLeft: divider,
            pl: {
              base: theme.space.l,
              md: theme.space.s,
              lg: theme.space.l,
            },
          }
        : {}
      return {
        mr: {
          base: theme.space.lm,
          md: theme.space.s,
          lg: theme.space.lm,
        },
        '&:last-child': {
          marginRight: 0,
        },
        ...dividerProps,
      }
    },
  }),
}
