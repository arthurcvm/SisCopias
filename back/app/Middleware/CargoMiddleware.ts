import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { badRequest } from 'App/Helpers/http-helper'
import { successHandle } from 'App/utils/success-messages'

export default class CargoMiddleware {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    guards?: string[]
  ) {
    if (auth.user && guards) {
      if (guards.includes(auth.user.cargo)) {
        await next()
      } else {
        badRequest(response, successHandle(auth.user, 'Usuário sem permissões suficientes'), 401)
      }
    }
  }
}
