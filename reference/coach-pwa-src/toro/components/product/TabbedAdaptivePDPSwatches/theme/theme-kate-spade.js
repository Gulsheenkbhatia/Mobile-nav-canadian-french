export default {
  baseStyle: ({ theme }) => ({
    swatchImage: {
      img: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          borderRadius: '50%',
          w: 'var(--chakra-radii-3xl)',
          h: 'var(--chakra-radii-3xl)',
        },
      },
      borderRadius: '50%',
    },
    swatchWrapper: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        w: 'var(--chakra-radii-3xl)',
        h: 'var(--chakra-radii-3xl)',
        '&.activeColorSwatch': {
          border: 'var(--border-width-s) solid var(--color-black-base)',
          p: '3px',
        },
        '&.activeColorSwatch img': {
          border: 'var(--border-width-s) solid var(--color-neutral-inactive)',
          w: 'var(--chakra-radii-2xl)',
          h: 'var(--chakra-radii-2xl)',
        },
        minWidth: 'var(--chakra-radii-3xl)',
      },
    },
  }),
}
