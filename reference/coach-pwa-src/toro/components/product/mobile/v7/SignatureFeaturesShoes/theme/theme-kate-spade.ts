export default {
  baseStyle: ({ theme }) => ({
    signatureFeatureContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      p: '20px',
      background: 'var(--color-neutral-light-1)',
    },

    signatureFeatureHeader: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      textAlign: 'center',
      gap: '5px',
      minHeight: '113px',
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

    signatureFeatureExtraHeading: {
      ...theme.typography['text-title1-xs'],
      fontWeight: 400,
      color: 'var(--color-neutral-dark, #4A4A4A)',
      mt: '5px !important',
    },

    signatureFeatureIconWrapper: {
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      mb: 2,
    },

    signatureFeatureFitContainer: {
      minHeight: '290px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },

    signatureFeatureIconItem: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'all 0.2s ease',
    },

    signatureFeatureIconActive: {
      opacity: 1,
    },

    signatureFeatureIconInactive: {
      opacity: 0.4,
    },

    signatureFeatureIconBox: {
      mb: 2,
    },

    signatureFeatureIconSvg: {
      width: '56px',
      height: '56px',
      transition: 'all 0.2s ease',
    },

    signatureFeatureIconSvgActive: {
      filter: 'none',
    },

    signatureFeatureIconSvgInactive: {
      filter: 'grayscale(100%)',
    },

    signatureFeatureLabel: {
      fontSize: 'sm',
      textAlign: 'center',
    },

    signatureFeatureLabelActive: {
      fontWeight: 600,
    },

    signatureFeatureLabelInactive: {
      fontWeight: 400,
    },

    signatureFeatureSubLabel: {
      fontSize: 'xs',
      color: 'gray.500',
      textAlign: 'center',
    },

    signatureFeatureIndicatorWrapper: {
      position: 'relative',
      width: '100%',
      height: '20px',
    },

    signatureFeatureIndicatorLineWrapper: {
      position: 'absolute',
      top: '50%',
      left: '8%',
      right: '8%',
      transform: 'translateY(-50%)',
      height: '1px',
      display: 'flex',
      alignItems: 'center',
    },

    signatureFeatureIndicatorLine: {
      width: '100%',
      height: '1px',
      background: 'repeating-linear-gradient(to right, #C5C5C5 0 6px, transparent 6px 10px)',
    },

    signatureFeatureIndicatorLineGradientLeft: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: '100%',
      width: '20px',
      background: 'linear-gradient(to right, #F0F0F0, rgba(240,240,240,0))',
    },

    signatureFeatureIndicatorLineGradientRight: {
      position: 'absolute',
      right: 0,
      top: 0,
      height: '100%',
      width: '20px',
      background: 'linear-gradient(to left, #F0F0F0, rgba(240,240,240,0))',
    },

    signatureFeatureIndicatorDots: {
      position: 'relative',
      height: '28px',
      top: '50%',
      left: '0%',
      right: '8%',
      display: 'flex',
      justifyContent: 'space-between',
      transform: 'translateY(-50%)',
      zIndex: 3,
    },

    signatureFeatureIndicatorDot: {
      position: 'absolute',
      width: 'var(--spacing-3)',
      height: 'var(--spacing-3)',
      borderRadius: '50%',
      border: '1px solid var(--color-black-base)',
      transition: 'all 0.2s ease',
      transform: 'translateX(-50%)',
      top: '50%',
      marginTop: '-6px',
    },

    reviewsLink: {
      ...theme.typography['text-title1-xs'],
      color: 'var(--border-color-neutral-dark)',
      textDecoration: 'underline',
      fontWeight: 400,
      cursor: 'pointer',
    },

    helperText: {
      ...theme.typography['text-body1-l'],
      color: 'var(--color-black-base)',
      fontWeight: 400,
    },

    tabList: {
      display: 'flex',
      padding: '6px',
      borderRadius: '999px',
      background: 'var(--color-neutral-light-2)',
      height: '76px',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
    },

    Tab: {
      flex: '1 1 0',
      minWidth: '0',
      borderRadius: '999px',
      padding: '8px 0',

      cursor: 'pointer',
      backgroundColor: 'transparent',
      transition: 'all 0.25s ease',

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      outline: 'none',
      border: 'none',
    },

    ActiveTab: {
      backgroundColor: 'var(--color-white-base)',
    },

    label: {
      ...theme.typography['text-body1-l'],
      color: 'var(--color-black-base)',
      fontWeight: 400,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },

    signatureFeaturesFooter: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '20px 10px',
      textAlign: 'center',
    },
  }),
}
