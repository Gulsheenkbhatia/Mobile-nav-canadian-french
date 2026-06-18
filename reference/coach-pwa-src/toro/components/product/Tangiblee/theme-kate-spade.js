import RulerIconSrc from 'components/assets/ks-tangiblee.png'

export default {
  parts: ['rulerIconSrc'],
  baseStyle: ({ theme }) => ({
    rulerIconSrc: RulerIconSrc,
    tangibleWrapper: () => ({
      '.tangiblee-cta_ruler--heropdp img': {
        width: 'var(--spacing-4)',
        height: 'var(--spacing-4)',
        margin: '0',
      },
      '.tangiblee-cta_ruler--details img': {
        width: 'var(--spacing-4)',
        height: 'var(--spacing-4)',
        margin: 'var(--spacing-4) 0',
      },
      '.tangiblee-cta_title--details': {
        '&:before': {
          display: 'none',
        },
        borderBottom: '1px solid var(--color-primary)',
      },
    }),
    tangibleImage: {
      marginRight: 'var(--spacing-2)',
      '&.tangiblee-cta_ruler--heropdp': {
        marginRight: 'var(--spacing-2)',
      },
    },
    tangibleeTitle: (onHeroPDP) => ({
      color: 'var(--color-primary)',
      textTransform: `${onHeroPDP ? 'uppercase' : 'none'}`,
      ...(onHeroPDP ? theme.typography['text-cta1-xs'] : theme.typography['text-body1-m']),
    }),
    tangibleeHeroImage: ({ isMobile }) => ({
      position: 'absolute',
      right: isMobile ? '0' : 'var(--spacing-3)',
      top: 'var(--spacing-3)',
      backgroundColor: 'var(--color-white-base)',
      border: '1px solid var(--border-color-inactive)',
      padding: 'var(--spacing-2)',
      zIndex: '10',
    }),
  }),
}
