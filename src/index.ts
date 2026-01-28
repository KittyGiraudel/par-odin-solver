import assert from 'node:assert'
import test from 'node:test'
import chalk from 'chalk'
import { CHALLENGES } from './constants.js'
import { Solver } from './Solver.js'

CHALLENGES.forEach((units, index) => {
  test(`Challenge #${index + 1}`, () => {
    const solver = new Solver(units)
    const key = chalk.bold.underline(`Challenge #${index + 1}`)

    console.time(key)
    const solution = solver.solve()
    console.timeEnd(key)

    assert.strictEqual(
      solver.getScore(solution[0]),
      solver.getScore(solution[1]),
      `Both armies should have equal sums`
    )

    solver.display(solution)
    console.log('')
  })
})
