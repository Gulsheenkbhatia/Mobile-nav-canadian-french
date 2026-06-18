import cheerio from 'toro/lib/cheerio'
import { pickFlyoutProps } from 'toro/components/FlyoutDrawer/helpers'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

const ID = {
  INPUT_EMAIL: 'login-form-email',
  INPUT_EMAIL_ERROR_CONTAINER: 'form-email-error',
  INPUT_PASSWORD: 'login-form-password',
  INPUT_PASSWORD_ERROR_CONTAINER: 'login-form-password-error',
  CHECKBOX_REMEMBER_ME: 'rememberMe',
  BUTTON_FORGOT_PASSWORD: 'fgtPwd',
  INPUT_CSRF: 'csrf_token', // value matches 'name' field, not 'id' field
  BUTTON_SUBMIT: 'submit', // values matches 'type' field, not 'id' field
  BUTTON_SIGN_UP: 'cbs_link_signup', // values matches 'data-qa' field, not 'id' field
  DIVIDER: 'cbs_txt_or', // values matches 'data-qa' field, not 'id' field
  BUTTON_CONTINUE: 'cbs_lnk_cntnuasguest', // values matches 'data-qa' field, not 'id' field
}

export default function flyoutLoginParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  const body = $('div.modal-body')
  const $body = $(body)
  // remove all classes
  $body.find('*').each((index, el) => {
    const $el = $(el)
    $el.attr('class', null)
    if ($el.attr('name') !== ID.INPUT_CSRF) {
      $el.attr('value', null) // this might cause issues in case we need some default values
    }
  })

  const header = $('div.modal-header h2').attr('class', null)

  const form = $body.find('form')

  const inputEmail = $body.find(`#${ID.INPUT_EMAIL}`)
  const inputEmailLabel = $body.find(`label[for="${ID.INPUT_EMAIL}"]`)
  const inputEmailErrorContainer = $body.find(`#${ID.INPUT_EMAIL_ERROR_CONTAINER}`)

  const inputPassword = $body.find(`#${ID.INPUT_PASSWORD}`)
  const inputPasswordLabel = $body.find(`label[for="${ID.INPUT_PASSWORD}"]`)
  const inputPasswordErrorContainer = $body.find(`#${ID.INPUT_PASSWORD_ERROR_CONTAINER}`)

  const checkboxRememberMe = $body.find(`#${ID.CHECKBOX_REMEMBER_ME}`)
  const checkboxRememberMeLabel = $body.find(`label[for="${ID.CHECKBOX_REMEMBER_ME}"]`)

  const buttonForgotPassword = $body.find(`#${ID.BUTTON_FORGOT_PASSWORD}`)

  const inputCsrf = $body.find(`input[name="${ID.INPUT_CSRF}"]`)

  const buttonSubmit = $body.find(`button[type="${ID.BUTTON_SUBMIT}"]`)

  const buttonRegister = $body.find(`button[data-qa="${ID.BUTTON_SIGN_UP}"]`)
  const buttonRegisterParent = buttonRegister.parent()

  const divider = $body.find(`div[data-qa="${ID.DIVIDER}"]`)

  const buttonContinue = $body.find(`button[data-qa="${ID.BUTTON_CONTINUE}"]`)

  return {
    header: {
      text: pickFlyoutProps(header)?.text,
    },
    body: {
      form: pickFlyoutProps(form),
      inputEmail: {
        input: pickFlyoutProps(inputEmail),
        label: pickFlyoutProps(inputEmailLabel),
        error: pickFlyoutProps(inputEmailErrorContainer),
      },
      inputPassword: {
        input: pickFlyoutProps(inputPassword),
        label: pickFlyoutProps(inputPasswordLabel),
        error: pickFlyoutProps(inputPasswordErrorContainer),
      },
      checkboxRememberMe: {
        checkbox: pickFlyoutProps(checkboxRememberMe),
        label: pickFlyoutProps(checkboxRememberMeLabel),
      },
      buttonForgotPassword: {
        button: pickFlyoutProps(buttonForgotPassword),
      },
      inputCsrf: {
        input: pickFlyoutProps(inputCsrf),
      },
      buttonSubmit: {
        button: pickFlyoutProps(buttonSubmit),
      },
      buttonRegister: {
        button: pickFlyoutProps(buttonRegister),
        parent: pickFlyoutProps(buttonRegisterParent),
      },
      divider: {
        div: pickFlyoutProps(divider),
      },
      buttonContinue: {
        button: pickFlyoutProps(buttonContinue),
      },
    },
  }
}
