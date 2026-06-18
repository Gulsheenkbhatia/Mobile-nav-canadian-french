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
          ...theme.typography['text-title2-m'],
          color: 'var(--color-black-base)',
          fontWeight: '500',
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
      ...theme.typography['text-title2-m'],
      color: 'var(--color-black-base)',
      fontWeight: '500',
    },
    editorNoteDescriptions: {
      ...theme.typography['text-body1-m'],
      color: 'var(--color-black-base)',
    },
  }),

  variants: {
    pdpv7: ({ theme }) => ({
      htmlContentItem: {
        '.product-props__details': {
          h2: {
            ...theme.typography['text-body1-m'],
            color: 'var(--color-neutral-medium)',
            fontWeight: '400',
            textDecoration: 'none',
          },
        },
      },

      editorNoteHeader: {
        ...theme.typography['text-body1-m'],
        color: 'var(--color-neutral-medium)',
        fontWeight: '400',
        textDecoration: 'none',
      },
    }),
  },
}
