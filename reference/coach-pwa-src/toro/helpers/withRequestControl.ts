import isString from 'lodash/isString'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import CustomRequestError from 'helpers/CustomRequestError'

type QueryValidation = {
  [key: string]: {
    required?: boolean
    notEmpty?: boolean
    errorMessage?: string
  }
}

type RequestControl = {
  method?: 'GET' | 'POST'
  queryValidation?: QueryValidation
}

const withRequestControl = (handler: NextApiHandler, options: RequestControl) => {
  const { method, queryValidation } = options
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (method && isString(method) && req.method?.toUpperCase() !== method.toUpperCase()) {
      return res.status(403).end()
    }

    if (queryValidation) {
      for (const [paramName, validation] of Object.entries(queryValidation)) {
        const paramValue = req.query[paramName]

        if (validation.required && (paramValue === undefined || paramValue === null)) {
          throw new CustomRequestError(
            validation.errorMessage || `Required parameter '${paramName}' is missing`,
            { skipReport: false, skipAppData: false, status: 400 }
          )
        }

        if (
          validation.notEmpty &&
          (!paramValue || (isString(paramValue) && paramValue.trim() === ''))
        ) {
          throw new CustomRequestError(
            validation.errorMessage || `Parameter '${paramName}' cannot be empty`,
            { skipReport: false, skipAppData: false, status: 400 }
          )
        }
      }
    }

    // eslint-disable-next-line @typescript-eslint/return-await
    return await handler(req, res)
  }
}

export default withRequestControl
