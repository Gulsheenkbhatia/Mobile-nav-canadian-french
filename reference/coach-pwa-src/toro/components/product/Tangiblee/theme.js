import RulerIconSrc from 'components/assets/ruler.png'

export default {
  parts: [
    'tangibleSkeleton',
    'tangibleWrapper',
    'tangibleImage',
    'tangibleText',
    'rulerIconSrc',
    'tangibleeHeroImage',
    'tangibleeContainer',
    'tangibleeTitle',
  ],
  baseStyle: () => ({
    rulerIconSrc: RulerIconSrc,
    tangibleSkeleton: {
      bg: 'var(--neutrals-color-neutral-light)',
      mt: '5px',
    },
    tangibleWrapper: () => ({
      mb: '10px',
      '.tangiblee-cta_ruler--heropdp img': {
        width: '25px',
        height: '11px',
      },
      '.tangiblee-cta_ruler--details img': {
        width: '25px',
        height: '11px',
      },
      '.tangiblee-cta_title--details:before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        height: '1px',
        width: '100%',
        background: '#000',
        bottom: '-3px',
        left: '0',
      },
    }),
    tangibleeContainer: () => ({
      '.plusIcon': {
        display: 'none',
      },
    }),
    tangibleImage: {
      marginRight: '3px',
    },
    tangibleText: {
      fontSize: '12px',
    },
    tangibleeTitle: (onHeroImage) => ({
      fontSize: onHeroImage ? 'var(--text-10)' : 'var(--text-14)',
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: '400',
      textTransform: `${onHeroImage ? 'uppercase' : 'none'}`,
      letterSpacing: onHeroImage ? 'var(--letter-spacing-xl)' : 'var(--letter-spacing-xs)',
      color: 'var(--color-primary)',
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
  }),
  variants: {
    buttonCTA: ({ theme }) => ({
      tangibleWrapper: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '20px 0 0',
          backgroundColor: 'var(--color-black-base)',
          padding: 'var(--spacing-3) var(--spacing-6)',
          borderRadius: '2000px',
          '& .chakra-image': {
            display: 'none',
          },
          '.tangiblee-cta > div': {
            justifyContent: 'center',
          },
        },
      }),
      tangibleeTitle: () => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          color: 'var(--color-white-base)',
          fontSize: 'var(--text-12)',
          fontFamily: 'var(--font-face1-normal)',
          lineHeight: 1,
          letterSpacing: 'var(--letter-spacing-xl)',
          textTransform: 'uppercase',
        },
      }),
      tangibleeContainer: () => ({
        '&.tangiblee-cta': {
          display: 'block',
        },
        '& svg': {
          display: 'none',
        },
        '.plusIcon': {
          display: 'block',
          path: { fill: 'var(--color-white-base)' },
          marginLeft: 'var(--spacing-2)',
        },
      }),
    }),
  },
}
