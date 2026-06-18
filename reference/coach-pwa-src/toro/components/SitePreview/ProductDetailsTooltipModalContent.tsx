import { useCallback, useEffect, useState } from 'react'
import { Heading, Button, Input, VStack } from '@chakra-ui/react'
import {
  enableProductDetailsTooltip,
  productDetailsTooltipDataPathsAtom,
} from 'store/site-preview.atom'
import useDebounce from 'toro/helpers/useDebounce'
import { useAtom } from 'jotai'

const DEBOUNCE_TIME = 500

const ProductDetailsTooltipModalContent = ({ onClose, onSubmit }) => {
  const [isTooltipEnabled, setIsTooltipEnabled] = useAtom(enableProductDetailsTooltip)
  const [paths, setAttributePaths] = useAtom(productDetailsTooltipDataPathsAtom)
  const [currentPaths, setPaths] = useState(paths)

  const updatePath = useCallback((index, value) => {
    setPaths((prev) => {
      const newList = [...prev]
      newList.splice(index, 1, value)
      return newList
    })
  }, [])

  const onAddAttribute = useCallback(() => {
    setPaths((prev) => {
      const newList = [...prev]
      newList.push('')
      return newList
    })
  }, [])

  const onEnableTooltip = useCallback(() => {
    onClose()
    onSubmit()
    setIsTooltipEnabled(true)
    setAttributePaths(currentPaths)
  }, [currentPaths])

  const onDisableTooltip = useCallback(() => {
    onClose()
    onSubmit()
    setIsTooltipEnabled(false)
  }, [])

  const isAnyAttributeEmpty = currentPaths.some((path) => !path)

  return (
    <>
      <Heading size="md" mb="1rem">
        Product attribute paths
      </Heading>
      <VStack>
        {currentPaths.map((path, index) => (
          <PathInput
            key={index}
            size="sm"
            index={index}
            initialValue={path}
            onChange={updatePath}
          />
        ))}
        <Button
          size="xs"
          p="10px"
          disabled={isAnyAttributeEmpty}
          alignSelf="flex-end"
          onClick={onAddAttribute}
        >
          Add attribute path
        </Button>
      </VStack>
      <VStack mt="1rem">
        <Button w="100%" onClick={onEnableTooltip}>
          {isTooltipEnabled ? 'Update' : 'Enable'} tooltip
        </Button>
        {isTooltipEnabled && (
          <Button w="100%" onClick={onDisableTooltip}>
            Disable tooltip
          </Button>
        )}
        <Button w="100%" onClick={onClose}>
          Back
        </Button>
      </VStack>
    </>
  )
}

const PathInput = ({ initialValue, index, onChange, ...props }) => {
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, DEBOUNCE_TIME)

  useEffect(() => {
    onChange(index, debouncedValue)
  }, [debouncedValue])

  return <Input size="sm" value={value} onChange={(e) => setValue(e.target.value)} {...props} />
}

export default ProductDetailsTooltipModalContent
