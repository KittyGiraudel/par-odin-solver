import chalk from 'chalk'
import { UNIT_COLORS, UNIT_TYPES, UNITS } from './constants.js'
import type { UnitColor, UnitType } from './types.js'

export const resolveUnitScore = (
  unit: UnitType,
  index: number,
  units: readonly UnitType[]
): number => UNITS[unit].value(units, index)

export const sum = (array: number[]): number => array.reduce((a, b) => a + b, 0)

export const is =
  (key: 'type' | 'color', value: UnitType | UnitColor) => (unit: UnitType) => {
    if (key === 'type') return unit === value
    if (key === 'color') return UNITS[unit].type === value
    return false
  }

export const isnt =
  (key: 'type' | 'color', value: UnitType | UnitColor) => (unit: UnitType) => {
    if (key === 'type') return unit !== value
    if (key === 'color') return UNITS[unit].type !== value
    return false
  }

export function* permute(permutation: UnitType[]): Generator<UnitType[]> {
  const length = permutation.length
  const c = Array(length).fill(0)
  let i = 1
  let k: number
  let p: UnitType

  yield [...permutation]
  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i] ? c[i] : 0
      p = permutation[i]
      permutation[i] = permutation[k]
      permutation[k] = p
      ++c[i]
      i = 1
      yield [...permutation]
    } else {
      c[i] = 0
      ++i
    }
  }
}

export function* getPossibilities(
  units: readonly UnitType[]
): Generator<[UnitType[], UnitType[]]> {
  for (const permutation of permute([...units])) {
    for (let i = 0; i < permutation.length - 1; i++) {
      const A = permutation.slice(0, i)
      const B = permutation.slice(i)
      yield [A, B]
    }
  }
}

export const occurrences = (units: readonly UnitType[]) =>
  units.reduce(
    (acc, unit) => acc.set(unit, (acc.get(unit) || 0) + 1),
    new Map<string, number>()
  )

export const mapValues = <K, V>(map: Map<K, V>): V[] => Array.from(map.values())

export const getUnitColor = (unit: UnitType) => {
  const unitDef = UNITS[unit]

  if (unitDef.type === UNIT_COLORS.WHITE) {
    // White units with individual colors
    switch (unit) {
      case UNIT_TYPES.HERO:
        return chalk.magenta(unit)
      case UNIT_TYPES.CAPTAIN:
        return chalk.gray(unit)
      case UNIT_TYPES.SOLDIER:
        return chalk.green(unit)
      case UNIT_TYPES.CURSED:
        return chalk.yellow(unit)
      case UNIT_TYPES.MAGE:
        return chalk.cyan(unit)
      case UNIT_TYPES.TRAITOR:
        return chalk.red(unit)
      default:
        return chalk.white(unit)
    }
  } else {
    // Black units with individual colors
    switch (unit) {
      case UNIT_TYPES.WOLF:
        return chalk.bgBlue(unit)
      case UNIT_TYPES.SNAKE:
        return chalk.bgGreen(unit)
      case UNIT_TYPES.HORSE:
        return chalk.bgGray(unit)
      case UNIT_TYPES.DRAGON:
        return chalk.bgRed(unit)
      case UNIT_TYPES.BOAR:
        return chalk.bgYellow(unit)
      case UNIT_TYPES.EAGLE:
        return chalk.bgMagenta(unit)
      default:
        return chalk.black(unit)
    }
  }
}
