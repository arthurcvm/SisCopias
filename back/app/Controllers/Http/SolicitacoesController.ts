import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { badRequest, success } from 'App/Helpers/http-helper'
import validation from 'App/localization/validation'
import Solicitacao from 'App/Models/Solicitacao'
import { errorHandle } from 'App/utils/errors-messages'
import { queryHandle } from 'App/utils/query-builder'
import { successHandle } from 'App/utils/success-messages'
import {
  createSchema,
  indexSchema,
  showSchema,
  updateSchema,
} from 'App/Validators/SolicitacaoValidator'

export default class SolicitacoesController {
  public async index({ response, request }: HttpContextContract): Promise<void> {
    try {
      const validatedData = await request.validate({
        schema: indexSchema,
        messages: validation,
      })

      const query = Solicitacao.query()
      const solicitacao = await queryHandle(query, validatedData, request.qs().search)

      success(response, successHandle(solicitacao, 'Filtro realizado com sucesso'))
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

      const solicitacao = await Solicitacao.create(validatedData)

      success(response, successHandle(solicitacao, 'Solicitação criada com sucesso'))
    } catch (error) {
      const fields = {
        observacoes: 'observações',
        solicitante_id: 'solicitante',
        autorizante_id: 'autorizante',
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

      const solicitacao = await Solicitacao.query()
        .where('id', validatedData.params.id)
        .firstOrFail()

      success(response, successHandle(solicitacao))
    } catch (error) {
      const fields = { 'params.id': 'id' }
      badRequest(response, errorHandle(error.messages.errors, fields, 'id incorreto'))
    }
  }

  public async update({ params, request, response }: HttpContextContract): Promise<void> {
    const solicitacao = await Solicitacao.find(params.id)

    if (solicitacao) {
      try {
        const validatedData = await request.validate({
          schema: updateSchema,
          messages: validation,
        })

        solicitacao.merge(validatedData)
        await solicitacao.save()

        success(response, successHandle(solicitacao, 'Solicitação atualizada com sucesso'))
      } catch (error) {
        const fields = {
          observacoes: 'observações',
          solicitante_id: 'solicitante',
          autorizante_id: 'autorizante',
          curso_id: 'curso',
        }
        badRequest(response, errorHandle(error.messages.errors, fields))
      }
    }
  }
}
