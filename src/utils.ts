import { UNIT_TYPES, UNITS } from './constants.js'
import type { UnitColor, UnitType } from './types.js'

// This is the main solving function. It is built on top of the `permute` function which was
// shamefully taken from StackOverflow because I am not smart enough to write such code. It makes
// use of a generator to iteratively yield permutations of the given units (instead of computing
// them all to begin with, which is slow and inefficient).
// See: https://stackoverflow.com/a/37580979
export function solve(units: readonly UnitType[]): [UnitType[], UnitType[]] {
  const { BOAR, EAGLE } = UNIT_TYPES
  const unitsWithoutNeutrals = units.filter(
    unit => unit !== BOAR && unit !== EAGLE
  )

  for (const permutation of permute(unitsWithoutNeutrals)) {
    for (let i = 0; i < permutation.length - 1; i++) {
      const A = permutation.slice(0, i)
      const B = permutation.slice(i)

      if (units.includes(BOAR)) A.push(BOAR), B.push(BOAR)
      if (units.includes(EAGLE)) A.push(EAGLE), B.push(EAGLE)

      const valuesA = resolveUnitsScore(A)
      const valuesB = resolveUnitsScore(B)

      if (sum(valuesA) === sum(valuesB))
        return [A.sort(sortUnits), B.sort(sortUnits)]
    }
  }

  throw new Error(`Could not solve: ${displayUnits(units, false)}`)
}

export function displayUnits(
  units: readonly UnitType[],
  withValues = false
): string {
  return units
    .map((unit, index) =>
      withValues
        ? `${UNITS[unit].color(unit)} (${UNITS[unit].value(units, index)})`
        : UNITS[unit].color(unit)
    )
    .join(withValues ? ' + ' : ', ')
}

export const sortUnits = (A: UnitType, B: UnitType): number =>
  Object.keys(UNITS).indexOf(A) - Object.keys(UNITS).indexOf(B)

export const resolveUnitScore = (
  unit: UnitType,
  index: number,
  units: readonly UnitType[]
): number => UNITS[unit].value(units, index)

export const resolveUnitsScore = (units: readonly UnitType[]): number[] =>
  units.map((unit, index) => resolveUnitScore(unit, index, units))

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

function* permute(permutation: UnitType[]): Generator<UnitType[]> {
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
