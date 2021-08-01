import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Solicitacao from './Solicitacao'

export default class Trabalho extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public arquivo: string

  @column()
  public num_originais: number

  @column()
  public qtd_copias: number

  @column()
  public frente_verso: boolean

  @column()
  public solicitacao_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Solicitacao, {
    localKey: 'id',
    foreignKey: 'solicitacao_id',
  })
  public solicitacao: BelongsTo<typeof Solicitacao>
}
