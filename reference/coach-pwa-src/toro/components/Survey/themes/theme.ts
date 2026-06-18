export const answerContainerStyles = {
  display: 'flex',
  p: 'var(--spacing-3)',
  border: '1px solid var(--color-neutral-light-2)',
  backgroundColor: 'var(--color-white-base)',
  gap: 'var(--spacing-2)',
  alignItems: 'center',
  '&.selected': {
    border: '2px solid var(--color-black-base)',
  },
  '& svg': {
    maxHeight: '16px',
    maxWidth: '16px',
    minHeight: '16px',
    minWidth: '16px',
  },
}

export default {
  baseStyle: ({ theme }) => ({
    surveyWrapper: {
      position: 'relative',
      width: '100%',
    },
    confirmationWrapper: {
      position: 'relative',
      m: 'var(--spacing-6) var(--spacing-6)',
    },
    confirmationContainer: {
      position: 'absolute',
      width: '100%',
      p: 'var(--spacing-6) 0',
      backgroundColor: 'var(--color-neutral-light)', // --color-product-image-bg
      border: 'none',
      borderRadius: 'var(--border-radius-s)',
      display: 'flex',
      flexDirection: 'column',
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
    },
    surveyContainer: {
      backgroundColor: '#F0F0F0', // missing desing tokens
      width: '100%',
      p: 'var(--spacing-6) var(--spacing-3)',
    },
    surveyInnerContainer: {
      p: 'var(--spacing-6) 0',
      backgroundColor: 'var(--color-neutral-light)',
      border: 'none',
      borderRadius: 'var(--border-radius-s)',
      display: 'flex',
      flexDirection: 'column',
    },
    surveyTitle: {
      fontFamily: 'var(--font-face1-extended-bold)',
      fontWeight: 700,
      fontSize: 'var(--text-20)',
      lineHeight: 'var(--line-height-l)',
      letterSpacing: 'var(--letter-spacing-s)',
      color: 'var(--color-neutral-dark)',
      mb: 'var(--spacing-1)',
      p: '0 var(--spacing-4)',
    },
    surveySubTitle: {
      ...theme.typography['text-body1-s'],
      color: 'var(--color-neutral-medium)',
      mb: 'var(--spacing-3)',
      p: '0 var(--spacing-4)',
    },
    answersContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-2)',
      mb: 'var(--spacing-6)',
      p: '0 var(--spacing-4)',
    },
    answerContainer: {
      ...theme.typography['text-body1-s'],
      ...answerContainerStyles,
      borderRadius: 'var(--border-radius-s)',
    },
    radio: {
      maxHeight: '16px',
      maxWidth: '16px',
      minHeight: '16px',
      minWidth: '16px',
      border: '1px solid var(--color-black-base)',
      borderRadius: 'var(--border-radius-full)',
    },
    separator: {
      display: 'none',
    },
    submitButton: {
      m: '0 var(--spacing-4)',
      textTransform: 'uppercase',
      borderRadius: 'var(--border-radius-xs)',
    },
    declineButton: {
      textDecoration: 'underline',
      textTransform: 'none',
      background: 'none',
      m: '0 var(--spacing-4)',
      color: 'var(--color-black-base)',
    },
  }),

  variants: {
    round: ({ theme }) => ({
      separator: {
        display: 'flex',
        borderBottom: '1px solid var(--color-neutral-light-2)',
        mb: 'var(--spacing-6)',
      },
      surveyInnerContainer: {
        p: 'var(--spacing-6) 0',
        backgroundColor: 'var(--color-white-base)',
        border: '1px solid var(--color-neutral-light-2)',
        borderRadius: 'var(--border-radius-s)',
        display: 'flex',
        flexDirection: 'column',
      },
      confirmationContainer: {
        position: 'absolute',
        width: '100%',
        p: 'var(--spacing-6) 0',
        backgroundColor: 'var(--color-white-base)',
        border: '1px solid var(--color-neutral-light-2)',
        borderRadius: 'var(--border-radius-s)',
        display: 'flex',
        flexDirection: 'column',
      },
      answerContainer: {
        ...theme.typography['text-body1-s'],
        ...answerContainerStyles,
        borderRadius: 'var(--border-radius-full)',
        '& svg': {
          border: '1px solid var(--color-black-base)',
          borderRadius: 'var(--border-radius-full)',
        },
        '& svg use[href="#icon-selected"]': {
          filter: 'invert(1)',
        },
      },
      submitButton: {
        m: '0 var(--spacing-4)',
        textTransform: 'none',
        borderRadius: 'var(--border-radius-full)',
      },
    }),
  },
}
