import type { UnitType } from '../../solver/types'

export const countByUnit = (units: readonly UnitType[]) =>
  units.reduce(
    (acc: Record<UnitType, number>, unit) => ({
      ...acc,
      [unit]: (acc[unit] ?? 0) + 1,
    }),
    {} as Record<UnitType, number>
  )
