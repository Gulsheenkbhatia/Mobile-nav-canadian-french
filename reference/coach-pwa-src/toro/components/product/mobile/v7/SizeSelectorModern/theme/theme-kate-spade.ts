export default {
  baseStyle: ({ theme }) => ({
    ruleIconImage: { width: 'var(--spacing-6)', height: '11px' },

    drawerContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: '20px',
      gap: '20px',
      maxHeight: '100vh',
    },
    rectangleBar: {
      borderRadius: '100px',
      background: '#E0E0E0',
      height: '6px',
      minWidth: '47px',
    },
    drawerHeader: {
      textAlign: 'center',
      bg: 'var(--color-white-base)',
    },
    headerText: {
      color: 'var(--color-black-base)',
      fontFamily: 'Maison Neue',
      fontSize: '20px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: 'var(--line-height-125)',
    },
    drawerBody: {
      p: 0,
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      overflow: 'hidden',
    },

    closeButton: {
      position: 'absolute',
      top: 'var(--spacing-4)',
      right: 'var(--spacing-4)',
    },

    fitGuideContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    fitGuideHeading: {
      fontFamily: 'var(--font-face3-normal)',
      color: 'var(--color-black-base)',
      fontSize: 'var(--spacing-8)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-100)',
    },
    fitGuideDrawerBody: {
      p: 0,
      overflowY: 'auto',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    fitGuideContent: {
      ...theme.typography['text-body1-m'],
      fontWeight: 400,
      fontSize: 'var(--text-14)',
      fontStyle: 'normal',
      marginTop: 0,
      whiteSpace: 'pre-line',
      color: 'var(--color-black-base)',
      lineHeight: 'var(--line-height-135)',
    },
    fitGuideReviewText: {
      ...theme.typography['text-title1-xs'],
      fontWeight: 400,
      fontSize: 'var(--text-12)',
      fontStyle: 'normal',
      color: 'var(--color-neutral-dark, #4A4A4A)',
      lineHeight: 'var(--line-height-125)',
    },
    fitGuideIconsSection: {
      width: '100%',
      overflow: 'hidden',
    },
    fitGuideIconGrid: {
      width: '100%',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      alignItems: 'flex-end',
      mb: 2,
    },
    fitGuideBottomSection: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    fitGuideIconItem: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'all 0.2s ease',
    },

    fitGuideIconActive: {
      opacity: 1,
    },

    fitGuideIconInactive: {
      opacity: 0.4,
    },

    fitGuideIconBox: {
      mb: 2,
    },

    fitGuideIconSvg: {
      width: '56px',
      height: '56px',
      transition: 'all 0.2s ease',
    },

    fitGuideIconSvgActive: {
      filter: 'none',
    },

    fitGuideIconSvgInactive: {
      filter: 'grayscale(100%)',
    },

    fitGuideLabel: {
      fontSize: 'sm',
      textAlign: 'center',
    },

    fitGuideLabelActive: {
      fontWeight: 600,
    },

    fitGuideLabelInactive: {
      fontWeight: 400,
    },

    fitGuideSubLabel: {
      fontSize: 'xs',
      color: 'gray.500',
      textAlign: 'center',
    },
    /* Indicator Line */

    fitGuideIndicatorWrapper: {
      position: 'relative',
      width: '100%',
      height: '28px',
      overflow: 'hidden',
    },

    fitGuideIndicatorLineWrapper: {
      position: 'absolute',
      top: '50%',
      left: 0,
      right: 0,
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      minHeight: '1px',
      zIndex: 1,
    },

    fitGuideIndicatorLine: {
      width: '100%',
      height: 0,
      lineHeight: 0,
      borderBottom: '1px dashed rgba(197, 197, 197, 1)',
    },

    fitGuideIndicatorLineGradientLeft: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '88px',
      zIndex: 2,
      pointerEvents: 'none',
      background:
        'linear-gradient(to right, var(--color-white-base, #FFFFFF), rgba(255, 255, 255, 0))',
    },

    fitGuideIndicatorLineGradientRight: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: '88px',
      zIndex: 2,
      pointerEvents: 'none',
      background:
        'linear-gradient(to left, var(--color-white-base, #FFFFFF), rgba(255, 255, 255, 0))',
    },

    fitGuideIndicatorDotsGrid: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      gridTemplateColumns: 'repeat(3, 1fr)',
      zIndex: 3,
      alignItems: 'center',
    },
    fitGuideIndicatorDotsGridItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fitGuideIndicatorDot: {
      width: 'var(--spacing-3)',
      height: 'var(--spacing-3)',
      borderRadius: '50%',
      border: '1px solid var(--color-black-base)',
      transition: 'all 0.2s ease',
      flexShrink: 0,
    },

    fitGuideFootLengthContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '10px',
      bg: 'var(--color-neutral-light-1, #F0F0F0)',
      borderRadius: 'var(--border-radius-m)',
    },
    fitGuideFootLengthText: {
      ...theme.typography['text-title2-s'],
      fontWeight: 500,
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-135)',
      color: 'var(--color-black-base)',
      textTransform: 'capitalize',
    },
    fitGuideInputGroup: {
      borderRadius: 'var(--border-radius-m)',
      bg: 'var(--color-white-base)',
      padding: '10px 10px 10px 15px',
      minHeight: '68px',
      gap: 'var(--spacing-1)',
    },
    fitGuideInputBox: {
      p: 0,
      border: 'none',
      minHeight: '48px',
      '&:focus, &:focus-visible, *[data-focus]': {
        boxShadow: 'none',
        outline: 'none',
        borderColor: 'inherit',
      },
    },
    fitGuideInputError: { p: 0, m: 0, color: 'var(--color-error-primary)' },
    fitGuideUnitToggleWrapper: {
      display: 'flex',
      bg: 'var(--color-ks-dark-green, #104C00)',
      minWidth: '112px',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 'var(--border-radius-l)',
      p: 'var(--spacing-1)',
      gap: 'var(--spacing-1)',
      color: 'var(--color-white-base)',
    },

    unitActive: {
      ...theme.typography['text-title2-s'],
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-125)',
      bg: 'var(--color-white-base)',
      color: 'var(--color-black-base)',
      padding: 'var(--spacing-3) var(--spacing-6)',
      borderRadius: 'var(--border-radius-m)',
      boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.10)',
      minW: '52px',
      minH: 'var(--spacing-10)',
      fontWeight: 500,

      _hover: {
        bg: 'var(--color-white-base)',
      },

      _active: {
        bg: 'var(--color-white-base)',
        boxShadow: 'none',
      },
      _focus: {
        boxShadow: 'none',
        outline: 'none',
        bg: 'var(--color-white-base)',
      },
      _focusVisible: {
        boxShadow: 'none',
        outline: 'none',
        bg: 'var(--color-white-base)',
      },
    },
    unitInactive: {
      bg: 'var(--color-ks-dark-green, #104C00)',
      color: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-m)',
      minW: '52px',
      minH: 'var(--spacing-10)',
      fontWeight: 500,
      _hover: {
        bg: 'var(--color-ks-dark-green, #104C00)',
      },
      _active: {
        bg: 'var(--color-ks-dark-green, #104C00)',
        boxShadow: 'none',
      },
      _focus: {
        boxShadow: 'none',
        outline: 'none',
        bg: 'var(--color-ks-dark-green, #104C00)',
      },
      _focusVisible: {
        boxShadow: 'none',
        outline: 'none',
        bg: 'var(--color-ks-dark-green, #104C00)',
      },
    },
    fitGuideAccordionContainer: {
      bg: 'var(--color-white-base)',
      borderRadius: 'var(--border-radius-m)',
      p: 'var(--spacing-4) 10px var(--spacing-4) 15px',
    },
    fitGuideAccordionHeader: {
      height: 'var(--spacing-6)',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      display: 'flex',
      textAlign: 'left',
      bg: 'transparent',
      _hover: { bg: 'transparent' },
      _active: { bg: 'transparent' },
      _focus: { bg: 'transparent', boxShadow: 'none', outline: 'none' },
      _focusVisible: { bg: 'transparent', boxShadow: 'none', outline: 'none' },
    },
    fitGuideAccordionText: {
      ...theme.typography['text-title2-s'],
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-125)',
      fontWeight: 500,
      color: 'var(--color-black-base)',
      textTransform: 'none',
    },
    fitGuideAccordionIconContainer: {
      marginLeft: 'var(--spacing-2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    fitGuideAccordionButton: {
      minW: 'auto',
      p: 0,
      minHeight: '20px',
      bg: 'var(--color-white-base)',
      _focus: {
        boxShadow: 'none',
        outline: 'none',
        bg: 'var(--color-white-base)',
      },
      _focusVisible: {
        boxShadow: 'none',
        outline: 'none',
        bg: 'var(--color-white-base)',
      },

      _hover: { bg: 'transparent' },
      _active: { bg: 'transparent' },
    },
    _focusVisible: { boxShadow: 'none' },
    fitGuideTableContainer: {
      bg: 'var(--color-neutral-light-1, #F0F0F0)',
      borderRadius: 'var(--border-radius-m)',
      minHeight: '180px',
      px: '10px',
      pb: '10px',
      pt: 0,
      height: 'auto',
      overflowY: 'auto',
      scrollbarGutter: 'stable',
      '& th, & td': {
        ...theme.typography['text-title2-s'],
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-125)',
        color: 'var(--color-black-base)',
        fontWeight: 500,
      },
    },

    fitGuideTable: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0 4px',
      tableLayout: 'fixed',
      '& thead': {
        position: 'relative',
        zIndex: 2,
      },
    },

    fitGuideTableHeaderCell: {
      position: 'sticky',
      top: 0,
      zIndex: 2,
      bg: 'var(--color-neutral-light-1, #F0F0F0)',
      textTransform: 'none',
      fontWeight: 500,
      textAlign: 'center',
      color: 'var(--color-black-base)',
      border: 'none',
      py: '15px',
      px: '10px',
      width: '25%',
    },

    fitGuideTableCell: {
      height: '48px',
      p: '10px',
      textAlign: 'center',
      bg: 'var(--color-white-base, #FFF)',
      border: 'none',
      width: '25%',
    },
    fitGuideTableCellFirst: {
      borderTopLeftRadius: '5px',
      borderBottomLeftRadius: '5px',
    },

    fitGuideTableCellLast: {
      borderTopRightRadius: '5px',
      borderBottomRightRadius: '5px',
    },

    fitGuideTableCellActive: {
      fontWeight: 600,
      bg: '#BAD3E9',
    },
    shoeSizeDrawerContent: {
      display: 'flex',
      flexDirection: 'column',
      maxH: '100vh',
      gap: 'var(--spacing-4)',
      padding: 'var(--spacing-10) var(--spacing-3)',
    },
    shoeSizeDrawerCloseButton: {
      position: 'absolute',
      top: 'var(--spacing-3)',
      right: 'var(--spacing-3)',
      '& svg': {
        width: '22px',
        height: '22px',
        stroke: 'var(--color-black-base)',
      },
    },
    shoeSizeDrawerBar: {
      height: '6px',
      width: '47px',
      bg: 'var(--color-neutral-light-2, #E1E1E1)',
      borderRadius: 'var(--border-radius-full)',

      position: 'absolute',
      top: 'var(--spacing-2)',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    shoeSizeDrawerHeader: { textAlign: 'center', p: 0, bg: 'var(--color-white-base)' },
    shoeSizeDrawerText: {
      ...theme.typography['text-body2-l'],
      fontWeight: 500,
      fontStyle: 'normal',
      color: 'var(--color-black-base)',
      lineHeight: 'var(--line-height-135)',
    },
    shoeSizeDrawerBody: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'none',
      gap: '20px',
      p: 0,
    },
    shoeSizeSelectButton: {
      bg: 'var(--color-black-base)',
      borderRadius: 'var(--border-radius-full)',
      width: '100%',
      padding: 'var(--spacing-4)',
      minHeight: '60px',
    },
    shoeSizeSelectButtonText: {
      ...theme.typography['text-body2-l'],
      fontWeight: 500,
      lineHeight: 'var(--line-height-135)',
      color: 'var(--color-white-base)',
      textTransform: 'capitalize',
    },
    shoeFitGuideButtonText: {
      ...theme.typography['text-body2-l'],
      fontWeight: 500,
      fontSize: 'var(--text-14)',
      lineHeight: 'var(--line-height-135)',
      color: 'var(--color-primary, #101820)',
      textTransform: 'capitalize',
    },
    shoeFitGuideButton: {
      gap: 'var(--spacing-1)',
      height: '20px',
      display: 'inline-flex',
      alignItems: 'center',
      width: 'fit-content',
      padding: 0,
      borderRadius: 'var(--border-radius-none)',
      borderBottom: '1px solid var(--color-black-base)',
      minWidth: '115px',
      marginTop: 'var(--spacing-2)',
    },
    soldOutNotifyContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      gap: 'var(--spacing-2)',
    },
    shoeSizeSoldOutButton: {
      minHeight: '60px',
      borderRadius: 'var(--border-radius-full)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    shoeSizeSelectorNotifyButton: {
      border: '1.5px solid var(--color-black-base, #000)',
      borderRadius: 'var(--border-radius-full)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      '& button': {
        ...theme.typography['text-body2-l'],
        fontWeight: 500,
        fontSize: 'var(--text-14)',
        lineHeight: 'var(--line-height-135)',
        color: 'var(--color-primary, #101820)',
        textTransform: 'capitalize',
        border: 'none !important',
        borderRadius: 'inherit',
        padding: '6px 12px',
        background: 'transparent',
      },
    },
    sizesListContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
      gap: 'var(--spacing-3)',
      width: '100%',
    },

    sizesListItem: {
      minWidth: '64px',
      position: 'relative',
      height: '48px',
      borderRadius: 'var(--border-radius-full)',
      overflow: 'hidden',
      padding: '14px 18px 12px 18px',
      border: '1px solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    },

    sizesListItemActive: {
      borderColor: 'var(--color-black-base)',
      bg: 'var(--color-black-base)',
    },

    sizesListItemInactive: {
      borderColor: 'var(--color-neutral-light-2, #E1E1E1)',
      bg: 'var(--color-white-base)',
    },

    sizesListItemEnabled: {
      cursor: 'pointer',
      opacity: 1,

      _hover: {
        borderColor: 'var(--color-black-base)',
      },

      _active: {
        transform: 'scale(0.98)',
      },
    },

    sizesListItemDisabled: {
      cursor: 'not-allowed',
      opacity: 1,
      border: '1.5px solid var(--color-neutral-base, #949494)',
      bg: 'var(--color-neutral-light-2, #E1E1E1)',
      position: 'relative',

      _hover: {
        borderColor: 'var(--color-neutral-base, #949494)',
      },

      _after: {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '25px',
        height: '1.5px',
        bg: 'var(--color-neutral-base, #949494)',
        transform: 'translate(-50%, -50%) rotate(-30deg)',
        transformOrigin: 'center',
        pointerEvents: 'none',
      },
    },
    sizesListText: {
      ...theme.typography['text-body1-l'],
      fontWeight: 400,
      fontSize: 'var(--text-16)',
      fontStyle: 'normal',
      marginTop: 0,
      color: 'var(--color-black-base)',
      lineHeight: 'var(--line-height-135)',
      position: 'relative',
    },

    sizesListTextActive: {
      color: 'var(--color-white-base)',
    },

    sizesListTextInactive: {
      color: 'var(--color-black-base)',
    },

    sizesListTextDisabled: {
      color: 'var(--color-neutral-base, #949494)',
    },

    recommendedShoeSizeContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      mt: 'var(--spacing-6)',
      p: 'var(--spacing-3)',
      bg: 'var(--color-background-cta-pill-bg)',
      borderRadius: 'var(--border-radius-xl)',
    },
    recommendedShoeSizeText: {
      ...theme.typography['text-body2-m'],
      color: 'var(--color-primary, #000000)',
      fontWeight: 500,
      lineHeight: 'var(--line-height-135)',
    },
    recommendedShoeSizeTextSecond: {
      ...theme.typography['text-body2-m'],
      color: 'var(--color-primary, #000000)',
      fontSize: 'var(--spacing-3)',
      fontWeight: 400,
      lineHeight: 'var(--line-height-125)',
    },
    recommendedFitGuideButton: {
      minHeight: '36px',
      borderRadius: 'var(--border-radius-full)',
      padding: 'var(--spacing-2) var(--spacing-3)',
      bg: 'var(--color-white-base)',
    },
    recommendedFitGuideButtonText: {
      ...theme.typography['text-title2-xs'],
      color: 'var(--color-primary, #000003)',
      fontSize: 'var(--spacing-3)',
      textAlign: 'center',
      fontWeight: 500,
      lineHeight: 'var(--line-height-125)',
      textTransform: 'capitalize',
    },
    variationMessagesWrap: {
      width: '100%',
      mb: 'var(--spacing-2)',
      '& .product-info-message-alert': {
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 'var(--border-radius-full)',
        bg: 'var(--color-neutral-light-1, #F0F0F0)',
        mb: 'var(--spacing-1)',
        px: 'var(--spacing-2)',
        py: 'var(--spacing-3)',
        minHeight: '48px',
        alignItems: 'center',
      },
      '& .product-info-message-alert .chakra-text': {
        fontWeight: 500,
        maxWidth: '250px',
      },
      '& .product-info-message-alert > div:first-of-type > :first-child': {
        alignSelf: 'center',
        mt: 0,
      },
    },
  }),
}
