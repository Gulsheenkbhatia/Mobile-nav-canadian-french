export default {
  parts: ['reviewcta', 'topContent'],
  baseStyle: ({ theme }) => ({
    reviewcta: () => ({
      borderRadius: '10px',
      fontFamily: theme.fontFamily.primaryNormal,
    }),
    topContent: () => ({
      '& #home_body_slot_wyng': {
        textAlign: 'center',
      },
      marginTop: theme.space.xxl,
      '& .wyng-share-cta': {
        borderRadius: '10px',
        fontFamily: theme.fontFamily.primaryNormal,
      },
    }),
  }),
}
