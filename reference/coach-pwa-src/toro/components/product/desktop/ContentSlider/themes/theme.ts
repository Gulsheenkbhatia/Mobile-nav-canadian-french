export default {
  baseStyle: () => ({
    wrapper: {
      width: '100vw',
      maxWidth: '62.5%',
      margin: '0 auto',
      paddingBottom: '100px',
      '& article': {
        '&:has( .desk-stack-4), &:has( ul.nav-tabs)': {
          maxWidth: '100%',
        },
        '&:has( ul.nav-tabs)': {
          '& article section.media-asset-wrapper > div:has(video)': {
            w: '80%',
            m: '0 auto',
          },
        },
        '& img': {
          maxHeight: '100%',
          objectFit: 'cover',
        },
      },
    },
  }),
}
