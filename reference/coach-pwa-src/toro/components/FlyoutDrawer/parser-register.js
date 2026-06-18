import cheerio from 'toro/lib/cheerio'
import { pickFlyoutProps } from 'toro/components/FlyoutDrawer/helpers'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'
import { relativizeFlyoutLinks } from 'toro/components/FlyoutDrawer/common'

const ID = {
  BUTTON_LOGIN: 'cbs_link_signin', // values matches 'data-qa' field, not 'id' field
  INPUT_FIRST_NAME: 'registration-form-fname',
  INPUT_FIRST_NAME_ERROR_CONTAINER: 'form-fname-error',
  INPUT_LAST_NAME: 'registration-form-lname',
  INPUT_LAST_NAME_ERROR_CONTAINER: 'form-lname-error',
  INPUT_EMAIL: 'registration-form-email',
  INPUT_EMAIL_ERROR_CONTAINER: 'registration-email-error',
  INPUT_PASSWORD: 'registration-form-password',
  INPUT_PASSWORD_ERROR_CONTAINER: 'form-password-error',
  PASSWORD_VALIDATION_MIN_LENGTH_ICON_INVALID: 'ar_icon_pwdlenvaldn', // values matches 'data-qa' field, not 'id' field
  PASSWORD_VALIDATION_MIN_LENGTH_ICON_VALID: 'ar_icon_pwdlenchecked', // values matches 'data-qa' field, not 'id' field
  PASSWORD_VALIDATION_MIN_LENGTH_TEXT: 'ar_txt_pwdlenvaldn', // values matches 'data-qa' field, not 'id' field
  PASSWORD_VALIDATION_ALPHANUMERIC_ICON_INVALID: 'ar_icon_pwdcharvaldn', // values matches 'data-qa' field, not 'id' field
  PASSWORD_VALIDATION_ALPHANUMERIC_ICON_VALID: 'ar_icon_pwdcharchecked', // values matches 'data-qa' field, not 'id' field
  PASSWORD_VALIDATION_ALPHANUMERIC_TEXT: 'ar_txt_pwdcharvaldn', // values matches 'data-qa' field, not 'id' field
  CHECKBOX_NEWSLETTER: 'add-to-emaillist',
  BUTTON_FORGOT_PASSWORD: 'fgtPwd',
  INPUT_CSRF: 'csrf_token', // value matches 'name' field, not 'id' field
  BUTTON_SUBMIT: 'submit', // values matches 'type' field, not 'id' field
  DISCLAIMER: 'disclaimer-text', // values matches 'class' field, not 'id' field
}

export default function flyoutRegisterParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  const body = $('div.modal-body')
  const $body = $(body)

  // we do this before removing the classes, because we need to target this by class
  const disclaimer = $body.find(`div.${ID.DISCLAIMER}`)
  relativizeFlyoutLinks(disclaimer.get(0))

  // remove all class and value props
  $body.find('*').each((index, el) => {
    const $el = $(el)
    $el.attr('class', null)
    if ($el.attr('name') !== ID.INPUT_CSRF) {
      $el.attr('value', null) // this might cause issues in case we need some default values
    }
  })

  const header = $('div.modal-header h2').attr('class', null)

  const form = $body.find('form')

  const buttonLogin = $body.find(`button[data-qa="${ID.BUTTON_LOGIN}"]`)
  const buttonLoginParent = buttonLogin.parent()

  const inputFirstName = $body.find(`#${ID.INPUT_FIRST_NAME}`)
  const inputFirstNameLabel = $body.find(`label[for="${ID.INPUT_FIRST_NAME}"]`)
  const inputFirstNameErrorContainer = $body.find(`#${ID.INPUT_FIRST_NAME_ERROR_CONTAINER}`)

  const inputLastName = $body.find(`#${ID.INPUT_LAST_NAME}`)
  const inputLastNameLabel = $body.find(`label[for="${ID.INPUT_LAST_NAME}"]`)
  const inputLastNameErrorContainer = $body.find(`#${ID.INPUT_LAST_NAME_ERROR_CONTAINER}`)

  const inputEmail = $body.find(`#${ID.INPUT_EMAIL}`)
  const inputEmailLabel = $body.find(`label[for="${ID.INPUT_EMAIL}"]`)
  const inputEmailErrorContainer = $body.find(`#${ID.INPUT_EMAIL_ERROR_CONTAINER}`)

  const inputPassword = $body.find(`#${ID.INPUT_PASSWORD}`)
  const inputPasswordLabel = $body.find(`label[for="${ID.INPUT_PASSWORD}"]`)
  const inputPasswordErrorContainer = $body.find(`#${ID.INPUT_PASSWORD_ERROR_CONTAINER}`)

  const passwordValidationMinLengthIconInvalid = $body.find(
    `svg[data-qa="${ID.PASSWORD_VALIDATION_MIN_LENGTH_ICON_INVALID}"]`
  )
  const passwordValidationMinLengthIconValid = $body.find(
    `svg[data-qa="${ID.PASSWORD_VALIDATION_MIN_LENGTH_ICON_VALID}"]`
  )
  const passwordValidationMinLengthText = $body.find(
    `div[data-qa="${ID.PASSWORD_VALIDATION_MIN_LENGTH_TEXT}"]`
  )

  const passwordValidationAlphanumericIconInvalid = $body.find(
    `svg[data-qa="${ID.PASSWORD_VALIDATION_ALPHANUMERIC_ICON_INVALID}"]`
  )
  const passwordValidationAlphanumericIconValid = $body.find(
    `svg[data-qa="${ID.PASSWORD_VALIDATION_ALPHANUMERIC_ICON_VALID}"]`
  )
  const passwordValidationAlphanumericText = $body.find(
    `div[data-qa="${ID.PASSWORD_VALIDATION_ALPHANUMERIC_TEXT}"]`
  )

  const checkboxNewletter = $body.find(`#${ID.CHECKBOX_NEWSLETTER}`)
  const checkboxNewsletterLabel = $body.find(`label[for="${ID.CHECKBOX_NEWSLETTER}"]`)

  const inputCsrf = $body.find(`input[name="${ID.INPUT_CSRF}"]`)

  const buttonSubmit = $body.find(`button[type="${ID.BUTTON_SUBMIT}"]`)

  return {
    header: {
      text: pickFlyoutProps(header)?.text,
    },
    body: {
      form: pickFlyoutProps(form),
      buttonLogin: {
        button: pickFlyoutProps(buttonLogin),
        parent: pickFlyoutProps(buttonLoginParent),
      },
      inputFirstName: {
        input: pickFlyoutProps(inputFirstName),
        label: pickFlyoutProps(inputFirstNameLabel),
        error: pickFlyoutProps(inputFirstNameErrorContainer),
      },
      inputLastName: {
        input: pickFlyoutProps(inputLastName),
        label: pickFlyoutProps(inputLastNameLabel),
        error: pickFlyoutProps(inputLastNameErrorContainer),
      },
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
      passwordValidationMinLength: {
        iconInvalid: pickFlyoutProps(passwordValidationMinLengthIconInvalid),
        iconValid: pickFlyoutProps(passwordValidationMinLengthIconValid),
        div: pickFlyoutProps(passwordValidationMinLengthText),
      },
      passwordValidationAlphanumeric: {
        iconInvalid: pickFlyoutProps(passwordValidationAlphanumericIconInvalid),
        iconValid: pickFlyoutProps(passwordValidationAlphanumericIconValid),
        div: pickFlyoutProps(passwordValidationAlphanumericText),
      },
      checkboxNewletter: {
        checkbox: pickFlyoutProps(checkboxNewletter),
        label: pickFlyoutProps(checkboxNewsletterLabel),
      },
      inputCsrf: {
        input: pickFlyoutProps(inputCsrf),
      },
      buttonSubmit: {
        button: pickFlyoutProps(buttonSubmit),
      },
      disclaimer: {
        html: disclaimer.html(),
      },
    },
  }
}
