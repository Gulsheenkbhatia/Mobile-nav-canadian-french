import React, { useCallback } from 'react'
import Text from 'toro/components/Text'
import Button from 'toro/components/Button'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function Tag({ variant, text, data, handleFilterChange, iconComponent = null, dataQa, ...props }) {
  const styles = useMultiStyleConfig('Tag', {
    variant,
  })

  const handleClick = useCallback(() => {
    if (data) {
      handleFilterChange({
        optionRefValue: data.refvalue,
        refinement: data,
        targetContent: 'tag',
      })
    }
  }, [data])

  return (
    <Button
      variant={variant ?? 'tag'}
      onClick={handleClick}
      {...props}
      data-qa={dataQa.appliedFilterCategory + `_${data.type}_${data.refvalue}`}
    >
      <Text
        variant="body-primary"
        size="sm"
        textTransform="capitalize"
        data-qa={dataQa.appliedFilterLabel}
        sx={styles.appliedFilterText}
      >
        {text}
      </Text>
      {iconComponent ?? (
        <Text
          variant="body-primary"
          size="sm"
          className="filterIconRemove"
          textTransform="capitalize"
          sx={styles.appliedFilterLabelRemove}
          data-qa={dataQa.appliedFilterLabelRemove}
        >
          &times;
        </Text>
      )}
    </Button>
  )
}

export default Tag
