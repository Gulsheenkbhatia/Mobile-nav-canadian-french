export default {
  parts: ['calloutMessageWrapper', 'pdpCalloutmessage', 'plpCalloutmessage'],
  baseStyle: ({ theme }) => ({
    calloutMessageWrapper: {
      marginBottom: 'var(--spacing-4)',
    },
    pdpCalloutmessage: () => ({
      fontWeight: 500,
      lineHeight: theme.lineHeights.xxl,
      borderTop: '1px solid var(--color-inactive)',
      padding: 'var(--spacing-2) 0',
    }),
    plpCalloutmessage: {
      textAlign: 'center',
      span: {
        ...theme.typography['text-eyebrow1-m'],
      },
    },
  }),
}
