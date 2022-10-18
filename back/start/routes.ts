/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { UsersTypeEnum } from 'Contracts/enums/usersTypeEnum'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.post('login', 'AuthController.login')
Route.post('logout', 'AuthController.logout').middleware('auth')

Route.group(() => {
  Route.group(() => {
    Route.get('', 'UsersController.index').as('index').middleware('indexMiddleware')
    Route.post('', 'UsersController.store').as('store')
    Route.get('/:id', 'UsersController.show').as('show')
    Route.put('/:id', 'UsersController.update').as('update')
    Route.delete('/:id', 'UsersController.destroy').as('destroy')
  })
    .prefix('users')
    .as('users')
    .middleware('cargoMiddleware:' + UsersTypeEnum.ADMIN + ',' + UsersTypeEnum.COORDENADOR)

  Route.group(() => {
    Route.get('', 'CursosController.index').as('index').middleware('indexMiddleware')
    Route.post('', 'CursosController.store').as('store')
    Route.get('/:id', 'CursosController.show').as('show')
    Route.put('/:id', 'CursosController.update').as('update')
    Route.delete('/:id', 'CursosController.destroy').as('destroy')
  })
    .prefix('cursos')
    .as('cursos')
    .middleware('cargoMiddleware:' + UsersTypeEnum.ADMIN + ',' + UsersTypeEnum.COORDENADOR)

  Route.group(() => {
    Route.get('', 'SolicitacoesController.index').as('index').middleware('indexMiddleware')
    Route.post('', 'SolicitacoesController.store').as('store')
    Route.get('/:id', 'SolicitacoesController.show').as('show')
    Route.put('/:id', 'SolicitacoesController.update').as('update')
  })
    .prefix('solicitacoes')
    .as('solicitacoes')
    .middleware(
      'cargoMiddleware:' +
        UsersTypeEnum.ADMIN +
        ',' +
        UsersTypeEnum.COORDENADOR +
        ',' +
        UsersTypeEnum.PROFESSOR +
        ',' +
        UsersTypeEnum.SERVIDOR
    )
}).middleware('auth')
