import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { UsersTypeEnum } from 'Contracts/enums/usersTypeEnum'

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nome').notNullable()
      table.boolean('ativo').notNullable().defaultTo(1)
      table.enum('cargo', Object.values(UsersTypeEnum)).notNullable()
      table.string('email', 255).notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.integer('curso_id').references('id').inTable('cursos').nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
