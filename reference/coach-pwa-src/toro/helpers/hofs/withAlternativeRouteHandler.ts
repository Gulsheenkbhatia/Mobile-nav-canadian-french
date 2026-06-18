import type { NextApiHandler, NextApiRequest } from 'next'

type RouteHandlerSwitchPredicate = (request: NextApiRequest) => boolean

const withAlternativeRouteHandler = (
  mainRouteHandler: NextApiHandler,
  alternativeRouteHandler: NextApiHandler,
  predicate: RouteHandlerSwitchPredicate
): NextApiHandler => {
  return async (request, response) => {
    const switchCondition = predicate(request)
    const routeHandler = switchCondition ? alternativeRouteHandler : mainRouteHandler

    const result = await routeHandler(request, response)
    return result
  }
}

export default withAlternativeRouteHandler
