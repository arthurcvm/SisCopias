import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Curso from 'App/Models/Curso'

const curso = Object.keys(Curso.$keys.columnsToSerialized.all())

export const indexSchema = schema.create({
  page: schema.number(),
  per_page: schema.number([rules.range(10, 100)]),
  order_column: schema.string.optional({}, [rules.regex(new RegExp(`^(${curso.join('|')})$`))]),
  order: schema.enum.optional(['asc', 'desc'] as const),
  filter: schema.object().members({
    nome: schema.string.optional(),
  }),
})

export const showSchema = schema.create({
  params: schema.object().members({
    id: schema.number([rules.exists({ table: 'cursos', column: 'id' })]),
  }),
})

export const createSchema = schema.create({
  nome: schema.string({
    trim: true,
  }),
})

export const updateSchema = schema.create({
  nome: schema.string.optional({
    trim: true,
  }),
})
