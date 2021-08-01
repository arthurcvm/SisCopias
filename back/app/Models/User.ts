import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { UsersTypeEnum } from 'Contracts/enums/usersTypeEnum'
import Curso from './Curso'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public nome: string

  @column()
  public ativo: boolean

  @column()
  public cargo: UsersTypeEnum

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public curso_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @belongsTo(() => Curso, {
    localKey: 'id',
    foreignKey: 'curso_id',
  })
  public curso: BelongsTo<typeof Curso>
}
