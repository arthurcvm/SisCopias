import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { badRequest, success } from 'App/Helpers/http-helper'
import validation from 'App/localization/validation'
import User from 'App/Models/User'
import { errorHandle } from 'App/utils/errors-messages'
import { successHandle } from 'App/utils/success-messages'
import { loginSchema } from 'App/Validators/AuthValidator'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract): Promise<void> {
    try {
      const validatedData = await request.validate({
        schema: loginSchema,
        messages: validation,
      })

      const { email, password } = validatedData
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '1 day',
      })

      const user = await User.query()
        .select('id', 'nome', 'email', 'cargo')
        .where('email', email)
        .firstOrFail()

      success(response, successHandle({ user, token }, `Bem vindo(a) ${user.nome}`))
    } catch (error) {
      const fields = {
        document: 'documento',
        password: 'senha',
      }

      if (error.messages) {
        badRequest(response, errorHandle(error.messages.errors, fields))
      } else {
        badRequest(response, {
          data: {
            errors: [{ message: 'Certifique-se que digitou os dados corretamente.' }],
          },
          message: 'Documento e/ou senha incorreto(s)',
        })
      }
    }
  }

  public async logout({ response, auth }: HttpContextContract): Promise<void> {
    const user = auth.user?.serialize({
      fields: {
        pick: ['id', 'nome', 'email', 'cargo'],
      },
    })
    if (user) {
      await auth.use('api').logout()
      success(response, successHandle({ user }, 'Deslogado com sucesso'))
    } else {
      badRequest(response, {
        data: {
          errors: [{ message: 'Token inválido.' }],
        },
        message: 'Não há token válido para esta requisição',
      })
    }
  }
}
