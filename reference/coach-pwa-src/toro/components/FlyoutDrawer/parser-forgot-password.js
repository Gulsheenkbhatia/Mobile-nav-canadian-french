import cheerio from 'toro/lib/cheerio'
import { pickFlyoutProps } from 'toro/components/FlyoutDrawer/helpers'
import sanitizeHtmlMarkup from 'toro/helpers/sanitizeHtmlMarkup'

const ID = {
  HEADER_TITLE: 'arp_txt_hdng', // values matches 'data-qa' field, not 'id' field
  MESSAGE_CONTAINER: 'arp_txt_respwdmsg', // values matches 'data-qa' field, not 'id' field
  INPUT_EMAIL: 'reset-password-email',
  INPUT_EMAIL_ERROR_CONTAINER: 'reset-password-form-email-error',
  BUTTON_SUBMIT: 'submit', // values matches 'type' field, not 'id' field
  DIVIDER: 'cbs_txt_or', // values matches 'data-qa' field, not 'id' field
  BUTTON_CONTINUE: 'cbs_lnk_cntnuasguest', // values matches 'data-qa' field, not 'id' field
}

export default function flyoutForgotPasswordParser(html) {
  const sanitizedHtml = sanitizeHtmlMarkup(html)
  const $ = cheerio.load(sanitizedHtml)

  const body = $('div.modal-body')
  const $body = $(body)
  // remove all classes
  $body.find('*').each((index, el) => {
    const $el = $(el)
    $el.attr('class', null)
    $el.attr('value', null) // this might cause issues in case we need some default values
  })

  const header = $(`div[data-qa="${ID.HEADER_TITLE}"]`).attr('class', null)

  const messageContainer = $body.find(`p[data-qa="${ID.MESSAGE_CONTAINER}"]`)

  const form = $body.find('form')

  const inputEmail = $body.find(`#${ID.INPUT_EMAIL}`)
  const inputEmailLabel = $body.find(`label[for="${ID.INPUT_EMAIL}"]`)
  const inputEmailErrorContainer = $body.find(`#${ID.INPUT_EMAIL_ERROR_CONTAINER}`)

  const buttonSubmit = $body.find(`button[type="${ID.BUTTON_SUBMIT}"]`)

  const divider = $body.find(`div[data-qa="${ID.DIVIDER}"]`)

  const buttonContinue = $body.find(`button[data-qa="${ID.BUTTON_CONTINUE}"]`)

  return {
    header: {
      text: pickFlyoutProps(header)?.text,
    },
    body: {
      messageContainer: {
        p: pickFlyoutProps(messageContainer),
      },
      form: pickFlyoutProps(form),
      inputEmail: {
        input: pickFlyoutProps(inputEmail),
        label: pickFlyoutProps(inputEmailLabel),
        error: pickFlyoutProps(inputEmailErrorContainer),
      },
      buttonSubmit: {
        button: pickFlyoutProps(buttonSubmit),
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
