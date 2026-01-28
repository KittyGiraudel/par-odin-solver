import chalk from 'chalk'
import { CHALLENGES } from './constants.js'
import { display, solve } from './utils.js'

CHALLENGES.forEach((symbols, index) => {
  const key = chalk.bold.underline(`Challenge #${index + 1}`)

  console.time(key)
  const [armyA, armyB] = solve(symbols)
  console.timeEnd(key)

  const solution = `${display(armyA, true)} === ${display(armyB, true)}`

  console.log(chalk.bold('Draft: ') + display(symbols, false))
  console.log(chalk.bold('Solution: ') + chalk.grey(solution))
  console.log('')
})
