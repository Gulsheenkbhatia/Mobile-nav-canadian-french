const username = process.env.SFCC_AUTH_USERNAME
const password = process.env.SFCC_AUTH_PASSWORD
const authToken = Buffer.from(`${username}:${password}`, 'binary').toString('base64')
export default authToken
