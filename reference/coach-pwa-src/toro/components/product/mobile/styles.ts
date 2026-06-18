const blackFadeInHeaderFix = {
  '.scrolled-header:has(.one-coach-fade-in)': {
    '&:after': {
      background: 'transparent!important',
    },
  },
}

export const styles = {
  global: {
    header: {
      backgroundColor: 'var(--header-background-color, var(--color-neutral-light-1))',
      ...blackFadeInHeaderFix,
    },
  },
}

export const stylesKs = {
  global: {
    header: {
      backgroundColor: 'unset',
    },
  },
}
