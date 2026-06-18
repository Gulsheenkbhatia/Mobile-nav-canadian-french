const allSelector = '& *'

export default {
  variants: {
    inventoryStatus: ({ theme }) => ({
      mb: 'var(--spacing-3)',
      ...theme.typography['text-body1-m'],
      color: '(var--color-neutral-dark)',
    }),
    onImagePLP: ({ theme }) => ({
      '& *': {
        ...theme.typography['text-eyebrow1-m'],
      },
      '.onlineExclusiveBadge': {
        ...theme.typography['text-eyebrow1-m'],
      },
    }),
    upperPlacementPLP: ({ theme }) => ({
      '& *': {
        ...theme.typography['text-eyebrow1-m'],
      },
      '.onlineExclusiveBadge': {
        ...theme.typography['text-eyebrow1-m'],
      },
    }),
    lowerPlacementPLP: ({ theme }) => ({
      '& *': {
        ...theme.typography['text-eyebrow1-m'],
      },
    }),
    marketingContentPdp: ({ theme }) => ({
      p: 'var( --spacing-1) var( --spacing-2)',
      paddingLeft: 'var( --spacing-2)',
      '*': {
        ...theme.typography['text-body1-s'],
        fontWeight: 400,
      },
      '& label': {
        backgroundColor: 'var(--color-cream)',
      },
    }),
    onImagePLPv3: ({ theme }) => ({
      [`@media (min-width: ${theme.breakpoints.md})`]: {
        padding: '6px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 'var(--border-radius-xl)',
        position: 'relative',
        backdropFilter: 'blur(6px)',
        [allSelector]: {
          ...theme.typography['text-body1-s'],
          textTransform: 'none',
          fontWeight: '400',
        },
        '&::after': {
          content: '"▼"',
          position: 'absolute',
          height: '10px',
          bottom: '-5.4px',
          color: 'rgba(255, 255, 255, 0.6)',
          transform: 'scaleX(1.4) scaleY(0.5)',
          width: '100%',
          left: '4px',
          textAlign: 'center',
        },
        '& .mw-custom-badge': {
          [`@media (min-width: ${theme.breakpoints.md})`]: {
            ...theme.typography['text-body1-s'],
            textTransform: 'none',
            fontWeight: '400',
            background: 'none',
            border: 'none',
            padding: '0',
          },
        },
        '&:has(.mw-custom-badge)': {
          padding: '6px 16px',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
        },
        '& label.mw-custom-badge::after': {
          display: 'none',
        },
      },
      customBadge: () => null,
    }),
  },
}
