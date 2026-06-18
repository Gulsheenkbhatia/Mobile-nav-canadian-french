import { memo } from 'react'
import ColorButton from 'toro/components/ColorButton'

function FilterColorButton({ option = {}, refinement, onChange, colorText }) {
  function handleClick(e) {
    e?.preventDefault()
    const targetContent = e?.target?.textContent

    option.selectable && onChange({ optionRefValue: option?.refvalue, refinement, targetContent })
  }

  return (
    <ColorButton
      size="sm"
      onClick={handleClick}
      color={option.swatchID}
      data-qa={getDataQA(option)}
      selected={option.isSelected}
      disabled={!option.selectable}
      colorText={colorText}
      aria-label={colorText}
      aria-pressed={option.isSelected}
      aria-disabled={!option.selectable}
    />
  )
}

function getDataQA(option) {
  return option.isSelected === true
    ? 'plpfltr_link_fltr_color_swatch_slctd'
    : option.selectable === true
    ? 'plpfltr_link_fltr_color_swatch_enbld'
    : 'plpfltr_link_fltr_color_swatch_dsbld'
}

export default memo(FilterColorButton)
