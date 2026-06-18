import Box from 'toro/components/Box'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Image from 'toro/components/Image'
import HtmlContent from 'toro/components/HtmlContent'
import useViewportType from 'toro/hooks/useViewportType'

function DefaultVariant({
  alt,
  styles,
  onClick,
  classes,
  selected,
  disabled,
  imageSrc,
  labelValue,
  productIdAttr,
  isItemHidden,
  lazyOffset,
  monogramFontName,
  monogramInitialsHtml,
}) {
  const { viewport, isDesktop } = useViewportType()

  return (
    <Box
      sx={
        selected
          ? {
              ...styles.pdpImageSwatchBox,
              ...styles.pdpImageSwatchSelected,
              ...styles.selectBorders,
            }
          : { ...styles.pdpImageSwatchBox }
      }
      w="80px"
      h="95px"
      as="button"
      position="relative"
      boxSizing="content-box"
      className={classes}
      data-product-id={productIdAttr}
      data-color-text={labelValue}
      onClick={onClick}
      display={isItemHidden ? 'none' : 'block'}
      data-qa={
        selected
          ? 'cm_link_color_swatch_slctd'
          : disabled
          ? 'cm_link_color_swatch_dsbld'
          : 'cm_link_color_swatch_enbld'
      }
      title={labelValue}
    >
      <Experiment forIDs={EXPERIMENTS.PDP_V3} forMobile>
        <Image
          sx={styles.pdpImageSwatch}
          w="100%"
          objectFit="cover"
          src={imageSrc}
          alt={alt}
          title={labelValue}
          lazy={!isDesktop}
          fetchpriority="low"
          lazyOffset={lazyOffset}
          aspectImgRatio={'1'}
          pdp={viewport === 'mobile'}
        />
      </Experiment>
      <Experiment notForIDs={EXPERIMENTS.PDP_V3} alwaysOnForDesktop>
        <Image
          sx={styles.pdpImageSwatch}
          w="100%"
          objectFit="cover"
          src={imageSrc}
          alt={alt}
          title={labelValue}
          lazy={!isDesktop}
          fetchpriority="low"
          lazyOffset={lazyOffset}
          aspectImgRatio={'0.84'}
          pdp={viewport === 'mobile'}
        />
      </Experiment>
      {!!monogramInitialsHtml && (
        <Box
          as="span"
          className="customization_monogram customization_monogram--stamp"
          position="absolute"
          sx={styles.swatchMonogramWrapper}
        >
          <Box
            as="span"
            className="customization_initials"
            sx={styles.swatchMonogramContainer(monogramFontName)}
          >
            <HtmlContent content={monogramInitialsHtml} />
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default DefaultVariant
