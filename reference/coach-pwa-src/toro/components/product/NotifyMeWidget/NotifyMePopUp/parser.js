// this parser runs only on client-side
export default function notifyMeModalParser(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  if (doc.querySelector('input[name=csrf_token]')) {
    return {
      modalHeader: doc.querySelector('h3.notify-me__heading')?.textContent || '',
      modalMessage: doc.querySelector('div.notify-me__message')?.textContent || '',
      csrfToken: doc.querySelector('input[name=csrf_token]')?.getAttribute('value') || '',
    }
  } else {
    return {
      modalHeader: doc.querySelector('h3.notify-me__conf--heading')?.textContent || '',
      modalMessage: doc.querySelector('p.notify-me__conf--msg')?.textContent || '',
    }
  }
}
