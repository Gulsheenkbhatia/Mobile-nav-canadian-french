import React, { useState, useRef, useCallback } from 'react'
import { forwardRef, useTheme, useMergeRefs } from '@chakra-ui/react'
import Text from 'toro/components/Text'
import Input from 'toro/components/Input'

const InputMaterial = forwardRef(
  ({ children, placeholder, onFocus, onBlur, onChange, ...props }, ref) => {
    const theme = useTheme()
    const [isFocused, setIsFocused] = useState(false)
    const [value, setValue] = useState(props.value || '')
    const inputRef = useRef()
    const mergedRef = useMergeRefs(inputRef, ref)

    const handleFocus = useCallback(
      (e) => {
        setIsFocused(true)
        onFocus?.(e)
      },
      [onFocus]
    )

    const handleBlur = useCallback(
      (e) => {
        if (value) {
          setIsFocused(true)
        } else {
          setIsFocused(false)
        }
        onBlur?.(e)
      },
      [onBlur, value]
    )

    const handleChange = useCallback(
      (e) => {
        !isFocused && setIsFocused(true)
        setValue(e.target.value)
        onChange?.(e)
      },
      [isFocused, onChange]
    )

    const onLabelClick = useCallback(() => {
      setIsFocused(true)
      inputRef.current?.focus()
    }, [])

    return (
      <>
        <Text
          variant="input-label"
          fontSize={isFocused ? theme.fontSizes.xs : theme.fontSizes.sm}
          color={theme.colors.main.gray}
          mt={isFocused ? '-9px' : '12px'}
          transform={isFocused ? 'transform: translate(0, -18px) scale(1)' : 'none'}
          onClick={onLabelClick}
        >
          {placeholder}
        </Text>
        <Input
          ref={mergedRef}
          {...props}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {children}
        </Input>
      </>
    )
  }
)

export default InputMaterial
