import { useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha-enterprise'

function EnterpriseReCaptcha({ enterpriceSiteKey, setToken }) {
  const recaptchaRef = useRef()
  const onChange = async () => {
    const token = recaptchaRef?.current?.getValue()
    setToken(token)
  }

  return <ReCAPTCHA ref={recaptchaRef} sitekey={enterpriceSiteKey} onChange={onChange} />
}

export default EnterpriseReCaptcha
