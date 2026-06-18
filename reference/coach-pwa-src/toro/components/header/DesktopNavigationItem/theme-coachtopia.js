const commonTextStyles = (theme, isActive) => ({
  textTransform: 'capitalize',
  borderBottom: `1px solid ${isActive ? theme.colors.main.black : 'transparent'}`,
})

export default {
  variants: {
    tier1: () => ({
      text: (theme, isActive) => ({
        ...commonTextStyles(theme, isActive),
        ...theme.typography['text-cta2-s'],
        textTransform: 'uppercase',
        '&:hover': { borderBottom: '1px solid var(--color-black-base)' },
      }),
    }),
    tier2: () => ({
      text: (theme, isActive) => {
        return {
          ...commonTextStyles(theme, isActive),
          ...theme.typography['text-body2-l'],
        }
      },
    }),
    tier3: () => ({
      text: (theme, isActive) => {
        return {
          ...commonTextStyles(theme, isActive),
          ...theme.typography['text-body2-m'],
        }
      },
    }),
  },
}
