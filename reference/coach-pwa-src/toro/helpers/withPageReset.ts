import { GetServerSideProps, GetServerSidePropsContext } from 'next'

const pageResetThreshold = Number(process.env.PAGE_RESET_THRESHOLD) || 1

const withPageReset =
  (getInitialProps: GetServerSideProps) => async (ctx: GetServerSidePropsContext) => {
    if (
      ctx.res &&
      ctx.query.page &&
      (Number(ctx.query.page) > pageResetThreshold || !Number(ctx.query.page)) &&
      !ctx.query.startFrom
    ) {
      /* Have to filter-out 'slug' together with 'page' and 'locale' as it gets added to the query by Vercel */
      const filteredParams = Object.keys(ctx.query).reduce((acc, curr) => {
        if (!curr.match(/page|slug|locale/g)) {
          acc[curr] = ctx.query[curr]
        }
        return acc
      }, {})

      const qs = new URLSearchParams(filteredParams).toString()
      const url = new URL(ctx.req.url, 'http://localhost:3000')
      const locale = ctx.query.locale

      return ctx.res
        .writeHead(302, {
          location: `${locale ? `/${locale}` : ''}${url.pathname}${qs ? `?${qs}` : ''}`,
        })
        .end()
    }
    return await getInitialProps(ctx)
  }

export default withPageReset
