export default {
  baseStyle: ({ theme }) => ({
    contentAreaTwo: {
      '&.content-areaTwo': {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          py: '0 !important',
          '& article': {
            py: '0 !important',
          },
        },
      },
    },
    contentDivider: {
      '&::before': {
        display: 'none',
      },
    },
  }),
}
