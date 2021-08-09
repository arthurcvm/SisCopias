import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Solicitacao from 'App/Models/Solicitacao'
import { SolicitacoesStatusEnum } from 'Contracts/enums/solicitacoesStatusEnum'

const solicitacao = Object.keys(Solicitacao.$keys.columnsToSerialized.all())

export const indexSchema = schema.create({
  page: schema.number(),
  per_page: schema.number([rules.range(10, 100)]),
  order_column: schema.string.optional({}, [
    rules.regex(new RegExp(`^(${solicitacao.join('|')})$`)),
  ]),
  order: schema.enum.optional(['asc', 'desc'] as const),
})

export const showSchema = schema.create({
  params: schema.object().members({
    id: schema.number([rules.exists({ table: 'solicitacoes', column: 'id' })]),
  }),
})

export const createSchema = schema.create({
  observacoes: schema.string.optional({
    trim: true,
  }),
  justificativa: schema.string.optional({
    trim: true,
  }),
  status: schema.enum(Object.values(SolicitacoesStatusEnum)),
  solicitante_id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
  curso_id: schema.number([rules.exists({ table: 'cursos', column: 'id' })]),
})

export const updateSchema = schema.create({
  observacoes: schema.string.optional({
    trim: true,
  }),
  justificativa: schema.string.optional({
    trim: true,
  }),
  status: schema.enum.optional(Object.values(SolicitacoesStatusEnum)),
  solicitante_id: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
  autorizante_id: schema.number.optional([rules.exists({ table: 'users', column: 'id' })]),
  curso_id: schema.number.optional([rules.exists({ table: 'cursos', column: 'id' })]),
})
