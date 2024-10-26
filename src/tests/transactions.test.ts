import app from 'src/server/app'
import supertest from 'supertest'
import {
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  expect,
  describe,
  test,
} from 'vitest'
import { execSync } from 'node:child_process'

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all')
  execSync('npm run knex migrate:latest')
})

describe('Transactions routes', () => {
  test('should be able to create a new transaction', async () => {
    await supertest(app.server)
      .post('/transactions')
      .send({ title: 'Transaction 1', amount: 500, type: 'credit' })
      .expect(201)
  })

  test('should be able to list all transactions', async () => {
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({ title: 'Transaction 1', amount: 500, type: 'credit' })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie') || []

    const { body } = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .send()
      .expect(200)

    expect(body.transactions).toEqual([
      expect.objectContaining({
        title: 'Transaction 1',
        amount: 500,
      }),
    ])
  })

  test('should be able to get a specific transaction', async () => {
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({ title: 'Transaction 1', amount: 500, type: 'credit' })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie') || []

    const listTransactionsResponse = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .send()
      .expect(200)

    const transactionId = listTransactionsResponse.body.transactions[0].id

    const { body } = await supertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .send()
      .expect(200)

    expect(body.transaction).toEqual(
      expect.objectContaining({
        title: 'Transaction 1',
        amount: 500,
      }),
    )
  })

  test.only('should be able to get the summary', async () => {
    const createTransactionResponse = await supertest(app.server)
      .post('/transactions')
      .send({ title: 'Transaction 1', amount: 500, type: 'credit' })
      .expect(201)

    const cookies = createTransactionResponse.get('Set-Cookie') || []

    await supertest(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({ title: 'Transaction 1', amount: 300, type: 'debit' })
      .expect(201)

    const { body } = await supertest(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .send()
      .expect(200)

    expect(body.summary).toEqual({
      amount: 200,
    })
  })
})
