import Select from 'toro/components/Select'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { CaretDownIcon as ArrowDownIcon } from 'toro/icons'
import ArrowUpIcon from 'design-tokens/icon/utility/chevron-up.svg'
import { useAtomValue } from 'jotai/utils'
import { isTabbedAdaptivePDPEligibleAtom } from 'store/pdp.atom'
import { useMemo } from 'react'

export default function ToroSelect({ options = [], onChange, variant, ...props }) {
  const styles = useMultiStyleConfig('ToroSelect', { variant })
  const isAdaptiveTabbedPDP = useAtomValue(isTabbedAdaptivePDPEligibleAtom)
  const Icon = useMemo(
    () => (
      <Box
        sx={{
          '& svg': {
            transform: 'scale(2.4)',
          },
        }}
      >
        {isAdaptiveTabbedPDP || variant === 'desktopV5Template' ? (
          <ArrowUpIcon width={8} height={8} viewBox="0 0 24 24" />
        ) : (
          <ArrowDownIcon width={10} height={10} viewBox="0 0 24 24" />
        )}
      </Box>
    ),
    [isAdaptiveTabbedPDP]
  )
  function handleOnChange(e) {
    const selectedOption = options.find((o) => `${o.value}` === e.target.value)
    if (selectedOption !== undefined) {
      onChange && onChange(selectedOption)
    }
  }

  return (
    <Select
      width="auto"
      variant="primary"
      icon={Icon}
      iconSize="10px"
      onChange={handleOnChange}
      sx={styles.select}
      {...props}
    >
      {options.map((item) => {
        return (
          <option key={`option-${item.value}`} value={item.value}>
            {item.label}
          </option>
        )
      })}
    </Select>
  )
}
