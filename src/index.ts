import chalk from 'chalk'
import { CHALLENGES } from './constants.js'
import { displayUnits, solve } from './utils.js'

CHALLENGES.forEach((units, index) => {
  const key = chalk.bold.underline(`Challenge #${index + 1}`)

  console.time(key)
  const [armyA, armyB] = solve(units)
  console.timeEnd(key)

  const solution = `${displayUnits(armyA, true)} === ${displayUnits(armyB, true)}`

  console.log(chalk.bold('Draft: ') + displayUnits(units, false))
  console.log(chalk.bold('Solution: ') + chalk.grey(solution))
  console.log('')
})
