import { useEffect, useState } from 'react'
import { useUpdateAtom } from 'jotai/utils'
import useAnalytics from 'toro/analytics/useAnalytics'
import get from 'lodash/get'
import withCorrId from 'helpers/traceability'
import { hashEmail } from 'toro/helpers/hashEmail'
import { emailPattern } from 'helpers/validationPatterns'
import { xgenAlternateUserIdAtom } from 'store/xgen-recommendations.atom'

const stopPropagation = (e) => e.stopPropagation()
const fetchWithCorrId = withCorrId()
const startSpinner = function (form) {
  const veil = document.createElement('div')
  veil.classList.add('veil')
  veil.setAttribute('id', 'veil')
  veil.innerHTML = `<div class="underlay"></div>`
  veil.insertAdjacentHTML(
    'beforeend',
    `<div class="spinner"><div class="spin"></div ><div class="spin"></div><div class="spin"></div><div class="spin"></div></div>`
  )
  veil.addEventListener('click', stopPropagation, true)
  form.append(veil)
  return () => {
    veil.removeEventListener('click', stopPropagation)
  }
}

const stopSpinner = function () {
  const veil = document.getElementById('veil')
  veil.remove()
}

const hideToast = function () {
  const container =
    document.querySelector('.msg-campaignEmailCapture-container') ||
    document.querySelector('.msg-emailCapture-container')

  if (!container) {
    return
  }

  container.innerHTML = ''
}
const showToast = function (msg) {
  const container =
    document.querySelector('.msg-campaignEmailCapture-container') ||
    document.querySelector('.msg-emailCapture-container')

  if (!container) {
    return
  }

  container.innerHTML = ''
  const toastBody = `<div class="row">
   <div class="m-auto">
      <div class="msg-email-capture mb-3" data-qa="content_email_registration_success_msg">
         <div role="alert" aria-live="assertive" aria-atomic="true" class="toast msg-email-capture-toast w-100 mw-100">
            <div class="d-flex flex-row justify-content-between toast-message-container">
               <svg class="toast-icon toast-successIcon icon" width="24" height="24" viewBox="0 0 24 24" fill="#38e467"  xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.59 7.58 10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
               </svg>
               <p class="toast-message d-flex align-items-center justify-content-between" data-qa="cm_txt_success_email_subscribed">
                  ${msg}
               </p>
               <button type="button" class="close d-flex" data-dismiss="toast" aria-label="" onclick="
                  const container =
                  document.querySelector('.msg-campaignEmailCapture-container') ||
                  document.querySelector('.msg-emailCapture-container')
                  container.innerHTML = ''
                  ">
                  <svg class="toast-icon toast-successIcon icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"  xmlns="http://www.w3.org/2000/svg">
                     <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
               </button>
            </div>
         </div>
      </div>
   </div>
</div>`
  container.style.top = 140 + 'px'
  container.innerHTML = toastBody
  setTimeout(() => {
    hideToast()
  }, 2000)
}

function populateErrorMessages(form) {
  let validForm = true

  Array.from(form.elements).forEach((item) => {
    if (item.type !== 'hidden' && item.type !== 'submit' && item.value === '') {
      populateErrorMessageForField(item)
    }
  })

  Array.from(form.elements).forEach((item) => {
    if (item.classList.contains('error')) {
      validForm = false
    }
  })

  return validForm
}

function populateErrorMessageForField(element) {
  const msg = element.dataset.missingError
  const errorBlock = element.parentNode.querySelector('.invalid-feedback')
  element.classList.add('error')
  errorBlock.innerHTML = msg
  errorBlock.style.display = 'block'
}
function removeErrorMessageForField(element) {
  const errorBlock = element.parentNode.querySelector('.invalid-feedback')
  element.classList.remove('error')
  errorBlock.innerHTML = ''
  errorBlock.style.display = 'none'
}
function populateInvalidErrorMessageForField(element) {
  const msg = element.dataset.invalidError
  const errorBlock = element.parentNode.querySelector('.invalid-feedback')
  element.classList.add('error')
  errorBlock.innerHTML = msg
  errorBlock.style.display = 'block'
}
//Regex pattern to allow digits only and auto convert into required pattern such as (123) 123-1234
function formatPhoneNumber($element, $val, form) {
  if (!$element || !$val || !form) {
    return
  }

  let modifyVal = $val.replace(/\D/g, '')
  const matchRegex = /^(\d{3})(\d{3})(\d{4})$/
  let formatedValue = ''

  if (modifyVal.length == form.dataset.formatLength) {
    const match = modifyVal.match(matchRegex)
    if (match) {
      formatedValue = match[1] + '-' + match[2] + '-' + match[3]
    }
  } else if (modifyVal.length > 10) {
    const match = modifyVal.slice(0, 10).match(matchRegex)
    if (match) {
      formatedValue = match[1] + '-' + match[2] + '-' + match[3]
    }
  } else {
    formatedValue = modifyVal
  }
  $element.value = formatedValue
  const test_pattern = new RegExp(form.dataset.formatTester)
  if (test_pattern.test(formatedValue)) {
    removeErrorMessageForField($element)
  } else {
    populateInvalidErrorMessageForField($element)
  }
}

function smsInputBlock(smsInput) {
  if (smsInput) {
    const handler = function () {
      const campaignBlock = document.querySelector('.campaign-capture-option')
      if (!this.checked) {
        campaignBlock.classList.add('d-flex')
        campaignBlock.classList.remove('d-none')
      } else {
        campaignBlock.classList.remove('d-flex')
        campaignBlock.classList.add('d-none')
      }
    }
    smsInput.addEventListener('change', handler)
    return () => {
      smsInput.removeEventListener('change', handler)
    }
  }
}

const validationHandler = (form) => (e) => {
  e.preventDefault()
  if (e.type === 'focusout') {
    switch (e.target.name) {
      case 'dwfrm_campaignCapture_email':
      case 'dwfrm_campaignCapture_phone':
      case 'dwfrm_emailCapture_email':
        // eslint-disable-next-line no-case-declarations
        let pattern
        if (e.target.dataset.phone) {
          pattern = form.dataset.formatTester
          pattern = new RegExp(pattern)
        } else {
          pattern = '' + e.target.getAttribute('pattern')
          pattern = new RegExp(pattern)
        }
        if (pattern.test(e.target.value)) {
          removeErrorMessageForField(e.target)
        } else {
          e.target.value === ''
            ? populateErrorMessageForField(e.target)
            : populateInvalidErrorMessageForField(e.target)
        }
        break
      case 'dwfrm_campaignCapture_firstName':
      case 'dwfrm_campaignCapture_lastName':
        // eslint-disable-next-line no-case-declarations
        const maxlength = e.target.getAttribute('maxlength')
        if (e.target.value.length <= maxlength && e.target.value !== '') {
          removeErrorMessageForField(e.target)
        } else {
          populateErrorMessageForField(e.target)
        }
        break
    }
  } else {
    if (e.type === 'keyup') {
      switch (e.target.name) {
        case 'dwfrm_campaignCapture_phone':
          formatPhoneNumber(e.target, e.target.value, form)
          break
      }
    }
  }
}

const validateForm = function (form, handler) {
  const events = ['focusout', 'keyup']

  Array.from(form.elements).forEach((item) => {
    events.forEach(function (e) {
      item.addEventListener(e, handler, false)
    })
  })
}

const removeValidateForm = function (form, handler) {
  const events = ['focusout', 'keyup']

  Array.from(form.elements).forEach((item) => {
    events.forEach(function (e) {
      item.removeEventListener(e, handler, false)
    })
  })
}
const _modifyCampaignCaptureIdFormData = (formData) => {
  for (const key of formData.keys()) {
    if (/_id/.test(key)) {
      const value = formData.get(key)
      if (!value) {
        return
      }
      const valueParsed = value.match(/(id|code)[ ]{0,1}="(.*?)(?="|$)/)
      valueParsed?.[2] && formData.set(key, valueParsed[2])
    }
  }
}

function emailCaptureAjaxCall(form, handleGtm, successAsset, setUpdatedContent, onValidEmail) {
  const phoneField = form.querySelector('[data-phone]')
  const $smsInput = form.querySelector('input[id="sms-optin"]')
  const formData = new FormData(form)
  const validForm = populateErrorMessages(form)
  _modifyCampaignCaptureIdFormData(formData)

  if (validForm) {
    const emailInput = form.querySelector('input[type="email"]')
    const emailValue = emailInput?.value ?? ''
    if (onValidEmail && emailPattern.test(emailValue)) {
      onValidEmail(hashEmail(emailValue))
    }
    if (!form.classList.contains('email-only-form')) {
      if (phoneField) {
        const key = phoneField.getAttribute('name')
        const formattedPhoneNo = phoneField.value.replace(/\D/g, '')
        formData.set(key, formattedPhoneNo)
      }
      if ($smsInput && !$smsInput.checked) {
        const campaignBlock = document.querySelector('.campaign-capture-option')
        campaignBlock.classList.add('d-flex')
        campaignBlock.classList.remove('d-none')

        return false
      } else {
        const campaignBlock = document.querySelector('.campaign-capture-option')
        campaignBlock.classList.remove('d-flex')
        campaignBlock.classList.add('d-none')
      }
    }
    const url = form.getAttribute('action')
    const spinnerCleanup = startSpinner(form)

    fetchWithCorrId(url, { method: 'POST', body: formData })
      .then((result) => {
        return result.json()
      })
      .then((response) => {
        const { error, message, gtmData } = response

        if (successAsset) {
          const successContent = get(successAsset, 'c_body.default.markup')
          setUpdatedContent(successContent)
        } else {
          showToast(message)
        }

        if (!error) {
          form.reset()
          if (gtmData) {
            handleGtm(gtmData.event_location)
          }
        } else {
          console.log(error)
        }

        if (!successAsset) {
          stopSpinner()
        }
      })
    return spinnerCleanup
  }
}

function handleSubmitSfccFormEmailCapture(element, analytics, setUpdatedContent, onValidEmail) {
  if (!element) {
    return
  }

  const emailCaptureForm = element.querySelector('form[class*="email-capture-form"]')
  if (!emailCaptureForm) {
    return
  }

  let spinnerCleanup
  const handleSubmit = async (ev) => {
    try {
      if (ev) {
        ev.preventDefault()
        const hiddenCsrfInput = emailCaptureForm.querySelector(
          'input[type="hidden"][name="csrf_token"]'
        )

        if (!hiddenCsrfInput) {
          return
        }

        const email = emailCaptureForm.querySelector('input[type="email"]')?.value
        const phoneNumber = emailCaptureForm.querySelector(
          'input[type="text"][id="campaign-form-phone"]'
        )

        const successAssetField = emailCaptureForm.querySelector(
          'input[type="hidden"][name*="successAsset"]'
        )
        let successAsset
        const response = await fetchWithCorrId('/api/get-csrf-email-capture')
        const { csrfToken } = await response.json()
        hiddenCsrfInput.setAttribute('value', csrfToken)
        const handleGtm = (event_location) =>
          analytics?.send('submitEmailCapture', {
            email,
            formType: phoneNumber ? 'sfcc extended form' : 'sfcc form',
            formId: 'skigame_event',
            event_location,
          })

        if (successAssetField) {
          const contentAssetId = successAssetField.getAttribute('value')
          if (contentAssetId) {
            const response = await fetchWithCorrId(
              `/api/get-content-assets?ids=${encodeURIComponent(`${contentAssetId}`)}`
            )
            const { data } = await response.json()
            successAsset = get(data, contentAssetId)
          }
        }
        spinnerCleanup = emailCaptureAjaxCall(
          emailCaptureForm,
          handleGtm,
          successAsset,
          setUpdatedContent,
          onValidEmail
        )
      }
    } catch (e) {
      console.error(e)
    }
  }
  const $smsInput = emailCaptureForm.querySelector('input[id="sms-optin"]')

  const validateHandler = validationHandler(emailCaptureForm)
  const smsCleanup = smsInputBlock($smsInput)
  validateForm(emailCaptureForm, validateHandler)

  emailCaptureForm.addEventListener('submit', handleSubmit)
  return () => {
    emailCaptureForm.removeEventListener('submit', handleSubmit)
    removeValidateForm(emailCaptureForm, validateHandler)
    spinnerCleanup?.()
    smsCleanup?.()
  }
}

export const useEmailCaptureSubmitHandle = (setUpdatedContent) => {
  const [node, setNode] = useState(null)
  const analytics = useAnalytics()
  const setXgenAlternateUserId = useUpdateAtom(xgenAlternateUserIdAtom)

  useEffect(() => {
    const cleanup = handleSubmitSfccFormEmailCapture(
      node,
      analytics,
      setUpdatedContent,
      setXgenAlternateUserId
    )
    return () => {
      cleanup?.()
    }
  }, [node, analytics, setUpdatedContent, setXgenAlternateUserId])

  return setNode
}
