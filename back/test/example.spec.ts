import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Welcome', () => {
  test.skip('ensure home page works', async (assert) => {
    /**
     * Make request
     */
    const { text } = await supertest(BASE_URL).get('/').expect(200)

    /**
     * Construct JSDOM instance using the response HTML
     */
    const { document } = new JSDOM(text).window

    const title = document.querySelector('.title')
    assert.exists(title)
    assert.equal(title!.textContent!.trim(), 'It Works!')
  })
})
