export default {
  baseStyle: ({ theme }) => ({
    signatureFeatureContainer: {
      padding: 'var(--spacing-4)',
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-normal)',
    },
    signatureFeatureContainerHidden: {
      padding: 0,
    },
    signatureFeatureHeader: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      textAlign: 'center',
      gap: '5px',
      minHeight: '113px',
    },
    tangibleeContainer: {
      p: 4,
    },
    tangibleeContainerHidden: {
      p: 0,
    },
    signatureFeatureHeading: {
      ...theme.typography['text-display1-l'],
      fontWeight: 400,
      color: 'var(--color-black-base)',
    },
    signatureFeatureSubHeading: {
      ...theme.typography['text-body1-l'],
      fontWeight: 400,
      marginTop: 0,
      whiteSpace: 'pre-line',
      color: 'var(--color-black-base)',
    },
  }),
}
