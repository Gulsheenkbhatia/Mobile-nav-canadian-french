export default {
  parts: [
    'container',
    'header',
    'title',
    'description',
    'grid',
    'item',
    'itemDetails',
    'icon',
    'itemTitle',
    'itemValue',
    'openImageButton',
    'imageWrapper',
    'videoEmbed',
  ],

  baseStyle: ({ theme }) => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      width: '100%',
      background: 'var(--color-neutral-light-1)',
      padding: 'var(--spacing-10) 20px 20px 20px',
    },

    header: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'center',
    },

    title: {
      ...theme.typography['text-display1-l'],
      fontWeight: 'normal',
      textAlign: 'center',
      color: 'var(--color-black-base)',
      fontFeatureSettings: "'liga' off, 'clig' off",
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      maxWidth: '210px',
    },

    description: {
      ...theme.typography['text-body1-l'],
      fontWeight: 'normal',
      textAlign: 'center',
      color: 'var(--color-black-base)',
      fontFeatureSettings: "'liga' off, 'clig' off",
    },

    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
    },

    item: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '10px 0',
      gap: '10px',
    },

    itemDetails: {
      display: 'flex',
      flexDirection: 'column',
    },

    icon: {
      width: 'var(--spacing-10)',
      height: 'var(--spacing-10)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '& svg': {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
      },
    },
    itemTitle: {
      ...theme.typography['text-body2-l'],
      fontWeight: 500,
      textAlign: 'center',
      color: 'var(--color-black-base)',
      fontFeatureSettings: "'liga' off, 'clig' off",
    },

    itemValue: {
      ...theme.typography['text-body1-m'],
      fontWeight: 'normal',
      textAlign: 'center',
      color: 'var(--color-black-base)',
      fontFeatureSettings: "'liga' off, 'clig' off",
      whiteSpace: 'pre-line',
    },

    openImageButton: {
      ...theme.typography['text-title2-s'],
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-black-base)',
      borderRadius: '100px',
      fontWeight: 500,
      padding: 'var(--spacing-4)',
      textTransform: 'capitalize',
      width: '190px',
      height: '60px',
    },

    imageWrapper: {
      alignSelf: 'stretch',
      width: '100%',
      borderRadius: 'var(--border-radius-m)',
      overflow: 'hidden',
      boxShadow: '0 0 0 1px var(--color-neutral-light-3)',
      backgroundColor: 'var(--color-neutral-light-1)',
      isolation: 'isolate',

      '& img': {
        display: 'block',
        width: '100%',
        height: 'auto',
        verticalAlign: 'top',
        borderRadius: 'inherit',
      },
    },

    videoEmbed: {
      alignSelf: 'stretch',
      width: '100%',
      maxWidth: '100%',
      p: '0',
      boxSizing: 'border-box',
      position: 'relative',

      '& > .carousel-video-wrapper': {
        width: '100%',
        display: 'block',
      },
    },
  }),
}
