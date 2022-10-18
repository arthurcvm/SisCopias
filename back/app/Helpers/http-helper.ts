import { ResponseContract } from '@ioc:Adonis/Core/Response'
import { Data } from 'Contracts/data-response'

export const success = (response: ResponseContract, data: Data, code: number = 200): void => {
  response.status(code).send(data)
}

export const badRequest = (response: ResponseContract, data: Data, code: number = 400): void => {
  response.status(code).send(data)
}
