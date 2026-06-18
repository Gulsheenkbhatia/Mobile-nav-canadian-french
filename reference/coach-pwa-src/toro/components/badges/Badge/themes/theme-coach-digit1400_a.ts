export default {
  baseStyle: ({ theme }) => ({
    customBadge: ({ marketingContentBadge }) => ({
      ...(marketingContentBadge && {
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          '&.custom-badge label::after, &.custom-badge p::after': {
            content: '"|"',
            position: 'absolute',
            px: 0,
            top: '50%',
            right: '-11px',
            transform: 'translate(0, -50%)',
          },
          '&.custom-badge:last-of-type label::after, &.custom-badge:last-of-type p::after': {
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
        margin: '3px 0 0 0',
        lineHeight: 1,
        padding: 0,
        position: 'relative',
        '&.custom-badge-content label, &.custom-badge-content label a, &.custom-badge-content p': {
          lineHeight: 1,
          padding: 0,
          textTransform: 'uppercase',
          fontSize: 'var(--text-12)',
        },
      },
    }),
  },
}
