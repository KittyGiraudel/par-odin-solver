import type React from 'react'
import type { UnitType } from '../../../solver/types.js'
import { UnitTag } from '../UnitTag'
import './styles.css'
import { SINGLETON_UNITS } from '../App/index.js'

export interface UnitMeta {
  id: UnitType
  color: 'WHITE' | 'BLACK'
  label: string
  description: string
}

export interface UnitsPanelProps {
  units: readonly UnitMeta[]
  countsByUnit: Record<UnitType, number>
  onAddUnit: (unit: UnitType) => void
  onRemoveUnit: (unit: UnitType) => void
}

export const UnitsPanel: React.FC<UnitsPanelProps> = ({
  units,
  countsByUnit,
  onAddUnit,
  onRemoveUnit,
}) => {
  return (
    <section aria-label='Draft builder' className='po-units-panel'>
      <h3 className='po-units-title'>Units</h3>
      <p className='po-units-help'>
        Click + to add units to the draft and − to remove them.
      </p>

      <div className='po-units-grid'>
        {units.map(meta => {
          const count = countsByUnit[meta.id] ?? 0
          const isSingleton = SINGLETON_UNITS.includes(meta.id)
          const canAdd = !(isSingleton && count >= 1)

          return (
            <div key={meta.id} className='po-units-row'>
              <div className='po-units-row-header'>
                <div className='po-units-name'>
                  <UnitTag unit={meta.id} color={meta.color} />
                </div>
                <div className='po-units-controls'>
                  <button
                    type='button'
                    onClick={() => onRemoveUnit(meta.id)}
                    disabled={count === 0}
                    className={`po-units-btn po-units-btn--minus${
                      count === 0 ? ' po-units-btn--disabled' : ''
                    }`}
                    aria-label={`Remove ${meta.id}`}
                    title={`Remove ${meta.id}`}
                  >
                    −
                  </button>
                  <span className='po-units-count'>{count}</span>
                  <button
                    type='button'
                    onClick={() => onAddUnit(meta.id)}
                    disabled={!canAdd}
                    className={`po-units-btn po-units-btn--plus${
                      !canAdd ? ' po-units-btn--disabled' : ''
                    }`}
                    aria-label={`Add ${meta.id}`}
                    title={`Add ${meta.id}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <div className='po-units-description'>{meta.description}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
