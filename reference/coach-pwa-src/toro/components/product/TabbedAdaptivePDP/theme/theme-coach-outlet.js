export default {
  baseStyle: () => ({
    atbContainer: {
      '& .atb-ctas-wrapper, & .atb-notify-wrapper': {
        '& .chakra-select__wrapper': {
          '& select': {
            paddingTop: '10px',
          },
        },
      },
    },
    lowerMainContainer: {
      '& #recommendations-section': {
        '& .certona_wrapper': {
          paddingTop: '27px',
          paddingBottom: '34px',
        },
      },
    },
  }),
}
