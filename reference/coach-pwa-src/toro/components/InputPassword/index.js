import React, { forwardRef, useState } from 'react'
import Input from 'toro/components/Input'
import InputRightElement from 'toro/components/InputRightElement'
import Button from 'toro/components/Button'
import InputGroup from 'toro/components/InputGroup'

const InputPassword = forwardRef((props, ref) => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const handlePasswordVisibilityToggle = () => {
    setPasswordVisible((old) => !old)
  }

  return (
    <InputGroup>
      <Input ref={ref} {...props} type={passwordVisible ? 'text' : 'password'} />
      <InputRightElement mr="m">
        <Button variant="plain" size="sm" h="auto" onClick={handlePasswordVisibilityToggle}>
          {passwordVisible ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
})

export default InputPassword
