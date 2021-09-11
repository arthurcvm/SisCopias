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
        .select('id', 'nome', 'email', 'cargo', 'ativo')
        .where('email', email)
        .firstOrFail()

      if (user.ativo) {
        success(response, successHandle({ user, token }, `Bem vindo(a) ${user.nome}`))
      } else {
        badRequest(response, {
          data: {
            errors: [{ message: 'Usuário sem autorização de acesso.' }],
          },
          message: 'Usuário sem autorização de acesso.',
        })
      }
    } catch (error) {
      const fields = {
        password: 'senha',
      }

      if (error.messages) {
        badRequest(response, errorHandle(error.messages.errors, fields))
      } else {
        badRequest(response, {
          data: {
            errors: [{ message: 'Certifique-se que digitou os dados corretamente.' }],
          },
          message: 'Email e/ou senha incorreto(s)',
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
