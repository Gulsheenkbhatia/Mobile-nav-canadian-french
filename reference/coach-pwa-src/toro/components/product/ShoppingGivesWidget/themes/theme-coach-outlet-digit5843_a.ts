export default {
  baseStyle: ({ theme }) => ({
    shoppingGivesContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        margin: '0px 12px 40px 12px',
        padding: 0,
      },
    },
    shoppingGivesWidget: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        background: 'var(--neutrals-color-neutral-light, #F7F7F7)',
        border: 0,
        padding: 'var(--spacing-3)',
        borderRadius: 'var(--border-radius-s)',
      },
    },
    shoppingGivesTitle: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-display1-xs'],
        fontSize: 'var(--text-16)',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 'var(--line-height-s)',
        letterSpacing: '0.2px',
        mb: 'var(--spacing-3)',
      },
    },
    shoppingGivesBody: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: '0.2px',
        '& > span': {
          fontWeight: '400',
        },
      },
    },
    shoppingGivesButtonContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        display: 'flex',
        mt: 'var(--spacing-6)',
        mb: 'var(--spacing-6)',
        gap: '8px',
      },
    },
    poweredByContainer: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderRadius: 'var(--border-radius-s)',
        background: 'var(--color-white, #FFF)',
        padding: '4px 8px',
        mt: 0,
        display: 'inline-flex',
      },
    },
    coachInsiderLogo: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderRadius: '8px', ///value not present in design tokens
        background: 'var(--color-white, #FFF)',
        padding: '13px',
        display: 'inline-flex',
        mb: '16px',
        img: {
          width: '53px',
          height: '19px',
        },
      },
    },
    shoppingGivesButton: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: '0.2px',
        marginRight: 0,
      },
    },
    textDivider: {
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        ...theme.typography['text-body1-s'],
        fontSize: 'var(--text-12)',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: 'var(--line-height-xl)',
        letterSpacing: '0.2px',
        marginRight: 0,
      },
    },
  }),
}
