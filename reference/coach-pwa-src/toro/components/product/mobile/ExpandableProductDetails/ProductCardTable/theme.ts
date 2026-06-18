export default {
  baseStyle: ({ theme }) => ({
    productCardTableContentWrapper: {
      mt: 'var(--spacing-4)',
    },
    productCardTableWrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-6)',
    },
    productCardTable: {
      margin: 0,
      padding: 0,
      listStyleType: 'none',
    },
    htmlContentItem: {
      'li,a,u': {
        listStyle: 'none',
      },
      '.product-props__details': {
        display: 'grid',
        gridTemplateColumns: '44% 56%',
        h2: {
          color: 'var(--color-black-base)',
          fontFamily: 'var(--font-face1-extended-bold)',
          fontSize: 'var(--text-12)',
          fontStyle: 'normal',
          fontWeight: '700',
          lineHeight: 'var(--line-height-140)',
          letterSpacing: 'var(--letter-spacing-xs)',
          textDecoration: 'underline',
        },
        ul: {
          li: {
            ...theme.typography['text-body1-m'],
            color: 'var(--color-black-base)',
          },
        },
      },
    },
    editorNoteWrapper: {
      display: 'grid',
      gridTemplateColumns: '44% 56%',
    },
    editorNoteHeader: {
      color: 'var(--color-black-base)',
      fontFamily: 'var(--font-face1-extended-bold)',
      fontSize: 'var(--text-12)',
      fontStyle: 'normal',
      fontWeight: '700',
      lineHeight: 'var(--line-height-140)',
      letterSpacing: 'var(--letter-spacing-xs)',
      textDecoration: 'underline',
    },
    editorNoteDescriptions: {
      ...theme.typography['text-body1-m'],
      color: 'var(--color-black-base)',
    },
  }),
}
