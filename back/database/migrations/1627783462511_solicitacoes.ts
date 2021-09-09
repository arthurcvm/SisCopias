import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { SolicitacoesStatusEnum } from 'Contracts/enums/solicitacoesStatusEnum'

export default class Solicitacoes extends BaseSchema {
  protected tableName = 'solicitacoes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('observacoes')
      table.string('justificativa')
      table.enum('status', Object.values(SolicitacoesStatusEnum)).notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.integer('solicitante_id').references('id').inTable('users').notNullable()
      table.integer('autorizante_id').references('id').inTable('users').nullable()
      table.integer('curso_id').references('id').inTable('cursos').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
