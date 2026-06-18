import { widePlusMax } from 'toro/constants/productDetailsBreakPoints'

const descriptionTitle = {
  color: 'var(--color-black-base)',
  fontFamily: 'var(--font-face1-medium)',
  fontSize: 'var(--text-16)',
  lineHeight: 'var(--line-height-120)',
  fontWeight: '500',
  letterSpacing: 'var(--letter-spacing-m, 0.025rem)',
}

const descriptionBody = {
  color: 'var(--color-black-base)',
  fontFamily: 'var(--font-face1-normal)',
  fontSize: 'var(--text-14)',
  lineHeight: 'var(--line-height-140)',
  letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
}

export default {
  baseStyle: () => ({
    productCardTableContentWrapper: {
      backgroundColor: 'var(--color-neutral-light-1, #F0F0F0)',
      padding: 'var(--spacing-6)',
      marginLeft: 'var(--spacing-16)',
      [`@media (max-width: ${widePlusMax}px)`]: {
        marginLeft: 'var(--spacing-16)',
      },
    },
    productCardTableWrapper: {
      marginBottom: 0,
      paddingBottom: '56px',
    },
    htmlContentItem: {
      '& > br': {
        display: 'none',
      },
      '.product-props__details': {
        borderBottom: '0 none',
        h2: {
          ...descriptionTitle,
        },
        ul: {
          li: {
            ...descriptionBody,
          },
        },
        '&:first-child': {
          paddingTop: 'var(--spacing-4)',
        },
      },
    },
    regularDescription: {
      ...descriptionBody,
      'h2, h3': {
        ...descriptionTitle,
      },
      '&:first-child': {
        paddingTop: 'var(--spacing-4)',
      },
    },
    editorNoteWrapper: {
      borderTop: '0 none',
    },
    editorNoteHeader: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-medium)',
      fontSize: 'var(--text-16)',
      lineHeight: 'var(--line-height-120)',
      fontWeight: '500',
      letterSpacing: 'var(--letter-spacing-m, 0.025rem)',
    },
    editorNoteDescriptions: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-normal)',
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-s, 0.0125rem)',
    },
  }),
}
