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
    }),
    tangibleImage: {
      display: 'none',
    },
  }),
  variants: {
    coachtopia: ({ theme }) => ({
      tangibleeTitle: () => ({
        ...theme.typography['text-cta2-s'],
        lineHeight: '16px',
        letterSpacing: '0.28px',
        color: 'var(--color-white-base)',
        fontSize: 'var(--text-14)',
        textTransform: 'none',
        fontFamily: 'var(--font-face1-extended-normal)',
      }),
    }),
    vpc: ({ theme }) => ({
      tangibleWrapper: () => ({
        height: '48px',
        minWidth: '199px',
        width: 'fit-content',
        padding: '10px var(--spacing-6) 10px 18px',
        borderRadius: '130px',
        background: 'var(--color-black-base)',
        mb: '10px',
        [`@media (max-height: 864px)`]: {
          minHeight: 'unset',
          maxHeight: 'unset',
          height: '38px',
          minWidth: '160px',
          mb: '0',
        },
      }),
      tangibleeTitle: () => ({
        ...theme.typography['text-cta2-xs'],
        color: theme.colors.main.white,
      }),
    }),
  },
}
