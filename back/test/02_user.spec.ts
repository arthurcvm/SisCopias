import validation from 'App/localization/validation'
import User from 'App/Models/User'
import { UsersTypeEnum } from 'Contracts/enums/usersTypeEnum'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}/users`

const user = new User()
user.id = 2
user.nome = 'admin'
user.ativo = true
user.cargo = UsersTypeEnum.ADMIN
user.email = 'admin2@admin.com'
user.password = 'secret'
let token = ''

test.group('User Controller', (group) => {
  group.before(async () => {
    const { body } = await supertest(
      `http://${String(process.env.HOST)}:${String(process.env.PORT)}`
    )
      .post('/login')
      .send({
        email: 'admin@admin.com',
        password: 'secret',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    token = body.data.token.token
  })

  test('[store] Should return 400 if no name is provided', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('')
      .auth(token, { type: 'bearer' })
      .send({
        email: user.email,
        password: user.password,
        ativo: user.ativo,
        cargo: user.cargo,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.required.replace('{{ field }}', 'nome'))
  })

  test('[store] Should return 400 if no email is provided', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('')
      .auth(token, { type: 'bearer' })
      .send({
        nome: user.nome,
        password: user.password,
        ativo: user.ativo,
        cargo: user.cargo,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.required.replace('{{ field }}', 'email'))
  })

  test('[store] Should return 400 if no cargo is provided', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('')
      .auth(token, { type: 'bearer' })
      .send({
        email: user.email,
        nome: user.nome,
        password: user.password,
        ativo: user.ativo,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.required.replace('{{ field }}', 'cargo'))
  })

  test('[store] Should return 200 if insert a new user', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('')
      .auth(token, { type: 'bearer' })
      .send({
        email: user.email,
        nome: user.nome,
        password: user.password,
        ativo: user.ativo,
        cargo: user.cargo,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.exists(body)
    assert.equal(body.data.nome, user.nome)
    assert.equal(body.data.email, user.email)
    assert.equal(body.data.ativo, user.ativo)
    assert.equal(body.data.cargo, user.cargo)
  })

  test('[update] Should return 400 if nome type is incorrect', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .put(`/${user.id}`)
      .auth(token, { type: 'bearer' })
      .send({
        nome: 1234,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.string.replace('{{ field }}', 'nome'))
  })

  test('[update] Should return 400 if cargo type is incorrect', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .put(`/${user.id}`)
      .auth(token, { type: 'bearer' })
      .send({
        cargo: 'a',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(
      body.data.errors[0].message,
      validation.enum
        .replace('{{ field }}', 'cargo')
        .replace('{{ options.choices }}', Object.values(UsersTypeEnum).toString())
    )
  })

  test('[update] Should return 200 if update a user', async (assert) => {
    user.nome = 'New name'
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .put(`/${user.id}`)
      .auth(token, { type: 'bearer' })
      .send({
        nome: user.nome,
        related: {},
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.exists(body)
    assert.equal(body.data.nome, user.nome)
  })

  test('[index] Should return 200 if list users', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .get('')
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.exists(body)
    assert.equal(body.data.data[1].nome, user.nome)
    assert.equal(body.data.data[1].email, user.email)
    assert.equal(body.data.data[1].cargo, user.cargo)
    assert.equal(body.data.data[1].ativo, user.ativo)
    assert.equal(body.data.data[1].id, user.id)
  })

  test('[show] Should return 400 if id param type is incorrect', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .get('/a')
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.number.replace('{{ field }}', 'id'))
  })

  test('[show] Should return 400 if id param not exists', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .get('/10')
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.exists.replace('{{ field }}', 'id'))
  })

  test('[show] Should return 200 if show a user', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .get(`/${user.id}`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.exists(body)
    assert.equal(body.data.nome, user.nome)
    assert.equal(body.data.email, user.email)
    assert.equal(body.data.cargo, user.cargo)
    assert.equal(body.data.ativo, user.ativo)
    assert.equal(body.data.id, user.id)
  })

  test('[delete] Should return 400 if id param type is incorrect', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .delete('/a')
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.number.replace('{{ field }}', 'id'))
  })

  test('[delete] Should return 400 if id param not exists', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .delete('/10')
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.exists.replace('{{ field }}', 'id'))
  })

  test('[delete] Should return 200 if delete a user', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .delete(`/${user.id}`)
      .auth(token, { type: 'bearer' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.exists(body)
    assert.equal(body.data.id, user.id)
  })
})
