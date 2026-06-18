export default {
  parts: ['container', 'imageContainer', 'image', 'information', 'title', 'body', 'button'],
  baseStyle: ({ theme }) => ({
    container: {
      padding: 'var(--spacing-4) var(--spacing-3)',
      backgroundColor: 'var(--color-page-bg, #F0F0F0)',
    },
    card: {
      padding: 'var(--spacing-3)',
      paddingRight: 'var(--spacing-6)',
      borderRadius: 'var(--border-radius-xl)',
      flexDirection: 'row',
      border: '1px solid var(--color-neutral-light-2, #E1E1E1)',
      background: 'linear-gradient(180deg, #F7F7F7 0%, #F0F0F0 100%)',
    },
    imageContainer: {
      marginRight: 'var(--spacing-6)',
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
    },
    title: {
      ...theme.typography['text-display4-xxs'],
      marginBottom: 'var(--spacing-2)',
      fontWeight: '400',
    },
    body: {
      ...theme.typography['text-title1-s'],
      marginBottom: 'var(--spacing-3)',
      fontWeight: '400',
    },
    buttonContainer: {
      position: 'relative',
    },
    buttonUnderlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      margin: '-1.4px',
      borderRadius: 'var(--border-radius-full)',
      background:
        'linear-gradient(90deg, #FDDE5C 0%, #F8AB5C 16%, #F56A62 34%, #A176C8 51%, #759BEB 66%, #65BEB3 84%, #70DB96 100%)',
    },
    button: {
      position: 'relative',
      borderRadius: 'var(--border-radius-full)',
      padding: 'var(--spacing-3) var(--spacing-6)',
      border: '0px',
      backgroundClip: 'padding-box',
      backgroundColor: 'var(--color-white-base)',
      color: 'var(--color-background-cta-primary, #000001)',
      textAlign: 'center',
      fontFeatureSettings: "'liga' off, 'clig' off",
      fontFamily: 'var(--font-face1-extended-normal)',
      fontSize: '11.339px',
      fontStyle: 'normal',
      fontWeight: '400',
      lineHeight: 'var(--line-height-140)',
      letterSpacing: '0.227px',
      height: 'var(--spacing-8)',
      textTransform: 'none',
      zIndex: 1,
      '&:hover:not(:disabled), &:active': {
        backgroundColor: 'var(--color-white-base)',
      },
      '&:hover:disabled': {
        backgroundColor: 'var(--color-white-base)',
      },
    },
  }),
}
