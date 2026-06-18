export default {
  variants: {
    pdpV4Enhanced: ({ theme }) => ({
      swatchImage: {
        img: {
          [`@media (max-width: ${theme.breakpoints.sm})`]: {
            borderRadius: 'none',
            w: '54px',
            h: '54px',
          },
        },
        borderRadius: 'none',
      },
      swatchWrapper: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          w: '42px',
          h: '42px',
          '&.activeColorSwatch': {
            border: 'none',
            p: 0,
          },
          '&.activeColorSwatch img': {
            border: 'none',
            w: '54px',
            h: '54px',
          },
          minWidth: '100%',
        },
      },
    }),
  },
}
