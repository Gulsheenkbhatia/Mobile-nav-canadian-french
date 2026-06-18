export default {
  baseStyle: ({ theme }) => ({
    customBadge: ({ marketingContentBadge }) => ({
      ...(marketingContentBadge && {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '&.custom-badge': {
            position: 'relative',
          },
          '&.custom-badge label::after, &.custom-badge p::after': {
            display: 'none',
          },
          '&.custom-badge::after': {
            content: '"|"',
            position: 'absolute',
            px: 0,
            top: '50%',
            right: '9px',
            transform: 'translate(0, -50%)',
          },
          '&.custom-badge:last-of-type::after': {
            display: 'none',
          },
          '&.custom-badge:first-of-type': {
            pr: '21px',
          },
        },
      }),
    }),
  }),
  variants: {
    marketingContentPdp: ({ theme }) => ({
      [`@media (max-width: ${theme.breakpoints.md})`]: {
        margin: '1px 0 0 0',
        padding: 0,
        position: 'relative',
      },
    }),
  },
}
