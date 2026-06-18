const encodeEmail = (email) => {
  const buff = new Buffer(email)
  return buff.toString('base64')
}

export default encodeEmail
