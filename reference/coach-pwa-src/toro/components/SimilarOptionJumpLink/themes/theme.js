const overlayPosition = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  position: 'absolute',
}

const shrinkContainer = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

export default {
  baseStyle: ({ theme }) => ({
    similarOptionJumpLinkOverlay: {
      ...overlayPosition,
      backgroundColor: 'var(--color-scrim-dark)',
      zIndex: '11',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        backdropFilter: 'blur(10px)',
        backgroundColor: 'var(--color-black-80)',
      },
    },
    similarOptionJumpLinkContainer: {
      ...overlayPosition,
      w: '100%',
      h: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '12',
    },
    similarOptionJumpLinkText: {
      ...theme.typography['text-display1-m'],
      fontFamily: 'var(--font-face1-bold)',
      color: 'var(--color-text-cta-primary)',
      fontSize: 'var(--text-26)',
      letterSpacing: 'var(--letter-spacing-xs)',
      fontStyle: 'normal',
      mb: '18px',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        w: '75%',
        textAlign: 'center',
      },
    },
    similarOptionJumpLinkButtom: {
      letterSpacing: 'var(--letter-spacing-xl)',
      lineHeight: 'var(--line-height-115)',
      textTransform: 'uppercase',
      [`@media (max-width: ${theme.breakpoints.sm})`]: {
        borderRadius: 'full',
      },
    },
    viewMoreOverlay: {
      ...overlayPosition,
      borderRadius: 'var(--border-radius-m)',
      backdropFilter: 'blur(6px)',
      backgroundColor: 'var(--color-scrim-dark)',
      display: 'flex',
    },
    similarOptionsContainer: {
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
    },
    viewMoreSimilarButton: {
      borderRadius: '130px',
      border: '1px solid var(--color-neutral-light-2)',
      background: 'var(--color-white-base)',
      padding: '10px 14px 10px var(--spacing-3)',
      marginTop: 'var(--spacing-4)',
      fontSize: 'var(--text-14)',
      fontWeight: 500,
      lineHeight: 'var(--line-height-135)',
      marginBottom: 'var(--spacing-8)',
    },
    viewMoreButtonText: {
      ...theme.typography['text-cta2-xs'],
      fontWeight: 400,
      marginTop: '3px',
      textTransform: 'none',
    },
    similarOptionsTitle: {
      ...theme.typography['text-display4-xs'],
      paddingTop: '22px',
      paddingBottom: 'var(--spacing-4)',
      fontWeight: 400,
      color: 'var(--color-white-base)',
      letterSpacing: 'var(--letter-spacing-s)',
      lineHeight: 'var(--line-height-135)',
      textAlign: 'center',
    },
  }),
  variants: {
    pdpv6: ({ theme }) => ({
      similarOptionJumpLinkOverlay: {
        display: 'none',
      },
      similarOptionJumpLinkContainer: {
        position: 'static',
        height: '178px',
        width: 'calc(100% - 144px)',
        maxWidth: 'min(252px, calc(100% - 144px))',
        backdropFilter: 'blur(6px)',
        background: 'rgba(255, 255, 255, 0.62)',
        boxShadow:
          '0 226px 63px 0 rgba(0, 0, 0, 0.00), 0 145px 58px 0 rgba(0, 0, 0, 0.01), 0 81px 49px 0 rgba(0, 0, 0, 0.05), 0 36px 36px 0 rgba(0, 0, 0, 0.09), 0 9px 20px 0 rgba(0, 0, 0, 0.10)',
        padding: '0 var(--spacing-6)',
        borderRadius: '18px',
      },
      similarOptionJumpLinkText: {
        ...theme.typography['text-display1-xs'],
        letterSpacing: 'var(--letter-spacing-s)',
        fontWeight: 700,
        color: 'var(--color-black-base)',
        width: 'auto !important',
        mb: 'var(--spacing-3)',
      },
      similarOptionJumpLinkButtom: {
        ...theme.typography['text-cta1-xs'],
        letterSpacing: 'var(--letter-spacing-xs)',
        fontWeight: 400,
        color: 'var(--color-white-base)',
        padding: 'var(--spacing-2) 9px var(--spacing-2) var(--spacing-3)',
        background: 'var(--color-black-base)',
        border: 'none',
        borderRadius: '8px !important',
        height: '32px',
        textTransform: 'none',
        gap: '6px',
        '& svg path': {
          stroke: 'var(--color-white-base)',
        },
      },
      viewMoreOverlay: {
        position: 'static',
        borderRadius: '18px',
        background: 'rgba(255, 255, 255, 0.62)',
        boxShadow:
          '0 226px 63px 0 rgba(0, 0, 0, 0.00), 0 145px 58px 0 rgba(0, 0, 0, 0.01), 0 81px 49px 0 rgba(0, 0, 0, 0.05), 0 36px 36px 0 rgba(0, 0, 0, 0.09), 0 9px 20px 0 rgba(0, 0, 0, 0.10)',
        padding: 'var(--spacing-6)',
        maxWidth: '292px',
        // Constrain to carousel slide so overlay shrinks when slide height is reduced (max 367px when space allows)
        height: 'calc(100% - 10px)', // -10px to have some margin from carousel slide borders
        maxHeight: 'min(367px, calc(100% - 10px))',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      },
      similarOptionsContainer: {
        ...shrinkContainer,
        // Allow the grid wrapper (2nd child) to shrink
        '& > *:nth-child(2)': {
          ...shrinkContainer,
        },
      },
      similarOptionsTitle: {
        ...theme.typography['text-display1-xs'],
        letterSpacing: 'var(--letter-spacing-s)',
        fontWeight: 700,
        color: 'var(--color-black-base)',
        paddingTop: 'var(--spacing-0)',
        paddingBottom: 'var(--spacing-3)',
      },
      viewMoreSimilarButton: {
        textTransform: 'none',
        fontSize: 'var(--text-10)',
        fontWeight: 400,
        letterSpacing: 'var(--letter-spacing-xs)',
        padding: 'var(--spacing-2) 9px var(--spacing-2) var(--spacing-3)',
        marginTop: 'var(--spacing-3)',
        marginBottom: 'var(--spacing-0)',
        background: 'var(--color-black-base)',
        border: 'none',
        borderRadius: '8px',
        height: '32px',
      },
      viewMoreButtonText: {
        ...theme.typography['text-cta1-xs'],
        letterSpacing: 'var(--letter-spacing-xs)',
        textTransform: 'none',
        color: 'var(--color-white-base)',
        display: 'flex',
        alignItems: 'center',
        margin: '0',
        gap: '6px',
        '& svg path': {
          stroke: 'var(--color-white-base)',
        },
      },
      similarOptionsProductsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gridAutoRows: 'minmax(0, 1fr)',
        gap: 'var(--spacing-1)',
        flex: 1,
        overflow: 'hidden',
        alignItems: 'center',
        '& > *': {
          aspectRatio: '1 / 1',
          height: '100%',
          width: 'auto',
          overflow: 'hidden',
          alignSelf: 'stretch',
        },
        '& > *:nth-child(odd)': {
          justifySelf: 'flex-end',
        },
        '& > *:nth-child(even)': {
          justifySelf: 'flex-start',
        },
      },
    }),
    adaptiveTabbedPDP: ({ theme }) => ({
      similarOptionJumpLinkOverlay: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '56px var(--spacing-4) 28px',
          borderRadius: 'var(--spacing-3)',
        },
      },
      similarOptionJumpLinkOverlayCustomPaginationPosition: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          margin: '56px var(--spacing-4) 40px',
          borderRadius: 'var(--spacing-3)',
        },
      },
      similarOptionJumpLinkText: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          fontSize: 'var(--text-24)',
          letterSpacing: 'var(--letter-spacing-s)',
          marginTop: '56px',
          padding: '0 var(--spacing-3)',
        },
      },
      similarOptionJumpLinkButtom: {
        [`@media (max-width: ${theme.breakpoints.sm})`]: {
          textTransform: 'none',
          fontSize: 'var(--text-10)',
          fontWeight: 500,
          letterSpacing: 'var(--letter-spacing-xs)',
          padding: '14px var(--spacing-4) 13px',
          color: 'var(--color-black-base)',
        },
      },
    }),
  },
}
