import type React from 'react'
import { useMemo } from 'react'
import type { UnitType } from '../../../solver/types.js'
import { countByUnit } from '../../helpers/countByUnit.js'
import { SINGLETON_UNITS, UNIT_METADATA } from '../App/index.js'
import { UnitTile } from '../UnitTile'
import './styles.css'

export interface UnitGridProps {
  units: readonly UnitType[]
  onAddUnit?: (unit: UnitType) => void
  onRemoveUnit?: (unit: UnitType) => void
}

export const UnitGrid: React.FC<UnitGridProps> = ({
  units,
  onAddUnit,
  onRemoveUnit,
}) => {
  const countsByUnit = useMemo(() => countByUnit(units), [units])
  return (
    <div className='UnitGrid'>
      {units.map((type, index) => {
        const unitMeta = UNIT_METADATA.find(meta => meta.id === type)!
        const count = countsByUnit[type] ?? 0
        const isSingleton = SINGLETON_UNITS.includes(type)
        const canAdd = !(isSingleton && count >= 1)

        return (
          <UnitTile
            key={`${type}-${index.toString()}`}
            unit={unitMeta}
            count={count}
            onAdd={canAdd && onAddUnit ? () => onAddUnit?.(type) : undefined}
            onRemove={
              count > 0 && onRemoveUnit ? () => onRemoveUnit?.(type) : undefined
            }
          />
        )
      })}
    </div>
  )
}
