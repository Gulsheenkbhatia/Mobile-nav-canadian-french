import { widePlusMax } from 'toro/constants/productDetailsBreakPoints'

export default {
  baseStyle: ({ theme }) => ({
    productCardTableContentWrapper: {
      position: 'relative',
      height: 'calc(100vh - 350px)',
      minHeight: '425px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '30px 10px 22px 22px',
      [`@media (max-width: ${widePlusMax}px)`]: {
        marginLeft: '60px',
      },
      borderRadius: 'var(--spacing-6)',
      border: '1.5px solid var(--color-neutral-light-2)',
      backgroundColor: 'var(--color-page-bg, #F0F0F0)',
      boxShadow:
        '0px 251px 70px 0px rgba(0, 0, 0, 0.00), 0px 161px 64px 0px rgba(0, 0, 0, 0.00), 0px 90px 54px 0px rgba(0, 0, 0, 0.02), 0px 40px 40px 0px rgba(0, 0, 0, 0.03), 0px 10px 22px 0px rgba(0, 0, 0, 0.03)',
    },
    productCardTableWrapper: {
      overflowY: 'auto',
      marginBottom: 'var(--spacing-6)',
      '&::-webkit-scrollbar': {
        width: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'var(--color-neutral-base, #949494)',
        borderRadius: 'var(--border-radius-xs)',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'var(--color-neutral-light-2, #e1e1e1)',
        borderRadius: 'var(--border-radius-xs)',
      },
    },
    productCardTable: {
      marginLeft: 0,
      marginRight: 'var(--spacing-2)',
    },
    productCardTableFadeBefore: {
      position: 'absolute',
      top: '22px',
      width: 'calc(100% - 32px)',
      height: 'var(--spacing-4)',
      background: 'linear-gradient(0deg, rgba(240, 240, 240, 0.00) 0%, #F0F0F0 100%)',
    },
    productCardTableFadeAfter: {
      position: 'absolute',
      bottom: 0,
      height: '20%',
      width: 'calc(100% - 32px)',
      background: 'linear-gradient(180deg, rgba(240, 240, 240, 0.00) 0%, #F0F0F0 100%)',
      borderRadius: 'var(--spacing-6)',
    },
    editorNoteWrapper: {
      display: 'grid',
      gridTemplateColumns: '241px 269px',
      borderTop: '1px solid rgba(36, 34, 34, 0.20)',
      paddingTop: 'var(--spacing-6)',
      paddingBottom: 'var(--spacing-6)',
      '&:only-child': {
        borderTop: 'none',
        paddingTop: '0',
      },
    },
    editorNoteHeader: {
      ...theme.typography['text-display4-xxs'],
      whiteSpace: 'pre-wrap',
      fontWeight: '700',
    },
    editorNoteDescriptions: {
      ...theme.typography['text-body1-m'],
      fontWeight: '400',
    },
    htmlContentItem: {
      'li,a,u': {
        listStyle: 'none',
      },
      '.product-props__details': {
        display: 'grid',
        gridTemplateColumns: '241px 269px',
        paddingBottom: 'var(--spacing-6)',
        borderBottom: '1px solid rgba(36, 34, 34, 0.20)',
        h2: {
          ...theme.typography['text-display4-xxs'],
          whiteSpace: 'pre-wrap',
          fontWeight: '700',
        },
        ul: {
          li: {
            ...theme.typography['text-body1-m'],
            whiteSpace: 'pre-wrap',
            fontWeight: '400',
          },
        },
        '&:first-child': {
          paddingTop: '7px',
        },
        '&:last-of-type': {
          paddingBottom: '0',
          borderBottom: 'none',
        },
      },
    },
  }),
  variants: {
    coachtopia: {
      htmlContentItem: {
        '.product-props__details ul li': {
          fontFamily: 'var(--font-face1-normal)',
        },
      },
    },
  },
}
