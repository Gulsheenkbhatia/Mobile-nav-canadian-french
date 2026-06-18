export default {
  parts: ['bannerWrapper', 'bannerWrapperText', 'iconWrapper'],

  baseStyle: {
    bannerWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      width: '100%',
      border: 'none',
      background: 'transparent',
      textAlign: 'left',
    },
    mt: {
      marginTop: 'calc(var(--spacing-4) * -1)',
    },
    bannerWrapperText: {
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 'var(--font-weight-normal)',
      letterSpacing: '0.025rem',
      lineHeight: 'var(--line-height-sm)',
      fontSize: 'var(--text-14)',
    },
    iconWrapper: {
      display: 'flex',
      color: 'var(--color-secondary)',
      alignItems: 'center',
      justifyContent: 'center',
      bg: 'var(--color-primary)',
      w: '42px',
      h: '42px',
      borderRadius: '100%',
    },

    t2container: {
      bgSize: 'cover',
      bgPosition: 'center',
      bgRepeat: 'no-repeat',
      height: '180px',
    },
    t2content: {
      color: 'white',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 'var(--spacing-6)',
    },
    t2title: {
      fontSize: { base: '2xl', md: '4xl' },
      fontWeight: 'bold',
    },
    t2description: {
      fontSize: { base: '10px', md: 'lg' },
      lineHeight: '14px',
      textAlign: 'center',
      mb: 'var(--spacing-4)',
    },
    t2button: {
      size: 'lg',
      borderRadius: 'full',
      bg: 'var(--color-primary)',
      color: 'var(--color-secondary)',
      _hover: {
        bg: 'var(--color-secondary)',
      },
    },
  },
}
