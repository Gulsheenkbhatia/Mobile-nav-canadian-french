import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import ScrollableSwatches from 'toro/components/ScrollableSwatches'
import { Color } from 'toro/components/Swatches'

type ColorSwatchesProps = {
  colors: Color[]
  onChange: (color: Color) => void
  activeColorId: string | undefined
}

const ColorSwatches = ({ activeColorId, colors, onChange }: ColorSwatchesProps) => {
  const styles = useMultiStyleConfig('ColorSwatches')

  return (
    <ScrollableSwatches
      minHeight="50px"
      activeColorId={activeColorId}
      colors={colors}
      onChange={onChange}
      sx={styles.tileSwatchWrapper || {}}
      styles={styles.productColorSwatches || {}}
      className="product-color-swatches-wrapper"
      variant="pdpv6ColorSwatch"
      lazy={false}
    />
  )
}

export default ColorSwatches
