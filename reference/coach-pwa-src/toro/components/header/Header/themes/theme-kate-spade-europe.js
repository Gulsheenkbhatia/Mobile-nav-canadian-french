export default {
  baseStyle: ({ theme }) => ({
    coachOneTabPDPMobile: {
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        '&:has(.one-coach-fade-in)': {
          '&.scrolled-header': {
            '& button.outletTab.active': {
              '&:before': {
                boxShadow: `8px 0px 0 ${'var(--color-ks-green)'}`,
              },
              '&:after': {
                boxShadow: `-8px 0px 0 ${'var(--color-ks-green)'}`,
              },
            },
          },
        },
      },
    },
  }),
}
