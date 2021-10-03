import validation from 'App/localization/validation'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

const email = 'admin@admin.com'
const password = 'secret'
let token = ''

test.group('Auth Controller', () => {
  test('[login] Should return 400 if no email is provided', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        password: password,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.required.replace('{{ field }}', 'email'))
  })

  test('[login] Should return 400 if no valid email is provided', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: '1',
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.email)
  })

  test('[login] Should return 400 if no password is provided', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: email,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, validation.required.replace('{{ field }}', 'senha'))
  })

  test('[login] Should return 400 if wrong data', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: email,
        password: email,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)

    assert.exists(body)
    assert.equal(body.data.errors[0].message, 'Certifique-se que digitou os dados corretamente.')
  })

  test('[login] Should return 200 if success login', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('/login')
      .send({
        email: email,
        password: password,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.exists(body)
    assert.exists(body.data.user)
    assert.equal(body.data.user.email, email)
    assert.exists(body.data.token)
    assert.equal(body.data.token.type, 'bearer')
    assert.exists(body.data.token.expires_at)
    token = body.data.token.token
  })

  test('[logout] Should return 200 if success logout', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('/logout')
      .auth(token, { type: 'bearer' })
      .send({
        email: email,
        password: password,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)

    assert.exists(body)
    assert.exists(body.data.user)
    assert.equal(body.data.user.email, email)
  })

  test('[logout] Should return 401 if invalid token', async (assert) => {
    /**
     * Make request
     */
    const { body } = await supertest(BASE_URL)
      .post('/logout')
      .auth(token, { type: 'bearer' })
      .send({
        email: email,
        password: password,
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401)

    assert.exists(body)
    assert.exists(body.errors)
    assert.equal(body.errors[0].message, 'E_UNAUTHORIZED_ACCESS: Unauthorized access')
  })
})
