export default {
  baseStyle: {
    customBadge: ({ marketingContentBadge, isMobile }) => ({
      ...(isMobile && marketingContentBadge
        ? {
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
          }
        : {}),
    }),
  },
  variants: {
    marketingContentPdp: ({ isMobile }) => ({
      ...(isMobile
        ? {
            padding: 0,
            margin: '1px 0 0 0',
            position: 'relative',
          }
        : {}),
    }),
  },
}
