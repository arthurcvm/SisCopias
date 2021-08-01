import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { badRequest, success } from 'App/Helpers/http-helper'
import validation from 'App/localization/validation'
import Curso from 'App/Models/Curso'
import { errorHandle } from 'App/utils/errors-messages'
import { queryHandle } from 'App/utils/query-builder'
import { successHandle } from 'App/utils/success-messages'
import { createSchema, indexSchema, showSchema, updateSchema } from 'App/Validators/CursoValidator'

export default class CursosController {
  public async index({ response, request }: HttpContextContract): Promise<void> {
    try {
      const validatedData = await request.validate({
        schema: indexSchema,
        messages: validation,
      })

      const query = Curso.query()
      const columns: string[] = ['nome']
      const curso = await queryHandle(query, validatedData, request.qs().search, columns)

      success(response, successHandle(curso, 'Filtro realizado com sucesso'))
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

      const curso = await Curso.create({
        nome: validatedData.nome,
      })

      success(response, successHandle(curso, 'Curso criado com sucesso'))
    } catch (error) {
      const fields = {
        nome: 'nome',
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

      const curso = await Curso.query().where('id', validatedData.params.id).firstOrFail()

      success(response, successHandle(curso))
    } catch (error) {
      const fields = { 'params.id': 'id' }
      badRequest(response, errorHandle(error.messages.errors, fields, 'id incorreto'))
    }
  }

  public async update({ params, request, response }: HttpContextContract): Promise<void> {
    const curso = await Curso.find(params.id)

    if (curso) {
      try {
        const validatedData = await request.validate({
          schema: updateSchema,
          messages: validation,
        })

        curso.merge({
          nome: validatedData.nome,
        })
        await curso.save()

        success(response, successHandle(curso, 'Curso atualizado com sucesso'))
      } catch (error) {
        const fields = {
          nome: 'nome',
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

      const curso = await Curso.find(validatedData.params.id)
      if (curso) {
        await curso.delete()

        success(response, successHandle(curso, 'Curso excluído com sucesso'))
      }
    } catch (error) {
      const fields = { 'params.id': 'id' }
      badRequest(response, errorHandle(error.messages.errors, fields, 'id incorreto'))
    }
  }
}
