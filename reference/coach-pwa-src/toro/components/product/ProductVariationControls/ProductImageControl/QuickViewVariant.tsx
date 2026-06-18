import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import useViewportType from 'toro/hooks/useViewportType'
import useTheme from 'toro/hooks/useTheme'

function QuickViewVariant({
  alt,
  styles,
  onClick,
  classes,
  selected,
  disabled,
  imageSrc,
  labelValue,
  qvImageSrc,
  productIdAttr,
}) {
  const theme = useTheme()
  const { isDesktop } = useViewportType()

  return (
    <Box
      cursor="pointer"
      m={`0 ${theme.space.s1} ${theme.space.sm1}`}
      maxWidth="80px"
      as="button"
      borderRadius={theme.borderRadius.rounded}
      border={
        selected ? `${theme.borderWidth.default} solid` : `${theme.borderWidth.default} solid`
      }
      borderColor={selected ? theme.colors.black : theme.colors.white}
      padding={selected ? '3px' : 0}
      boxSizing="content-box"
      className={classes}
      data-product-id={productIdAttr}
      data-color-text={labelValue}
      onClick={onClick}
      sx={
        selected
          ? { ...styles.QVProductImageSwatchBox, ...styles.qvImageSwatchSelected }
          : { ...styles.QVProductImageSwatchBox }
      }
      title={labelValue}
    >
      <Image
        borderRadius="50%"
        w="32px"
        h="32px"
        cursor="pointer"
        src={qvImageSrc || imageSrc}
        alt={alt}
        title={labelValue}
        lazy={!isDesktop}
        fetchpriority="low"
        sx={styles.QVProductImageSwatch}
        data-qa={
          selected
            ? 'cm_link_color_swatch_slctd'
            : disabled
            ? 'cm_link_color_swatch_dsbld'
            : !disabled
            ? 'cm_link_color_swatch_enbld'
            : ''
        }
      />
    </Box>
  )
}

export default QuickViewVariant
