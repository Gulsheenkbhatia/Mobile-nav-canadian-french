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
      color: 'var(--color-ks-green)',
    },
    iconWrapper: {
      display: 'flex',
      color: 'var(--color-secondary)',
      alignItems: 'center',
      justifyContent: 'center',
      bg: 'var(--color-dark-green)',
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
      fontFamily: 'var(--font-face3-light)',
      fontSize: '22px',
      fontWeight: 'light',
      textTransform: 'uppercase',
      color: '#470314',
      mb: 'var(--spacing-2)',
    },

    t2description: {
      fontFamily: 'var(--font-face1-light)',
      fontWeight: 'light',
      fontSize: { base: '10px', md: 'lg' },
      fontFeatureSettings: "'liga' off, 'clig' off",
      color: '#470314',
      lineHeight: '14px',
      textAlign: 'center',
      p: '0 var(--spacing-4)',
      mb: 'var(--spacing-4)',
    },

    t2button: {
      fontFamily: 'var(--font-face1-light)',
      fontSize: 'var(--text-10)',
      fontWeight: 'light',
      borderRadius: 'full',
      bg: '#470314',
      color: 'var(--color-secondary)',
      _hover: {
        bg: 'var(--color-secondary)',
      },
      textTransform: 'capitalize',
    },
  },
}
