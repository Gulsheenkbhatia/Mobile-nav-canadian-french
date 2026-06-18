import { useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

function ReCaptchaV3({ captchaSiteKey, setToken }) {
  const recaptchaRef = useRef()
  const onChange = async () => {
    const token = await recaptchaRef?.current?.executeAsync()
    setToken(token)
  }

  return (
    <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={captchaSiteKey} onChange={onChange} />
  )
}

export default ReCaptchaV3
