import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Trabalhos extends BaseSchema {
  protected tableName = 'trabalhos'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('arquivo').notNullable()
      table.integer('num_originais').notNullable()
      table.integer('qtd_copias').notNullable()
      table.boolean('frente_verso').notNullable()
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.integer('solicitacao_id').references('id').inTable('solicitacoes').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
