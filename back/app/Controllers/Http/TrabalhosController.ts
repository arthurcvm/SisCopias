import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { badRequest, success } from 'App/Helpers/http-helper'
import validation from 'App/localization/validation'
import Trabalho from 'App/Models/Trabalho'
import { errorHandle } from 'App/utils/errors-messages'
import { queryHandle } from 'App/utils/query-builder'
import { successHandle } from 'App/utils/success-messages'
import {
  createSchema,
  indexSchema,
  showSchema,
  updateSchema,
} from 'App/Validators/TrabalhoValidator'

export default class TrabalhosController {
  public async index({ response, request }: HttpContextContract): Promise<void> {
    try {
      const validatedData = await request.validate({
        schema: indexSchema,
        messages: validation,
      })

      const query = Trabalho.query()
      const trabalho = await queryHandle(query, validatedData, request.qs().search)

      success(response, successHandle(trabalho, 'Filtro realizado com sucesso'))
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

      const trabalho = await Trabalho.create(validatedData)

      success(response, successHandle(trabalho, 'Trabalho criado com sucesso'))
    } catch (error) {
      const fields = {
        num_originais: 'número de originais',
        qtd_copias: 'quantidade de cópias',
        frente_verso: 'frente e verso',
        solicitacao_id: 'solicitação',
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

      const trabalho = await Trabalho.query().where('id', validatedData.params.id).firstOrFail()

      success(response, successHandle(trabalho))
    } catch (error) {
      const fields = { 'params.id': 'id' }
      badRequest(response, errorHandle(error.messages.errors, fields, 'id incorreto'))
    }
  }

  public async update({ params, request, response }: HttpContextContract): Promise<void> {
    const trabalho = await Trabalho.find(params.id)

    if (trabalho) {
      try {
        const validatedData = await request.validate({
          schema: updateSchema,
          messages: validation,
        })

        trabalho.merge(validatedData)
        await trabalho.save()

        success(response, successHandle(trabalho, 'Trabalho atualizado com sucesso'))
      } catch (error) {
        const fields = {
          num_originais: 'número de originais',
          qtd_copias: 'quantidade de cópias',
          frente_verso: 'frente e verso',
          solicitacao_id: 'solicitação',
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

      const trabalho = await Trabalho.find(validatedData.params.id)
      if (trabalho) {
        await trabalho.delete()

        success(response, successHandle(trabalho, 'Trabalho excluído com sucesso'))
      }
    } catch (error) {
      const fields = { 'params.id': 'id' }
      badRequest(response, errorHandle(error.messages.errors, fields, 'id incorreto'))
    }
  }
}
