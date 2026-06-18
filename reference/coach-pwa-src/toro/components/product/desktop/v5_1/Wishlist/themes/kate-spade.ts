const icon = {
  display: 'flex',
  width: 'var(--spacing-4)',
  height: 'var(--spacing-4)',
}

const svg = {
  margin: 'auto',
  width: '13px',
  height: '11px',
}

export default {
  baseStyle: ({ theme }) => ({
    button: {
      ...theme.typography['text-body1-l'],
      display: 'flex',
      alignItems: 'center',
      minWidth: '77px',
      padding: '10px',
      gap: 'var(--spacing-1)',
      color: 'var(--color-black-base, #000)',
      lineHeight: 'var(--line-height-100)',
      letterSpacing: 'var(--letter-spacing-s)',
      textTransform: 'none',
      backgroundColor: 'var(--color-white-base, #fff)',
      borderRadius: 'var(--border-radius-m)',
      border: '0 none',
    },
    icon: {
      ...icon,
      svg: { ...svg },
    },
    fillIcon: {
      ...icon,
      svg: {
        ...svg,
        path: {
          stroke: '#cc0000',
        },
      },
    },
  }),
}
