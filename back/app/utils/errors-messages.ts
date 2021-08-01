import { ApiErrorNode } from '@ioc:Adonis/Core/Validator'
import { Data } from 'Contracts/data-response'

export const errorHandle = (
  messages: ApiErrorNode[],
  fields: object,
  message: string = 'Formulário preenchido incorretamente'
): Data => {
  messages.forEach((m) => {
    m.message = m.message
      .replace(/(\w+)/g, (match, key) => fields[key] || match)
      .split(/\.\d/g)
      .join('')
      .split(/params\./g)
      .join('')
  })

  const data: Data = {
    data: { errors: messages },
    message,
  }

  return data
}
