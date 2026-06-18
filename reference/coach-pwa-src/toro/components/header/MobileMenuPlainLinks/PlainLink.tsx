type PlainLinkPropsType = {
  url: string
  name: string
}

const PlainLink = ({ url, name }: PlainLinkPropsType) => {
  return <a href={url}>{name}</a>
}

export default PlainLink
