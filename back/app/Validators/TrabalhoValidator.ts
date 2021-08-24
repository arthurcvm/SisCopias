import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Trabalho from 'App/Models/Trabalho'

const trabalho = Object.keys(Trabalho.$keys.columnsToSerialized.all())

export const indexSchema = schema.create({
  page: schema.number(),
  per_page: schema.number([rules.range(10, 100)]),
  order_column: schema.string.optional({}, [rules.regex(new RegExp(`^(${trabalho.join('|')})$`))]),
  order: schema.enum.optional(['asc', 'desc'] as const),
})

export const showSchema = schema.create({
  params: schema.object().members({
    id: schema.number([rules.exists({ table: 'trabalhos', column: 'id' })]),
  }),
})

export const createSchema = schema.create({
  arquivo: schema.string({
    trim: true,
  }),
  num_originais: schema.number(),
  qtd_copias: schema.number(),
  frente_verso: schema.boolean(),
  solicitacao_id: schema.number([rules.exists({ table: 'solicitacoes', column: 'id' })]),
})

export const updateSchema = schema.create({
  arquivo: schema.string.optional({
    trim: true,
  }),
  num_originais: schema.number.optional(),
  qtd_copias: schema.number.optional(),
  frente_verso: schema.boolean.optional(),
})
