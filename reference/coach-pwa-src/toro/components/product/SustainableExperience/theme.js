export default {
  baseStyle: ({ theme }) => ({
    sustain_productDetails: {
      '&.sustain-icons-container_productDetails': {
        '.sustainable-icon': {
          width: '25px',
          height: '25px',
          fontSize: '20px',
        },
        '.sustainable-icon-box': {
          marginRight: '15px',
        },
      },
    },
    sustain_heroPDP: {
      '&.sustain-icons-container_heroPDP': {
        '.sustainable-icon': {
          width: '30px',
          height: '30px',
          zIndex: '10',
          fontSize: '20px',
        },
        '.sustainable-icon-box': {
          marginBottom: '5px',
        },
      },
    },
    sustain_icon_text: {
      fontSize: 'sm',
      fontWeight: 'none',
      marginLeft: '3px',
      '&.sustain-icons-text:before': {
        content: '""',
        position: 'absolute',
        left: '0',
        bottom: '6px',
        background: '#000',
        display: 'block',
        width: '100%',
        height: '1px',
      },
    },
    sustainabilityModalContent: {
      '&.sustainability-modal-content': {
        header: {
          boxShadow: 'none',
        },
        '.chakra-modal__close-btn': {
          ':focus': {
            boxShadow: 'none',
          },
          fontSize: '100%',
          top: '30px',
          right: '40px',
        },
        '.sustainable-icon_modal': {
          width: '35px',
          height: '40px',
        },
        '.sustain-icons-text_modal': {
          marginLeft: '5px',
        },
      },
    },
    sustainable_card: {
      height: '273px',
      overflow: 'auto',
      marginTop: '24px',
      padding: '40px 24px 24px',
      border: '1px solid #D8D8D8',
      borderRadius: '3px',
      '@media (max-width: 769px)': {
        height: '353px',
      },
      overflowY: 'auto',
      overflowX: 'hidden',
      background: theme.colors.main.white,
      '&::-webkit-scrollbar': {
        width: '14px',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.colors.main.white,
      },
      '&::-webkit-scrollbar-thumb': {
        height: '220px',
        background: theme.colors.neutral.base,
        backgroundClip: 'padding-box',
        border: '4px solid white',
        borderRadius: '7px',
      },
    },
  }),
}
