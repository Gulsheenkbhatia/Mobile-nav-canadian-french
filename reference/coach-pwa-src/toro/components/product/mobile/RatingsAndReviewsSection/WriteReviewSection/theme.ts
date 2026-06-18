export default {
  parts: ['container', 'imageContainer', 'image', 'information', 'title', 'body', 'button'],
  baseStyle: ({ theme }) => ({
    container: {
      padding: 'var(--spacing-4) var(--spacing-3)',
      backgroundColor: 'var(--color-neutral-light-1, #F0F0F0)',
    },
    imageContainer: {
      marginRight: 'var(--spacing-8)',
    },
    image: {
      height: '153px',
      width: '153px',
      aspectRatio: '1',
      objectFit: 'cover',
      borderRadius: 'var(--border-radius-xl)',
    },
    information: {
      flexDirection: 'column',
      justifyContent: 'center',
      marginRight: 'var(--spacing-4)',
    },
    title: {
      ...theme.typography['text-display4-xxs'],
      fontWeight: '700',
      marginBottom: 'var(--spacing-2)',
    },
    body: {
      ...theme.typography['text-title1-s'],
      fontWeight: '400',
      marginBottom: 'var(--spacing-3)',
    },
    buttonContainer: {
      position: 'relative',
    },
    button: {
      position: 'relative',
      borderRadius: 'var(--border-radius-full)',
      padding: '10px var(--spacing-6)',
      border: '1.4px solid var(--color-neutral-light-2, #E1E1E1)',
      backgroundClip: 'padding-box',
      backgroundColor: 'var(--color-white-base)',
      color: 'var(--color-background-cta-primary, #000001)',
      textAlign: 'center',
      fontFeatureSettings: "'liga' off, 'clig' off",
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: '11px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 'var(--line-height-140)',
      letterSpacing: '0.2px',
      height: 'var(--spacing-8)',
      textTransform: 'none',
      zIndex: 1,
      '&:hover:not(:disabled), &:active': {
        backgroundColor: 'var(--color-white-base)',
      },
      '&:hover:disabled': {
        backgroundColor: 'var(--color-white-base)',
      },
      '@media (max-width: 430px)': {
        padding: '10px var(--spacing-4)',
      },
    },
  }),
}
