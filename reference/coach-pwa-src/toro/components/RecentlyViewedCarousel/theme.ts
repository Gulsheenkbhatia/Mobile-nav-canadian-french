export default {
  baseStyle: ({ theme }) => ({
    rvContainer: {
      backgroundColor: '#f0f0f0',
      flexDirection: 'column',
      padding: '21px 0 20px',
    },
    rvTitle: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-16)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-s)',
      marginBottom: 'var(--spacing-2)',
      paddingX: 'var(--spacing-4)',
    },
    rvCarousel: {
      overflowX: 'auto',
      padding: '0 var(--spacing-4)',
      '-ms-overflow-style': 'none' /* IE and Edge */,

      '&::-webkit-scrollbar': {
        display: 'none' /* Chrome, Safari and Opera */,
      },

      '& > .rvImpressionSensor': {
        marginRight: '10px',
        width: '24.7vw',
        '&:last-child': {
          marginRight: 0,
        },
      },
      '.rvImpressionSensor': {
        display: 'flex',
        flexShrink: '0',
        flexDirection: 'column',
        position: 'relative',
      },
    },
    rvTitleScrollable: {
      'scrollbar-width': 'none' /* Firefox */,
    },
    rvTitleNonScrollable: {
      'scrollbar-width': 'thin',
    },
    rvImage: {
      objectFit: 'contain',
    },
    rvBadgeText: {
      position: 'absolute',
      top: 0,
      width: '100%',
      backgroundColor: 'var(--color-white-60)',
      borderRadius: '40px',
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 400,
      fontSize: 'var(--text-10)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-xl)',
      textAlign: 'center',
      padding: 'var(--spacing-1)',
      backdropFilter: 'blur(5px)',
      '&::after': {
        content: '""',
        position: 'absolute',
        display: 'block',
        width: '10px',
        height: '10px',
        backdropFilter: 'blur(5px)',
        margin: 'auto',
        left: 0,
        right: 0,
        top: '22px',
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid var(--color-white-60)',
      },
    },
    rvPromo: {
      color: 'var(--color-success-primary)',
      fontFamily: 'var(--font-face1-bold)',
      fontSize: 'var(--text-12)',
      letterSpacing: 'var(--letter-spacing-xs)',
      lineHeight: 'var(--line-height-s)',
      marginTop: 'var(--spacing-1)',
      textAlign: 'center',
      wordWrap: 'break-word',
      whiteSpace: 'normal',
    },
  }),
}
