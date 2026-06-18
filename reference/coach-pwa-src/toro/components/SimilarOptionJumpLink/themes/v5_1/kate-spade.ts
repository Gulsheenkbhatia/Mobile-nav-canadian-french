const shrinkContainer = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}

export default {
  variants: {
    similarOptionPDPv5_1: ({ theme }) => ({
      similarOptionJumpLinkOverlay: {
        display: 'none',
      },
      similarOptionJumpLinkContainer: {
        position: 'static',
        height: 'auto',
        width: 'auto',
        backdropFilter: 'blur(6px)',
        background: 'rgba(255, 255, 255, 0.62)',
        boxShadow:
          '0 226px 63px 0 rgba(0, 0, 0, 0.00), 0 145px 58px 0 rgba(0, 0, 0, 0.01), 0 81px 49px 0 rgba(0, 0, 0, 0.05), 0 36px 36px 0 rgba(0, 0, 0, 0.09), 0 9px 20px 0 rgba(0, 0, 0, 0.10)',
        padding: 'var(--spacing-10)',
        borderRadius: '24px',
      },
      similarOptionJumpLinkText: {
        ...theme.typography['text-display2-l'],
        color: 'var(--color-black-base)',
        mb: 'var(--spacing-6)',
        fontWeight: 400,
        textAlign: 'center',
      },
      similarOptionJumpLinkButtom: {
        ...theme.typography['text-body2-l'],
        color: 'var(--color-white-base)',
        padding: 'var(--spacing-2) 9px var(--spacing-2) var(--spacing-3)',
        background: 'var(--color-black-base)',
        border: 'none',
        borderRadius: 'var(--border-radius-m)',
        height: '40px',
        textTransform: 'none',
        gap: '6px',
        '& svg path': {
          stroke: 'var(--color-white-base)',
        },
      },
      viewMoreOverlay: {
        position: 'static',
        margin: 0,
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.62)',
        boxShadow:
          '0 226px 63px 0 rgba(0, 0, 0, 0.00), 0 145px 58px 0 rgba(0, 0, 0, 0.01), 0 81px 49px 0 rgba(0, 0, 0, 0.05), 0 36px 36px 0 rgba(0, 0, 0, 0.09), 0 9px 20px 0 rgba(0, 0, 0, 0.10)',
        padding: 'var(--spacing-10)',
        maxWidth: '484px',
        // Constrain to carousel slide so overlay shrinks when slide height is reduced (max 616px when space allows)
        height: 'calc(100% - 10px)',
        maxHeight: 'min(616px, calc(100% - 10px))',
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
        ...theme.typography['text-display2-l'],
        color: 'var(--color-black-base)',
        paddingTop: 'var(--spacing-0)',
        paddingBottom: 'var(--spacing-6)',
        fontWeight: 400,
      },
      viewMoreSimilarButton: {
        textTransform: 'none',
        fontSize: 'var(--text-16)',
        padding: 'var(--spacing-2) 9px var(--spacing-2) var(--spacing-3)',
        marginTop: 'var(--spacing-6)',
        marginBottom: 'var(--spacing-0)',
        background: 'var(--color-black-base)',
        border: 'none',
        borderRadius: 'var(--border-radius-m)',
        height: '40px',
      },
      viewMoreButtonText: {
        ...theme.typography['text-body2-l'],
        textTransform: 'none',
        color: 'var(--color-white-base)',
        display: 'flex',
        alignItems: 'center',
        margin: 0,
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
  },
}
