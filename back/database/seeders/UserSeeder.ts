import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { UsersTypeEnum } from 'Contracts/enums/usersTypeEnum'

export default class UserSeederSeeder extends BaseSeeder {
  public async run() {
    await User.create({
      nome: 'Admin',
      email: 'admin@admin.com',
      password: 'secret',
      cargo: UsersTypeEnum.ADMIN,
    })
  }
}
