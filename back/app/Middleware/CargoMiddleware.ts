import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CargoMiddleware {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, guards?: string[]) {
    if (auth.user && guards) {
      if (guards.includes(auth.user.cargo)) {
        await next()
      }
    }
  }
}
