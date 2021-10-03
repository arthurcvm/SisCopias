import 'reflect-metadata'
import execa from 'execa'
import { join } from 'path'
import getPort from 'get-port'
import { configure } from 'japa'
import sourceMapSupport from 'source-map-support'

process.env.NODE_ENV = 'testing'
process.env.ADONIS_ACE_CWD = join(__dirname)
sourceMapSupport.install({ handleUncaughtExceptions: false })

async function rollbackMigrations(): Promise<void> {
  await execa.node('ace', ['migration:rollback'], {
    stdio: 'inherit',
  })
}

async function runMigrations(): Promise<void> {
  await execa.node('ace', ['migration:run'], {
    stdio: 'inherit',
  })
}

async function runSeeds(): Promise<void> {
  await execa.node('ace', ['db:seed', '-f', 'database/seeders/UserSeeder'], {
    stdio: 'inherit',
  })
}

async function startHttpServer() {
  const { Ignitor } = await import('@adonisjs/core/build/src/Ignitor')
  process.env.PORT = String(await getPort())
  await new Ignitor(__dirname).httpServer().start()
}

/**
 * Configure test runner
 */
configure({
  files: ['test/**/*.spec.ts'],
  before: [rollbackMigrations, runMigrations, runSeeds, startHttpServer],
})
