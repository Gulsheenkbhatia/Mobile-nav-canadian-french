export default {
  variants: {
    primary: {
      fontFamily: 'var(--font-face1-normal)',
      fontWeight: 'bold',
    },
    secondary: {
      fontFamily: 'var(--font-face2-normal)',
    },
    'body-primary': {
      fontFamily: 'var(--font-face1-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontWeight: 'normal',
    },
    'body-primary-sm': {
      fontFamily: 'var(--font-face1-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontWeight: 'normal',
      fontSize: 'var(--text-12)',
    },
    'body-primary-sm-bold': {
      fontFamily: 'var(--font-face1-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontWeight: 'bold',
      fontSize: 'var(--text-12)',
    },
    'body-primary-md': {
      fontFamily: 'var(--font-face1-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontWeight: 'normal',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-xl)',
    },
    'body-primary-md-bold': {
      fontFamily: 'var(--font-face1-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontWeight: 'bold',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-xl)',
    },
    'body-primary-with-links': {
      fontFamily: 'var(--font-face1-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontWeight: 'normal',
      fontSize: 'var(--text-14)',
      lineHeight: '1.4',
      a: {
        textDecoration: 'underline',
      },
    },
    'body-text-secondary': {
      fontFamily: 'var(--font-face2-normal)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
    'cta-primary': {
      fontFamily: 'var(--font-face1-normal)',
    },
    'eyebrow-primary': {
      fontFamily: 'var(--font-face1-normal)',

      color: 'var(--color-neutral-base)',
      letterSpacing: '1px',
    },
    'top-suggestions': {
      maxWidth: '111px',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: '8px',
      letterSpacing: '1px',
      display: 'inline-block',
    },
    'top-suggestions-categories': {
      fontFamily: 'var(--font-face2-normal)',
    },
    'email-description': {
      fontFamily: 'var(--font-face2-normal)',
    },
    'footer-copy': {
      fontFamily: 'var(--font-face1-normal)',
    },
    'seo-accordion-toggle': {
      fontFamily: 'var(--font-face1-normal)',
      textTransform: 'uppercase',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-xs)',
    },
    'plpV3-accordion-toggle': {
      fontFamily: 'var(--font-face1-normal)',
      textTransform: 'uppercase',
      fontSize: 'var(--text-10)',
      lineHeight: 'var(--line-height-xs)',
      letterSpacing: 'var(--letter-spacing-xl)',
    },
    'flyout-validation': {
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-12)',
    },
    'input-label': {
      fontWeight: 'normal',
      fontSize: 'var(--text-12)',
      position: 'absolute',
      ml: '14px',
      transition: 'all 0.2s',
      backgroundColor: 'var(--color-white-base)',
      borderLeft: '4px solid var(--color-white-base)',
      borderRight: '4px solid var(--color-white-base)',
      zIndex: 100,
    },
    'shopping-gives': {
      fontFamily: 'var(--font-face1-normal)',

      letterSpacing: 0,
    },
    'shopping-gives-bold': {
      fontFamily: 'var(--font-face1-bold)',
      fontWeight: 'normal',
      letterSpacing: '0',
    },
    'size-variation': {
      paddingRight: 'var(--spacing-4)',
      paddingLeft: 'var(--spacing-4)',
      '&:nth-child(1)': {
        paddingBottom: 'var(--spacing-2)',
        borderBottom: '1px solid var(--color-inactive)',
      },
      '&:nth-child(2)': {
        paddingTop: 'var(--spacing-2)',
      },
    },
  },
  sizes: {
    xxl: {
      fontSize: 'var(--text-54)',
      lineHeight: 'var(--line-height-xs)',
    },
    xl: {
      fontSize: 'var(--text-32)',
      lineHeight: 'var(--line-height-xs)',
    },
    lg: {
      fontSize: 'var(--text-30)',
      lineHeight: 'var(--line-height-xs)',
    },
    md: {
      fontSize: 'var(--text-24)',
      lineHeight: 'var(--line-height-xs)',
    },
    sm: {
      fontSize: 'var(--text-20)',
      lineHeight: 'var(--line-height-s)',
      letterSpacing: 'var(--letter-spacing-xs)',
    },
    xs: {
      fontSize: 'var(--text-16)',
      lineHeight: 'var(--line-height-s)',
    },
    xxs: {
      fontSize: 'var(--text-12)',
    },

    'secondary-xxl': {
      fontSize: 'var(--text-50)',
      lineHeight: 'var(--line-height-xs)',
    },
    'secondary-xl': {
      fontSize: 'var(--text-42)',
      lineHeight: 'var(--line-height-xs)',
    },
    'secondary-lg': {
      fontSize: 'var(--text-32)',
      lineHeight: 'var(--line-height-xs)',
    },
    'secondary-md': {
      fontSize: 'var(--text-28)',
      lineHeight: 'var(--line-height-xs)',
    },
    'secondary-sm': {
      fontSize: 'var(--text-24)',
      lineHeight: 'var(--line-height-s)',
    },
    'secondary-xs': {
      fontSize: 'var(--text-20)',
      lineHeight: 'var(--line-height-s)',
    },
    'secondary-xxs': {
      fontSize: 'var(--text-18)',
      lineHeight: 'var(--line-height-s)',
    },
    'body-primary-lg': {
      fontSize: 'var(--text-16)',
      lineHeight: 'var(--line-height-xl)',
    },
    'body-primary-md': {
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-xl)',
    },
    'body-primary-sm': {
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-xs)',
    },
    'body-primary-s': {
      fontSize: 'var(--text-10)',
      lineHeight: 'var(--line-height-xs)',
    },
    'body-text-secondary-xl': {
      fontSize: 'var(--text-20)',
      lineHeight: 'var(--line-height-s)',
    },
    'body-text-secondary-lg': {
      fontSize: 'var(--text-18)',
      lineHeight: 'var(--line-height-xl)',
    },
    'body-text-secondary-md': {
      fontSize: 'var(--text-16)',
      lineHeight: 'var(--line-height-xl)',
    },
    'body-text-secondary-sm': {
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-xl)',
    },

    'cta-primary-md': {
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-xs)',
    },
    'cta-primary-sm': {
      fontSize: 'var(--text-12)',
    },

    'eyebrow-primary-bld': {
      fontSize: 'var(--text-11)',
      lineHeight: 'var(--line-height-xl)',
      fontWeight: 'bold',
    },
    'eyebrow-primary-md': {
      fontSize: 'var(--text-10)',
      lineHeight: 'var(--line-height-xl)',
    },
    'availability-modal-store-lg': {
      fontSize: 'var(--text-16)',
      lineHeight: 'md',
      fontWeight: 'bold',
    },
    'availability-modal-cta-xs': {
      fontSize: 'var(--text-12)',
      lineHeight: 'md',
      textAlign: 'center',
    },
    'availability-modal-zipCode-lg': {
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-2xl)',
    },
    'shopping-gives-bold-xs': {
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-2xl)',
    },
    'shopping-gives-xs': {
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--line-height-2xl)',
    },
  },
  baseStyle: {
    color: 'var(--color-neutral-dark)',
    '&.truncated': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  defaultProps: {
    size: 'md',
    variant: 'primary',
  },
}
