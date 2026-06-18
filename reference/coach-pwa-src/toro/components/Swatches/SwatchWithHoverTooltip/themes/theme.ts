export default {
  baseStyle: () => ({
    tooltip: {
      borderRadius: 'var(--spacing-1)',
      border: 'none',
      boxShadow: 'none',
      p: '14px var(--spacing-4)',
      bg: 'var(--color-white-base)',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-16)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-135)',
      letterSpacing: 'var(--letter-spacing-xs)',
      '& .chakra-tooltip__arrow': {
        bg: 'var(--color-white-base) !important',
      },
    },
  }),
}
