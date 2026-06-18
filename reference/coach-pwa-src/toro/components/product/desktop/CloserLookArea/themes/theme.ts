export default {
  baseStyle: ({ theme, headerHeight }) => ({
    closerLookSection: {
      position: 'relative',
      paddingBottom: '112px',
    },
    gridWrapperContainer: {
      padding: '0 60px',
      justifyContent: 'center',
    },
    gridContainer: {
      backgroundColor: 'var(--neutrals-color-neutral-light, #F7F7F7)',
      borderRadius: '18px',
      overflow: 'hidden',
      justifyContent: 'center',
      flex: `0 1 ${theme.breakpoints.xlx}`,
      maxHeight: `calc(100vh - ${headerHeight}px - 96px - 12px)`, // 96px is the height of the StickyBar + 12px to give space between CL
    },
    column: {
      flex: '1 0 50%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '569px',
    },
    rightColumn: {
      padding: '20px clamp(20px, calc(10% - 10px), 188px)',
    },
    image: {
      objectFit: 'cover',
      objectPosition: 'center',
      width: '100%',
      height: '100%',
    },
    closerLookHeading: {
      ...theme.typography['text-display4-xl'],
      color: '#000',
      marginBottom: '14px',
      textAlign: 'center',
      textTransform: 'lowercase',
      '&::first-letter': {
        textTransform: 'uppercase',
      },
    },
    closerLookText: {
      ...theme.typography['text-body1-xl'],
      color: 'var(--color-neutral-medium, #575757)',
      minWidth: '250px',
      maxWidth: '312px',
    },
    skeletonContainer: {
      margin: '0 auto',
    },
  }),
}
