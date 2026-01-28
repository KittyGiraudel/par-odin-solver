import { UNITS } from './constants.js'
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

export const occurrences = (units: readonly UnitType[]) =>
  units.reduce(
    (acc, unit) => acc.set(unit, (acc.get(unit) || 0) + 1),
    new Map<string, number>()
  )

export const mapValues = <K, V>(map: Map<K, V>): V[] => Array.from(map.values())
