export default {
  baseStyle: ({ theme }) => ({
    reviewOverlayContainer: () => ({
      flexDirection: 'column',
      p: '21px var(--spacing-8) var(--spacing-6)',
      position: 'absolute',
      backgroundColor: 'var(--color-scrim-dark)',
      bottom: 0,
      width: '100%',
      color: 'var(--color-secondary)',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        minWidth: 'unset',
        m: '0 var(--spacing-3) 30px',
        p: '14px var(--spacing-3) var(--spacing-4)',
        borderRadius: 'var(--border-radius-s)',
        backdropFilter: 'blur(10px)',
        width: 'calc(100% - var(--spacing-3) * 2);',
      },
    }),
  }),
  variants: {
    reviewOverlayOnImageUpper: ({ theme }) => ({
      reviewOverlayContainer: (topPosition) => ({
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          top: `calc(var(--spacing-3) + ${topPosition}px)`,
          position: 'absolute',
          flexDirection: 'column',
          p: 'var(--spacing-3)',
          m: '0 var(--spacing-3)',
          borderRadius: 'var(--border-radius-s)',
          backdropFilter: 'blur(2.5px)',
          width: 'calc(100% - var(--spacing-3) * 2);',
          backgroundColor: 'var(--color-white-80)',
          bottom: 'initial',
        },
      }),
      reviewOverlayTitle: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontWeight: 500,
        },
      },
    }),
  },
}
