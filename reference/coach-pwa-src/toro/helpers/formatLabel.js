import isEmpty from 'lodash/isEmpty'

/*To format the strings/labels as per the given object
e.g

const stringTemplate = `Hey, Myself {name}`
const object = {name: 'John'}
formatLabel(stringTemplate,object)
return Hey, Myself John
*/

export const formatLabel = (templateString = '', obj = {}) => {
  if (templateString && !isEmpty(obj)) {
    Object.keys(obj).forEach((key) => {
      templateString = templateString?.replace(`{${key}}`, obj[key])
    })

    return templateString
  }

  return templateString
}
