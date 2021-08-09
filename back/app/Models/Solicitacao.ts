import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { SolicitacoesStatusEnum } from 'Contracts/enums/solicitacoesStatusEnum'
import User from './User'
import Curso from './Curso'

export default class Solicitacao extends BaseModel {
  public static table = 'solicitacoes'

  @column({ isPrimary: true })
  public id: number

  @column()
  public observacoes: string | null

  @column()
  public justificativa: string | null

  @column()
  public status: SolicitacoesStatusEnum

  @column()
  public solicitante_id: number

  @column()
  public autorizante_id: number | null

  @column()
  public curso_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'solicitante_id',
  })
  public solicitante: BelongsTo<typeof User>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'autorizante_id',
  })
  public autorizante: BelongsTo<typeof User>

  @belongsTo(() => Curso, {
    localKey: 'id',
    foreignKey: 'curso_id',
  })
  public curso: BelongsTo<typeof Curso>
}
