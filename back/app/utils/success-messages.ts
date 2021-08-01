import { Data } from 'Contracts/data-response'

export const successHandle = (data: object, message: string = 'OK'): Data => ({
  data,
  message,
})
