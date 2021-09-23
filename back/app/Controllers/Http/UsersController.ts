import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { badRequest, success } from 'App/Helpers/http-helper'
import validation from 'App/localization/validation'
import User from 'App/Models/User'
import { errorHandle } from 'App/utils/errors-messages'
import { queryHandle } from 'App/utils/query-builder'
import { successHandle } from 'App/utils/success-messages'
import { createSchema, indexSchema, showSchema, updateSchema } from 'App/Validators/UserValidator'

export default class UsersController {
  public async index({ response, request }: HttpContextContract): Promise<void> {
    try {
      const validatedData = await request.validate({
        schema: indexSchema,
        messages: validation,
      })

      const query = User.query()
      const user = await queryHandle(query, validatedData, request.qs().search)

      success(response, successHandle(user, 'Filtro realizado com sucesso'))
    } catch (error) {
      const fields = {
        page: 'página',
        per_page: 'por página',
        order_column: 'coluna de ordenação',
        order: 'ordem',
        filter: 'filtro',
      }
      badRequest(response, errorHandle(error.messages.errors, fields))
    }
  }

  public async store({ response, request }: HttpContextContract): Promise<void> {
    try {
      const validatedData = await request.validate({
        schema: createSchema,
        messages: validation,
      })

      const user = await User.create(validatedData)

      success(response, successHandle(user, 'Usuário criado com sucesso'))
    } catch (error) {
      const fields = {
        password: 'senha',
        curso_id: 'curso',
      }
      badRequest(response, errorHandle(error.messages.errors, fields))
    }
  }

  public async show({ request, response }: HttpContextContract): Promise<void> {
    try {
      const validatedData = await request.validate({
        schema: showSchema,
        messages: validation,
      })

      const user = await User.query().where('id', validatedData.params.id).firstOrFail()

      success(response, successHandle(user))
    } catch (error) {
      const fields = { 'params.id': 'id' }
      badRequest(response, errorHandle(error.messages.errors, fields, 'id incorreto'))
    }
  }

  public async update({ params, request, response }: HttpContextContract): Promise<void> {
    const user = await User.find(params.id)

    if (user) {
      try {
        const validatedData = await request.validate({
          schema: updateSchema,
          messages: validation,
        })

        user.merge(validatedData)
        await user.save()

        success(response, successHandle(user, 'Usuário atualizado com sucesso'))
      } catch (error) {
        const fields = {
          password: 'senha',
          curso_id: 'curso',
        }
        badRequest(response, errorHandle(error.messages.errors, fields))
      }
    }
  }

  public async destroy({ request, response }: HttpContextContract): Promise<void> {
    try {
      const validatedData = await request.validate({
        schema: showSchema,
        messages: validation,
      })

      const user = await User.find(validatedData.params.id)
      if (user) {
        user.ativo = false
        await user.save()

        success(response, successHandle(user, 'Usuário desativado com sucesso'))
      }
    } catch (error) {
      const fields = { 'params.id': 'id' }
      badRequest(response, errorHandle(error.messages.errors, fields, 'id incorreto'))
    }
  }
}
