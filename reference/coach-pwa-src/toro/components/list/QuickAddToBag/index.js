import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Text from 'toro/components/Text'
import { AddToBagIcon } from 'toro/icons'
import { useAtomValue } from 'jotai/utils'
import { isPlpV3Atom } from 'store/plp.atom'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'

const QuickAddToBag = ({
  onClick,
  isProductSet,
  disabled,
  variant = undefined,
  showOnLegacy = undefined,
  isMaxQuantityReached = undefined,
}) => {
  const isPlpV3 = useAtomValue(isPlpV3Atom)
  const { wrapper, button, icon } = useMultiStyleConfig('QuickAddToBag', {
    variant: variant || (isPlpV3 && 'plpV3'),
  })
  const dataQa = isProductSet ? 'bundle_product' : 'add_to_bag_pdt_img'
  const disabledOrMaxQuantityReached = disabled || isMaxQuantityReached
  const { formatMessage } = useIntl()
  return isPlpV3 || showOnLegacy ? (
    <>
      <Box align="center" sx={wrapper}>
        <Button
          data-qa={dataQa}
          variant="button"
          disabled={disabledOrMaxQuantityReached}
          w="100%"
          onClick={onClick}
          sx={button}
          className="plpV2OrV3Atc"
        >
          {!isMaxQuantityReached && (
            <AddToBagIcon
              fill={disabled ? 'var(--color-neutral-base)' : 'var(--color-black-base)'}
              {...icon}
            />
          )}
          <Text
            variant="primary"
            fontSize="var(--text-10)"
            lineHeight="var(--line-height-xl)"
            letterSpacing="0"
            className="atb-text"
          >
            {isMaxQuantityReached
              ? formatMessage({
                  id: 'plp.itemLimitReachedText',
                  defaultMessage: 'Item Limit Reached',
                })
              : formatMessage({
                  id: 'plp.addToBagText',
                  defaultMessage: 'Add to Bag',
                })}
          </Text>
        </Button>
      </Box>
    </>
  ) : (
    <Box sx={wrapper}>
      <Button
        data-qa={dataQa}
        variant="icon-only"
        disabled={disabled}
        onClick={onClick}
        sx={button}
        className="addToBag"
      >
        <AddToBagIcon {...icon} />
      </Button>
    </Box>
  )
}

export default QuickAddToBag
