import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IndexMiddleware {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>): Promise<void> {
    let filter = {}
    try {
      filter = request.qs().filter ? JSON.parse(request.qs().filter) : {}
    } catch (error) {
      console.warn('FilterMiddleware: ', error)
    }
    request.all().page ||= 1
    request.all().per_page ||= 10
    request.all().order_column ||= null
    request.all().order ||= null
    request.all().filter = filter

    await next()
  }
}
