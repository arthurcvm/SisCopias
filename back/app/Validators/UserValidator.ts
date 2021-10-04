import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import { UsersTypeEnum } from 'Contracts/enums/usersTypeEnum'

const user = Object.keys(User.$keys.columnsToSerialized.all())

export const indexSchema = schema.create({
  page: schema.number.optional(),
  per_page: schema.number.optional([rules.range(10, 100)]),
  order_column: schema.string.optional({}, [rules.regex(new RegExp(`^(${user.join('|')})$`))]),
  order: schema.enum.optional(['asc', 'desc'] as const),
})

export const showSchema = schema.create({
  params: schema.object().members({
    id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
  }),
})

export const createSchema = schema.create({
  nome: schema.string({
    trim: true,
  }),
  ativo: schema.boolean.optional(),
  cargo: schema.enum(Object.values(UsersTypeEnum)),
  email: schema.string({
    trim: true,
  }),
  password: schema.string({
    trim: true,
  }),
  curso_id: schema.number.optional([rules.exists({ table: 'cursos', column: 'id' })]),
})

export const updateSchema = schema.create({
  nome: schema.string.optional({
    trim: true,
  }),
  ativo: schema.boolean.optional(),
  cargo: schema.enum.optional(Object.values(UsersTypeEnum)),
  email: schema.string.optional({
    trim: true,
  }),
  password: schema.string.optional({
    trim: true,
  }),
  curso_id: schema.number.optional([rules.exists({ table: 'cursos', column: 'id' })]),
})
