import get from 'lodash/get'

export default function (handleMedalliaClick, links) {
  return (links || []).map((item) => {
    if (get(item, 'href', '').includes('medallia')) {
      return { ...item, onClick: handleMedalliaClick }
    }
    return item
  })
}
