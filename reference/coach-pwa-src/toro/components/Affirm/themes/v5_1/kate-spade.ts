export default {
  parts: [],
  variants: {
    pdpv5: ({ theme }) => ({
      affirmWrapper: {
        display: 'inline-flex',
        minHeight: '42px',
        alignItems: 'center',
      },
      affirmParagraph: {
        ...theme.typography['text-body2-xs'],
        fontWeight: '500',
      },
    }),
  },
}
