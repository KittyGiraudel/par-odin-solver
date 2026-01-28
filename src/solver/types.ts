import type { UNIT_COLORS, UNIT_TYPES } from './constants.js'

export type UnitType = keyof typeof UNIT_TYPES

export type UnitColor = keyof typeof UNIT_COLORS

export type UnitValueFunction = (
  units: readonly UnitType[],
  index: number
) => number

export interface UnitDefinition {
  type: UnitColor
  value: UnitValueFunction
}

export type UnitsMap = {
  [K in UnitType]: UnitDefinition
}
