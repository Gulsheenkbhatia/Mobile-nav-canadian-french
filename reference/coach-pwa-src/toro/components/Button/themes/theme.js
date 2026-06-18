const variationOptionTheme = (theme) => ({
  backgroundColor: theme.colors.main.white,
  border: `1px solid ${theme.colors.main.inactive}`,
  padding: `11px ${theme.space.s}`,
  width: '100%',
  minWidth: '100%',
  color: theme.colors.main.black,
  letterSpacing: theme.letterSpacings.xs,
  fontSize: theme.fontSizes.sm,
  userSelect: 'none',
  textTransform: 'capitalize',
  position: 'relative',
  borderRadius: 0,
  _hover: {
    borderColor: theme.colors.main.gray,
  },
  '&.selected': {
    backgroundColor: theme.colors.main.gray,
    borderColor: theme.colors.main.gray,
    color: theme.colors.main.white,
  },
  '&:focus, &[data-focus]': {
    boxShadow: 'none',
    borderColor: theme.colors.main.gray,
  },
  '&:disabled': {
    pointerEvents: 'none',
    cursor: 'default',
  },
  '&.allow-disabled': {
    backgroundColor: theme.colors.neutral.light,
  },
  '&.allow-disabled.selected': {
    backgroundColor: theme.colors.main.gray,
    borderColor: theme.colors.main.gray,
    color: theme.colors.main.white,
  },
  '&:disabled:after, &.allow-disabled:after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `linear-gradient(
        to bottom right,
        transparent calc(50% - 1px),
        ${theme.colors.main.inactive},
        transparent calc(50% + 1px)
      )`,
  },
})
const tagV2 = {
  display: 'flex',
  alignItems: 'center',
  height: '18px',
  minWidth: 'auto',
  backgroundColor: 'var(--color-neutral-light-2)',
  padding: '6px',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  marginRight: 'var(--spacing-2)',
}

export default {
  baseStyle: {
    borderRadius: 'var(--border-radius-xs)',
    borderStyle: 'solid',
    textTransform: 'uppercase',
    fontWeight: 400,
    WebkitTapHighlightColor: 'transparent',
    fontFamily: 'var(--font-face1-normal)',
  },
  sizes: {
    xs: {
      padding: 'var(--spacing-sm)',
      fontSize: 'var(--text-10)',
      lineHeight: 'var(--leading-s)',
      letterSpacing: 'var(--letter-spacing-l)',
      height: 'var(--spacing-8)',
    },
    sm: {
      padding: 'var(--btn-spacers-sm1) var(--spacing-sm)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--leading-s)',
      letterSpacing: 'var(--letter-spacing-l)',
    },
    md: {
      padding: 'var(--spacing-3) var(--spacing-4)',
      fontSize: 'var(--text-12)',
      lineHeight: 'var(--leading-s)',
      letterSpacing: 'var(--letter-spacing-l)',
    },
    lg: {
      padding: 'var(--spacing-4) var(--spacing-6)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--leading-s)',
      letterSpacing: 'var(--letter-spacing-xl)',
      height: 'var(--spacing-12)',
    },
    'plain-sm': {
      padding: 0,
      lineHeight: 'var(--leading-l)',
      fontSize: 'var(--text-12)',
      letterSpacing: 'var(--leading-s)',
    },
    'plain-md': {
      padding: 0,
      lineHeight: 'var(--leading-xs)',
      fontSize: 'var(--text-14)',
      letterSpacing: 'var(--leading-s)',
    },
    'plain-lg': {
      padding: 0,
      lineHeight: 'var(--leading-2xl)',
      fontSize: 'var(--text-16)',
      letterSpacing: 'var(--leading-xs)',
    },
    content: {
      minWidth: 'auto',
      display: 'block',
    },
    'icon-only-sm': ({ theme }) => ({
      width: theme.space.l,
      height: theme.space.l,
      minWidth: 'auto',
    }),
    'color-option-sm': ({ theme }) => ({
      width: theme.space.l,
      height: theme.space.l,
    }),
    'color-option-md': ({ theme }) => ({
      width: theme.space.xl,
      height: theme.space.xl,
    }),
  },
  variants: {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-neutral-light)',
      border: 'none',
      '&:hover:not(:disabled), &:active': {
        backgroundColor: 'var(--color-neutral-base)',
      },
      '&:hover:disabled': {
        backgroundColor: 'var(--color-primary)',
      },
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)',
      borderWidth: 'var(--border-width-s)',
      '&:hover:not(:disabled), &:active': {
        borderColor: 'var(--color-neutral-light)',
      },
    },
    'secondary-inverse-background': {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-inactive)',
      borderWidth: 'var(--border-width-s)',
      '&:hover:not(:disabled), &:active': {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-secondary)',
        '& svg': {
          fill: 'var(--color-secondary)',
        },
      },
    },
    outline: ({ theme }) => ({
      '&:focus, &[data-focus]': theme.focus,
    }),
    flat: {
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      border: 'none',
      '&:hover:not(:disabled), &:active': {
        backgroundColor: 'var(--color-neutral-dark)',
      },
    },
    plain: ({ theme }) => ({
      borderRadius: 0,
      borderBottomWidth: 'var(--border-width-s)',
      borderBottomColor: 'var(--color-black-base)',
      backgroundColor: 'transparent',
      color: 'var(--color-primary)',
      textDecoration: 'none',
      textTransform: 'none',
      '&:hover:not(:disabled), &:active': {
        color: 'var(--color-neutral-base)',
        borderBottomColor: 'var(--color-neutral-base)',
      },
      '&:focus, &[data-focus]': theme.focus,
    }),
    'icon-only': ({ theme }) => ({
      backgroundColor: 'transparent',
      color: theme.colors.main.primary,
      margin: 0,
      padding: 0,
      display: 'block',
      '&:focus, &[data-focus]': theme.focus,
    }),
    'icon-only-w-focus': ({ theme }) => ({
      backgroundColor: 'transparent',
      color: theme.colors.main.primary,
      margin: 0,
      padding: 0,
      display: 'block',
    }),
    tag: ({ theme }) => ({
      height: '25px',
      minWidth: 'auto',
      backgroundColor: theme.colors.neutral.light,
      padding: `${theme.space.xs} ${theme.space.s}`,
      userSelect: 'none',
      whiteSpace: 'nowrap',
      '&:hover': {
        backgroundColor: theme.colors.main.inactive,
      },
      '&:focus, &[data-focus]': theme.focus,
    }),
    tagV2: () => tagV2,
    tagV3: () => ({
      ...tagV2,
      borderRadius: '50px',
      padding: 'var(--spacing-1) 6px var(--spacing-1) 9px',
      height: '20px',
      '& p': {
        color: 'var(--color-black-base)',
        fontSize: 'var(--text-10)',
        lineHeight: 'var(--line-height-s)',
        pt: '1px',
      },
      '& svg path': { stroke: 'var(--color-black-base)' },
    }),
    'color-option': ({ theme, size }) => {
      const widthAndHeight = size?.indexOf('sm') !== -1 ? theme.space.m : theme.space.l
      const scaleDownStyle = {
        width: widthAndHeight,
        height: widthAndHeight,
        top: '3px',
        left: '3px',
        borderColor: theme.colors.main.inactive,
      }
      return {
        backgroundColor: theme.colors.main.white,
        border: `1px solid ${theme.colors.main.inactive}`,
        position: 'relative',
        borderRadius: '50%',
        '& > div': {
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          position: 'absolute',
          borderRadius: '50%',
          overflow: 'hidden',
          pointerEvents: 'none',
        },
        '&.selected': {
          borderColor: theme.colors.main.black,
          '& > div': {
            ...scaleDownStyle,
          },
        },
        '&:hover': {
          '&:not([disabled]) > div': {
            ...scaleDownStyle,
          },
        },
        '&[disabled], &.allow-disabled': {
          opacity: 1,
          '& > div': {
            opacity: 0.4,
            ...scaleDownStyle,
          },
          '&:after': {
            content: '""',
            borderRadius: '50%',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(
              to bottom right,
              transparent calc(50% - 1px),
              ${theme.colors.main.inactive},
              transparent calc(50% + 1px)
            )`,
          },
        },
        '&:disabled': {
          cursor: 'default',
        },
        '&.allow-disabled': {
          cursor: 'pointer',
        },
        '&:focus, &[data-focus]': {
          boxShadow: 'none',
        },
      }
    },
    'variation-option': ({ theme }) => ({
      ...variationOptionTheme(theme),
    }),
    'megaPDP-variation-option': ({ theme }) => ({
      ...variationOptionTheme(theme),
      padding: { base: `11px var(--spacing-6)`, md: `11px ${theme.space.s}` },
      '&.selected': {
        backgroundColor: theme.colors.main.primary,
        color: theme.colors.main.white,
        borderColor: theme.colors.main.primary,
      },
      '&.allow-disabled.selected': {
        backgroundColor: theme.colors.main.primary,
        borderColor: theme.colors.main.gray,
        color: theme.colors.main.white,
      },
    }),
    'size-variation-option': ({ theme }) => ({
      ...variationOptionTheme(theme),
      '&.selected': {
        backgroundColor: theme.colors.main.gray,
        '& > p': {
          borderColor: theme.colors.main.gray,
          color: theme.colors.main.white,
        },
      },
      height: '100%',
      display: 'block',
    }),
    'plp-variation-option': ({ theme }) => ({
      ...variationOptionTheme(theme),
      borderRadius: 'var(--border-radius-s)',
      borderColor: '#E6E6E6',
      '&.selected': {
        backgroundColor: 'var(--color-black-base)',
        borderColor: 'var(--color-black-base)',
        '& > p': {
          color: theme.colors.main.white,
        },
      },
      '&:disabled': {
        pointerEvents: 'none',
        cursor: 'default',
        borderColor: '#E6E6E6',
        opacity: 1,
        '& > p': {
          opacity: 0.4,
        },
      },
    }),
    quickView: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-primary)',
      p: 's',
      h: '30px',
      borderRadius: '0',
      '&:hover:not(:disabled), &:active': {
        color: 'var(--color-white-base)',
        backgroundColor: 'var(--color-scrim-dark)',
      },
      '&:hover:disabled': {
        backgroundColor: 'var(--color-primary)',
      },
    },
    brand: ({ theme }) => ({
      backgroundColor: 'transparent',
      margin: 0,
      padding: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.colors.main.inactive,
      borderWidth: theme.borderWidth.default,
      '&:hover:not(:disabled), &:active': {
        borderColor: theme.colors.neutral.light,
      },
      '&:focus, &[data-focus]': theme.focus,
    }),
    clearAll: () => ({
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-primary)',
      borderColor: 'var(--color-primary)',
      borderWidth: 'var(--border-width-s)',
      '&:hover:not(:disabled), &:active': {
        borderColor: 'var(--color-neutral-light)',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white-base)',
      },
      '&:disabled, &.allow-disabled': {
        borderColor: 'var(--color-inactive)',
        backgroundColor: 'var(--color-white-base)',
        color: 'var(--color-inactive)',
      },
    }),
  },
  // The default size and variant values
  defaultProps: {
    size: 'md',
    variant: 'primary',
  },
}
