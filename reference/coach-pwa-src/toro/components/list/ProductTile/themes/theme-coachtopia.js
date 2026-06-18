export default {
  baseStyle: ({ theme }) => ({
    tileProductNameText: {
      ...theme.typography['text-body2-m'],
      display: '-webkit-box',
      lineClamp: 2,
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      whiteSpace: 'normal',
    },
    viewSimilarButton: {
      width: '100%',
    },
  }),
}
