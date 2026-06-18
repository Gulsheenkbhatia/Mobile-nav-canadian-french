export default {
  baseStyle: ({ theme }) => ({
    box: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      maxHeight: '51px',
      padding: 'var(--spacing-2, 8px) 15px var(--spacing-2, 8px) var(--spacing-2, 8px)',
      gap: '10px',
      ...theme.typography['text-body2-l'],
      fontWeight: '500',
      color: 'var(--color-black-base, #000)',
      backgroundColor: '#fffffe',
      border: '1px solid var(--color-neutral-light-2, #e1e1e1)',
      borderRadius: '800px',
      '& svg': {
        marginLeft: 'auto',
        marginRight: '-2px',
      },
    },
    image: {
      width: '35px',
      height: '35px',
      borderRadius: '800px',
      backgroundColor: '#d3d3d3',
    },
  }),
}
