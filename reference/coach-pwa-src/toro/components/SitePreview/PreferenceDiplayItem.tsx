import {
  Input,
  ButtonGroup,
  Button,
  Stack,
  RadioGroup,
  Radio,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
} from '@chakra-ui/react'
import { ComponentType, Fragment, useCallback, useMemo, useState } from 'react'
import Flex from 'toro/components/Flex'
import Textarea from 'toro/components/Textarea'
import Text from 'toro/components/Text'

const JSON_LINE_HEIGHT = 18
const MAX_TEXTAREA_HEIGHT = 500

type ParsedPreferenceValue = string | boolean | number | Record<string, any>

type PreferenceEditFieldProps = {
  value: ParsedPreferenceValue | ParsedPreferenceValue[]
  onChange: (value: ParsedPreferenceValue) => void
  Controls?: ComponentType<PreferenceEditControlProps | PreferenceListEditControlProps>
}

type PreferenceEditComponent = ComponentType<PreferenceEditFieldProps>

interface PreferenceEditControlProps {
  initialValue: ParsedPreferenceValue
  currentValue: ParsedPreferenceValue
  onChange: (value: ParsedPreferenceValue) => void
  onReset: () => void
}

interface PreferenceListEditControlProps extends Partial<PreferenceEditControlProps> {
  onAdd?: (value: ParsedPreferenceValue) => void
  onRemove?: () => void
}

export const NumberEditField: PreferenceEditComponent = ({
  value: initialValue,
  onChange,
  Controls = PreferenceControls,
}) => {
  const [value, setValue] = useState(initialValue)

  return (
    <>
      <NumberInput value={value as number} onChange={(value) => setValue(Number(value))}>
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Controls
        initialValue={initialValue}
        currentValue={value}
        onChange={onChange}
        onReset={() => setValue(initialValue)}
      />
    </>
  )
}

export const StringEditField: PreferenceEditComponent = ({
  value: initialValue,
  onChange,
  Controls = PreferenceControls,
}) => {
  const [value, setValue] = useState(initialValue)

  return (
    <>
      <Input
        width="100%"
        variant="outline"
        size="sm"
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
      />
      <Controls
        initialValue={initialValue}
        currentValue={value}
        onChange={onChange}
        onReset={() => setValue(initialValue)}
      />
    </>
  )
}

export const BooleanEditField: PreferenceEditComponent = ({
  value: initialValue,
  onChange,
  Controls = PreferenceControls,
}) => {
  const [value, setValue] = useState(String(initialValue))

  return (
    <>
      <RadioGroup onChange={setValue} value={value}>
        <Stack spacing={5} direction="row">
          <Radio value="true">true</Radio>
          <Radio value="false">false</Radio>
        </Stack>
      </RadioGroup>
      <Controls
        initialValue={String(initialValue)}
        currentValue={value}
        onChange={() => onChange(value === 'true')}
        onReset={() => setValue(String(initialValue))}
      />
    </>
  )
}

const parseJsonInput = (text: string) => {
  try {
    return { result: JSON.parse(text) }
  } catch {
    return { error: 'Invalid JSON input.' }
  }
}

export const JsonEditField: PreferenceEditComponent = ({
  value: initialValue,
  onChange,
  Controls = PreferenceControls,
}) => {
  const stringifiedObject = JSON.stringify(initialValue, null, 4)
  const [value, setValue] = useState(stringifiedObject)
  const [inputError, setInputError] = useState('')

  const initialHeight = Math.min(
    24 + stringifiedObject.split('\n').length * JSON_LINE_HEIGHT,
    MAX_TEXTAREA_HEIGHT
  )

  const handleJsonInput = useCallback((value) => {
    const { result, error } = parseJsonInput(value)
    setInputError(error)
    if (result) {
      onChange(result)
      return
    }
  }, [])

  const handleReset = useCallback(() => {
    setInputError('')
    setValue(stringifiedObject)
  }, [stringifiedObject])

  return (
    <>
      <Textarea
        value={value}
        fontSize="sm"
        height={initialHeight}
        onChange={(e) => setValue(e.target.value)}
        isInvalid={Boolean(inputError)}
      />
      {inputError && (
        <Text mt="1" fontSize="xs" color="red">
          {inputError}
        </Text>
      )}
      <Controls
        initialValue={stringifiedObject}
        currentValue={value}
        onChange={handleJsonInput}
        onReset={handleReset}
      />
    </>
  )
}

export const ListEditField: PreferenceEditComponent = ({ value: initialValue, onChange }) => {
  const [value, setValue] = useState(initialValue as ParsedPreferenceValue[])

  const { ListItemComponent, newValue } = useMemo(() => {
    const listType = typeof value?.[0] || 'object'
    switch (listType) {
      case 'string':
        return { ListItemComponent: StringEditField, newValue: '' }
      case 'number':
        return { ListItemComponent: NumberEditField, newValue: 0 }
      case 'boolean':
        return { ListItemComponent: BooleanEditField, newValue: true }
      default:
        return { ListItemComponent: JsonEditField, newValue: {} }
    }
  }, [])

  const onItemChange = useCallback((value, index) => {
    setValue((prev) => {
      const newValue = [...prev]
      newValue.splice(index, 1, value)
      return newValue
    })
  }, [])

  const onItemAdd = useCallback((value) => {
    setValue((prev) => {
      const newValue = [...prev, value]
      return newValue
    })
  }, [])

  const onItemRemove = useCallback((index) => {
    setValue((prev) => {
      const newValue = [...prev]
      newValue.splice(index, 1)
      return newValue
    })
  }, [])

  return (
    <>
      {value?.map((item, index) => (
        <Fragment key={`list-item-${index}-${item}`}>
          <ListItemComponent
            value={item}
            onChange={(value) => onItemChange(value, index)}
            Controls={(props) => (
              <ListItemControls {...props} onRemove={() => onItemRemove(index)} />
            )}
          />
          <Divider mb="2" />
        </Fragment>
      ))}
      <ListItemComponent
        value={newValue}
        onChange={(itemValue) => onItemChange(itemValue, value?.length)}
        Controls={({ currentValue, onReset }) => (
          <ListItemControls currentValue={currentValue} onAdd={onItemAdd} onReset={onReset} />
        )}
      />
    </>
  )
}

export const PreferenceControls: ComponentType<PreferenceEditControlProps> = ({
  initialValue,
  currentValue,
  onChange,
  onReset,
}) => {
  return (
    <Flex justifyContent="flex-end">
      <ButtonGroup mt="2">
        <Button
          bg="green.500"
          h="2"
          borderRadius="md"
          disabled={initialValue === currentValue}
          onClick={() => onChange(currentValue)}
        >
          Apply
        </Button>
        <Button h="2" borderRadius="md" disabled={initialValue === currentValue} onClick={onReset}>
          Reset
        </Button>
      </ButtonGroup>
    </Flex>
  )
}

export const ListItemControls: ComponentType<PreferenceListEditControlProps> = ({
  initialValue,
  currentValue,
  onAdd,
  onRemove,
  onChange,
  onReset,
}) => {
  return (
    <Flex justifyContent="flex-end">
      <ButtonGroup my="2">
        {!!initialValue && (
          <>
            <Button
              bg="green.500"
              h="2"
              borderRadius="md"
              disabled={initialValue === currentValue}
              onClick={() => onChange(currentValue)}
            >
              Apply
            </Button>
            <Button
              h="2"
              borderRadius="md"
              disabled={initialValue === currentValue}
              onClick={onReset}
            >
              Reset
            </Button>
            <Button bg="red.500" h="2" borderRadius="md" onClick={onRemove}>
              Remove
            </Button>
          </>
        )}
        {!initialValue && (
          <Button
            bg="blue.500"
            h="2"
            borderRadius="md"
            onClick={() => {
              onAdd(currentValue)
              onReset()
            }}
          >
            Add
          </Button>
        )}
      </ButtonGroup>
    </Flex>
  )
}
