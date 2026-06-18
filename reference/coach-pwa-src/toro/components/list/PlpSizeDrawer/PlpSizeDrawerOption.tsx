import { memo } from 'react'
import PropTypes from 'prop-types'
import Button from 'toro/components/Button'
import Text from 'toro/components/Text'

type PlpSizeDrawerOptionProps = {
  text: string
  selected: boolean
  disabled: boolean
  clickHandler: (id: string) => void | Promise<void>
  id: string
}

const PlpSizeDrawerOption = ({
  text,
  selected,
  disabled,
  clickHandler,
  id,
}: PlpSizeDrawerOptionProps): JSX.Element => {
  return (
    <Button
      variant="plp-variation-option"
      className={selected ? 'selected' : null}
      disabled={disabled}
      onClick={() => clickHandler(id)}
      padding="var(--spacing-6)"
      data-qa="sizeDrawerOption"
    >
      <Text variant="body-primary-md" size="sm">
        {text}
      </Text>
    </Button>
  )
}

PlpSizeDrawerOption.propTypes = {
  text: PropTypes.string,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  clickHandler: PropTypes.func,
  id: PropTypes.string,
}

PlpSizeDrawerOption.defaultProps = {
  text: '',
  selected: false,
  disabled: false,
  clickHandler: () => {},
  id: '',
}

export default memo(PlpSizeDrawerOption)
