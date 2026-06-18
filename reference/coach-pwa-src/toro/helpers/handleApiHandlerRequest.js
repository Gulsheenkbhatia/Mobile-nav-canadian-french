import { requestLogger, responseLogger } from 'helpers/logger'
import get from 'lodash/get'

export default function handleApiHandlerRequest(handler, errorResult = {}) {
  return async (req, res) => {
    try {
      requestLogger(req.url, req)
      const successResult = await handler(req, res)
      responseLogger(res)
      res.status(200).json(successResult)
    } catch (error) {
      console.error({
        error,
        context: {
          type: 'Error in api server handler for separate request',
          url: get(req, 'url'),
          referer: req?.headers?.referer, // for getAppData it's undefined
        },
      })

      res.status(errorResult?.status || 500).json({
        error,
      })
    }
  }
}
