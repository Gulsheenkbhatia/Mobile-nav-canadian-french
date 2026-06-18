export default {
  parts: ['afterPayContainer', 'afterPaySkeleton'],
  baseStyle: ({ theme }) => ({
    afterPayContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      py: '6px',
      'afterpay-placement': {
        '--logo-badge-width': '73px',
        '--messaging-margin-block-start': 0,
        '--messaging-margin-block-end': 0,
        '--messaging-line-height': '16.8px',
        color: 'var(--color-neutral-dark)',
        [`@media (max-width: ${theme.breakpoints.md})`]: {
          fontFamily: 'var(--font-face1-normal)',
          letterSpacing: 'var(--letter-spacing-xs)',
          color: 'var(--color-black-base)',
        },
      },
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        justifyContent: 'start',
      },
    },
    afterPaySkeleton: {
      width: '100%',
      height: '20px',
      mt: 'var(--spacing-1)',
    },
  }),
  variants: {
    pdpV3: () => ({
      afterPayContainer: {
        height: '46px',
        bg: '#f7f7f7',
        borderRadius: 'var(--border-radius-s)',
        mb: 'var(--spacing-6)',
        p: 'var(--spacing-3)',
        justifyContent: 'left',
        'afterpay-placement': {
          '--logo-badge-width': '64px',
        },
      },
    }),
  },
}
