export default {
  parts: [
    'tangibleImage',
    'tangibleWrapper',
    'tangibleeButtonContent',
    'tangibleeTitle',
    'tangibleeContainer',
  ],
  baseStyle: ({ theme }) => ({
    tangibleWrapper: () => ({
      height: '48px',
      minHeight: '48px',
      maxHeight: '48px',
      minWidth: '199px',
      width: 'fit-content',
      padding: '10px var(--spacing-6) 10px 18px',
      borderRadius: '130px',
      background: 'var(--color-black-base)',
    }),
    tangibleeContainer: () => ({
      display: 'flex',
      height: '100%',
      width: '100%',
    }),
    tangibleeButtonContent: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '6px',
      '& .plusIcon': {
        m: '3px',
        '& path': {
          stroke: 'var(--color-white-base)',
        },
      },
    },
    tangibleeTitle: () => ({
      ...theme.typography['text-cta2-s'],
      lineHeight: '16px',
      letterSpacing: '0.28px',
      color: 'var(--color-white-base)',
      fontSize: 'var(--text-14)',
      textTransform: 'none',
      fontWeight: '400',
    }),
    tangibleImage: {
      display: 'none',
    },
  }),
  variants: {
    vpc: ({ theme }) => ({
      tangibleWrapper: () => ({
        bottom: '0',
        height: '52px',
        minWidth: '152px',
        borderRadius: 'var(--border-radius-m)',
        background: 'var(--color-black-base)',
      }),
      tangibleeTitle: () => ({
        ...theme.typography['text-cta2-xs'],
        textTransform: 'none',
        color: 'var(--color-white-base)',
      }),
    }),
  },
}
