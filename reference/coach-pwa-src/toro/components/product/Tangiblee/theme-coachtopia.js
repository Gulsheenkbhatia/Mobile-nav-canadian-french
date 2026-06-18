import RulerIconSrc from 'components/assets/ks-tangiblee.png'

export default {
  parts: [
    'rulerIconSrc',
    'tangibleWrapper',
    'tangibleImage',
    'tangibleeTitle',
    'tangibleeHeroImage',
    'tangibleeContainer',
  ],
  baseStyle: ({ theme }) => ({
    rulerIconSrc: RulerIconSrc,
    tangibleeContainer: () => ({
      display: 'inline-block',
      my: 'var(--spacing-2)',
      width: '100%',
      '@media (max-width: 769px)': {
        '&.tangiblee-cta': {
          display: 'inline-block',
        },
      },
    }),
    tangibleWrapper: () => ({
      '.tangiblee-cta_title': {
        fontFamily: theme.fontFamily.primaryExtraBold,
        fontSize: theme.fontSizes.xxs,
        letterSpacing: theme.letterSpacings.lg,
        lineHeight: theme.lineHeights.m,
      },
      '.tangiblee-cta_ruler--heropdp img': {
        width: theme.space.m,
        height: theme.space.m,
        margin: '0',
      },
      '.tangiblee-cta_ruler--details img': {
        width: theme.space.m,
        height: theme.space.m,
        margin: `${theme.space.m} 0`,
      },
      '.tangiblee-cta_title--details': {
        '&:before': {
          display: 'none',
        },
        borderBottom: `1px solid ${theme.colors.main.primary}`,
      },
    }),
    tangibleImage: {
      marginRight: theme.space.xs,
      '&.tangiblee-cta_ruler--heropdp': {
        marginRight: '6px',
      },
    },
    tangibleeTitle: (onHeroPDP) => ({
      color: 'var(--color-primary)',
      textTransform: `${onHeroPDP ? 'uppercase' : 'none'}`,
      ...(onHeroPDP ? theme.typography['text-cta1-xs'] : theme.typography['text-body1-m']),
    }),
    tangibleeHeroImage: ({ isMobile }) => ({
      position: 'absolute',
      right: isMobile ? '5px' : '15px',
      top: '15px',
      backgroundColor: '#fff',
      border: '1px solid #D8D8D8',
      borderRadius: '2px',
      padding: 'var(--spacing-1) var(--spacing-2)',
      zIndex: '10',
    }),
    tangibleIcon: {
      width: '16',
      height: '16',
    },
  }),
  variants: {
    buttonCTA: ({ theme }) => ({
      tangibleeContainer: () => ({
        '&.tangiblee-cta': {
          display: 'block',
        },
        '& svg': {
          display: 'none',
        },
        '.plusIcon': {
          display: 'block',
          marginLeft: 'var(--spacing-2)',
        },
        '& .tangiblee-cta_title--details': {
          ...theme.typography['text-cta1-m'],
        },
      }),
    }),
  },
}
