import { answerContainerStyles } from 'toro/components/Survey/themes/theme'

export default {
  baseStyle: ({ theme }) => ({
    confirmationContainer: {
      position: 'absolute',
      width: '100%',
      p: 'var(--spacing-6) 0',
      backgroundColor: 'var(--color-product-image-bg)',
      border: 'none',
      borderRadius: 'var(--border-radius-s)',
      display: 'flex',
      flexDirection: 'column',
    },
    surveyInnerContainer: {
      p: 'var(--spacing-6) 0',
      backgroundColor: 'var(--color-product-image-bg)',
      border: 'none',
      borderRadius: 'var(--border-radius-s)',
      display: 'flex',
      flexDirection: 'column',
    },
    answerContainer: {
      ...theme.typography['text-body1-s'],
      ...answerContainerStyles,
      borderRadius: 'var(--border-radius-s)',
      '& svg': {
        border: '1px solid var(--color-black-base)',
        borderRadius: 'var(--border-radius-full)',
      },
      '& svg use[href="#icon-selected"]': {
        filter: 'invert(1)',
      },
    },
    surveyTitle: {
      fontFamily: 'var(--font-face2-normal)',
      fontWeight: 400,
      fontSize: 'var(--text-24)',
      lineHeight: 'var(--line-height-s)',
      letterSpacing: 'var(--letter-spacing-s)',
      color: 'var(--color-neutral-dark)',
      mb: 'var(--spacing-1)',
      p: '0 var(--spacing-4)',
    },
  }),
  variants: {
    round: ({ theme }) => ({
      answerContainer: {
        ...theme.typography['text-body1-s'],
        ...answerContainerStyles,
        borderRadius: 'var(--border-radius-full)',
        '& svg': {
          border: 'none',
        },
        '& svg use[href="#icon-selected"]': {
          filter: 'invert(0)',
        },
      },
      submitButton: {
        m: '0 var(--spacing-4)',
        textTransform: 'uppercase',
        borderRadius: 'var(--border-radius-full)',
      },
    }),
  },
}
