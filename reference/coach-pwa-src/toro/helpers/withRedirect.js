import get from 'lodash/get'
import Router from 'next/router'

export default async function withRedirect(data, ctx, enableNextRouter = false) {
  const redirectUrl = get(data, 'pageData.redirectUrl')
  if (redirectUrl) {
    if (ctx.res) {
      // server side
      return ctx.res.writeHead(301, { location: redirectUrl }).end()
    }

    // client side
    if (enableNextRouter) {
      // use Next Router to navigate to redirected page, this speeds up client-side navigation
      return Router.push(redirectUrl)
    }

    // use redirect via external linking in case we want to redirect to external link, proxied page
    // or if we want Akamai to handle the redirect
    window.location.href = redirectUrl

    return new Promise(() => {}) // keep showing skeletons
  }
  return data
}
