import React, { useEffect, useContext } from 'react'
import PWAContext from 'components/common/PWAContext'
import { useIntl } from 'react-intl'
import normalizeLocalizationContent from 'toro/helpers/getCurrentLocale'
import fetch from 'helpers/fetch'

const PayPalButton = ({ onClick, ...props }) => {
  const { appData } = useContext(PWAContext)
  const { locale } = useIntl()
  const { siteId } = appData
  const sr_siteId = `Sites-${siteId}-Site`

  let newLocale = locale.replace('_', '-')

  const CREATE_PAYMENT_URL = `/on/demandware.store/${sr_siteId}/${newLocale}/Paypal-StartCheckoutFromCart?isAjax=true`

  function handleScriptError() {
    console.log('error loading paypal sdk')
  }

  function handleLoadScript() {
    if (window && window.paypal) {
      window.paypal
        .Buttons({
          env: appData.paypalEnv || 'sandbox',
          locale: newLocale,
          style: {
            layout: 'horizontal',
            size: 'responsive',
            shape: 'rect',
            color: 'white',
            height: 50,
            tagline: false,
            label: 'paypal',
            fundingIcons: 'false',
            opacity: 0,
          },
          funding: {
            allowed: [],
            disallowedMethods: ['credit'],
          },
          createOrder: async () => {
            const { payCountry, countryMandatory } = props
            let additionalParam = ''

            if (payCountry?.length && countryMandatory) {
              additionalParam = `&paypalCountryCode=${payCountry.toUpperCase()}`
            }
            try {
              const res = await fetch(`${CREATE_PAYMENT_URL}${additionalParam}`, {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                },
                credentials: 'include',
              })
              let data
              try {
                data = await res.json()
              } catch (err) {
                console.error('paypalUtils: Failed to parse JSON response', err)
                return
              }
              if (data.error) {
                onPayPalError(data)
                console.error(
                  'paypalUtils: ' +
                    `${CREATE_PAYMENT_URL}${additionalParam}` +
                    ' returned data with error'
                )
                return
              }
              if (!data.token) {
                console.error('paypalUtils: data does not have token property')
                return
              }
              return data.token
            } catch (err) {
              console.error('paypalUtils: Failed to fetch', err)
              return
            }
          },
          onAuthorize: function (data, actions) {
            console.log('PayPal: onAuthorize.data', data)
            return actions.redirect()
          },
          onCancel: function (data) {
            console.log('PayPal: onCancel.data', data)
          },
          onError: function (msg) {
            console.log('PayPal: onError.msg', msg)
          },
          onApprove: function (data) {
            const { orderID, payerID } = data || {}
            const params = `isFromCart=true&token=${orderID}&PayerID=${payerID}`
            const returnUrl = `/on/demandware.store/${sr_siteId}/${newLocale}/Paypal-ReturnFromPaypal?${params}`
            // Make a call to the REST API to set up the payment
            window.location.href = returnUrl
          },
          onClick: function () {
            onClick && onClick()
          },
        })
        .render('#paypal-button-container')
    }
  }

  function onPayPalError(data) {
    if (data.error === 'empty_cart') {
      window.location.reload()
    } else {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl
      } else {
        let url = window.location.href
        url += url.indexOf('?') > -1 ? '&' : '?'
        window.location.href = url + 'showPaypalError=true'
      }
    }
  }

  function removeScriptListeners(scriptEl) {
    return () => {
      scriptEl.removeEventListener('load', handleLoadScript)
      scriptEl.removeEventListener('error', handleScriptError)
    }
  }

  useEffect(() => {
    const SCRIPT_ID = 'paypal-button'
    const existingScript = document.getElementById(SCRIPT_ID)
    existingScript?.remove()
    document.querySelector('#paypal-button-container').innerHTML = ''
    if (existingScript) {
      handleLoadScript()
      return removeScriptListeners(existingScript)
    }
    const currency = normalizeLocalizationContent(locale).currency
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://www.paypal.com/sdk/js?client-id=${appData.paypalClientId}&intent=order&currency=${currency}`
    script.type = 'text/javascript'
    script.async = true
    script.addEventListener('load', handleLoadScript)
    script.addEventListener('error', handleScriptError)

    if (document.body) {
      document.body.appendChild(script)
    }
    return removeScriptListeners(script)
  }, [props?.payCountry])

  return (
    <div
      id="paypal-button-container"
      style={{ width: props.width || '45%', opacity: 0, zIndex: 10 }}
      {...props}
    />
  )
}

export default PayPalButton
