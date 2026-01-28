import chalk from 'chalk'
import { UNIT_TYPES, UNITS } from './constants.js'
import type { UnitType } from './types.js'
import { getPossibilities, resolveUnitScore, sum } from './utils.js'

export class Solver {
  units: readonly UnitType[]

  constructor(units: readonly UnitType[]) {
    this.units = units
  }

  // 1. Remove the Boar and the Eagle as they do not take side and impact both armies
  // 2. Generate the various split possibilities (each yielding 2 armies)
  // 3. Add back the Boar and/or the Eagle to both armies (if initially present)
  // 4. Sort each armies (needed for the Traitor)
  // 5. Compute the army scores, and return if they match
  solve(): [UnitType[], UnitType[]] {
    const { BOAR, EAGLE } = UNIT_TYPES
    const unitsWithoutNeutrals = this.units.filter(
      unit => unit !== BOAR && unit !== EAGLE
    )

    for (const [A, B] of getPossibilities(unitsWithoutNeutrals)) {
      if (this.units.includes(BOAR)) A.push(BOAR), B.push(BOAR)
      if (this.units.includes(EAGLE)) A.push(EAGLE), B.push(EAGLE)

      A.sort(this.sortUnits)
      B.sort(this.sortUnits)

      if (this.getScore(A) === this.getScore(B)) return [A, B]
    }

    throw new Error(`Could not solve: ${this.displayUnits(this.units, false)}`)
  }

  displayUnits(units: readonly UnitType[], withValues = false) {
    return units
      .map((unit, index) =>
        withValues
          ? `${UNITS[unit].color(unit)} (${UNITS[unit].value(units, index)})`
          : UNITS[unit].color(unit)
      )
      .join(withValues ? ' + ' : ', ')
  }

  display([armyA, armyB]: [UnitType[], UnitType[]]) {
    const solution = `${this.displayUnits(armyA, true)} === ${this.displayUnits(armyB, true)}`
    console.log(chalk.bold('Draft: ') + this.displayUnits(this.units, false))
    console.log(chalk.bold('Solution: ') + chalk.grey(solution))
  }

  sortUnits(A: UnitType, B: UnitType): number {
    return Object.keys(UNITS).indexOf(A) - Object.keys(UNITS).indexOf(B)
  }

  resolveUnits(units: readonly UnitType[]) {
    return units.map((unit, index) => resolveUnitScore(unit, index, units))
  }

  getScore(units: readonly UnitType[]) {
    return sum(this.resolveUnits(units))
  }
}
