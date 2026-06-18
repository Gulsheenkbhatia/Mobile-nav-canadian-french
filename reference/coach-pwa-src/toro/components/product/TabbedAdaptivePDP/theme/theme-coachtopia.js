export default {
  baseStyle: ({ theme }) => ({
    productHeaderTitle: {
      fontSize: 'var(--text-16)',
    },
    contentWrapper: {
      zIndex: 20,
    },
    atbContainer: {
      zIndex: 13,
    },
    tabPanel: {
      '& #recommendations-section .certona_wrapper': {
        pb: '0',
      },
    },
    lowerMainContainer: {
      '& .occasion-module': {
        paddingBottom: '18px',
      },
      '& .reviews__heading-wrapper': {
        marginRight: 'var(--spacing-6)',
      },
    },
    contentAreaContainer: {
      '& .mol-header-block-container': {
        padding: 'var(--spacing-3) var(--spacing-4) 44px !important',
        margin: '0 !important',
      },
      '& .at-text-block': {
        '& .at-headline-text': {
          ...theme.typography['text-display1-m'],
          marginBottom: '6px',
        },
        '& .at-body-text': {
          ...theme.typography['text-body2-m'],
        },
      },
      '& .content-areaOne': {
        p: '0',
      },
      '& .content-areaTwo': {
        p: '0',
      },
      '& .content-areaThree': {
        p: '0',
      },
    },
  }),
}
