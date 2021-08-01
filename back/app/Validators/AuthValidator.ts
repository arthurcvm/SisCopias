import { schema, rules } from '@ioc:Adonis/Core/Validator'

export const loginSchema = schema.create({
  email: schema.string(
    {
      trim: true,
    },
    [rules.email()]
  ),
  password: schema.string({}, [rules.maxLength(180)]),
})
