import { type CSSProperties, useMemo } from 'react'
import type { UnitType } from '../../../solver/types'
import { countByUnit } from '../../helpers/countByUnit'
import { SINGLETON_UNITS, UNIT_METADATA } from '../App'
import { Section } from '../Section'
import { UnitTile } from '../UnitTile'

export interface UnitSelectorProps {
  onAddUnit: (unit: UnitType) => void
  onRemoveUnit: (unit: UnitType) => void
  draft: UnitType[]
}

export const UnitSelectorPanel: React.FC<UnitSelectorProps> = ({
  onAddUnit,
  onRemoveUnit,
  draft,
}) => {
  const countsByUnit = useMemo(() => countByUnit(draft), [draft])
  return (
    <Section
      aria-label='Unit Selector'
      title='Choose your units'
      subtitle='Use the controls to compose a draft, then let the solver split it into two armies.'
    >
      <div
        className='unit-grid'
        style={
          {
            '--columns-xl': 4,
            '--columns-sm': 2,
          } as CSSProperties
        }
      >
        {UNIT_METADATA.map(meta => {
          const count = countsByUnit[meta.id] ?? 0
          const isSingleton = SINGLETON_UNITS.includes(meta.id)
          const canAdd = !(isSingleton && count >= 1)

          return (
            <UnitTile
              key={meta.id}
              unit={meta}
              count={count}
              onAdd={
                canAdd && onAddUnit ? () => onAddUnit?.(meta.id) : undefined
              }
              onRemove={
                count > 0 && onRemoveUnit
                  ? () => onRemoveUnit?.(meta.id)
                  : undefined
              }
            />
          )
        })}
      </div>
    </Section>
  )
}
