import type React from 'react'
import type { UnitType } from '../../../solver/types.js'
import type { UnitMeta } from '../App/index.js'
import { getUnitEmoji, UnitTag } from '../UnitTag'
import './styles.css'

export interface UnitTileProps {
  unit: UnitMeta
  count: number
  score?: number
  onAdd?: () => void
  onRemove?: () => void
}

export const UnitTile: React.FC<UnitTileProps> = ({
  unit,
  count,
  onAdd,
  onRemove,
  score,
}) => {
  const emoji = getUnitEmoji(unit.id as UnitType)
  const toneClass =
    unit.color === 'WHITE' ? 'unit-tile--white' : 'unit-tile--black'
  const withControls = !!(onAdd || onRemove)

  return (
    <div className='unit-tile-wrapper'>
      <div className={`unit-tile ${toneClass} unit-color--${unit.id}`}>
        <UnitTag unit={unit.id} color={unit.color} withEmoji={false} />

        {emoji && (
          <span className='unit-tile-emoji' aria-hidden='true'>
            {emoji}
          </span>
        )}

        {withControls && (
          <div className='unit-tile-controls'>
            <button
              type='button'
              className='unit-tile-ctrl unit-tile-ctrl--minus'
              onClick={onRemove}
              disabled={!onRemove}
              aria-label={`Remove ${unit.id}`}
              title={`Remove ${unit.id}`}
            >
              −
            </button>
            <span className='unit-tile-ctrl-count'>{count}</span>
            <button
              type='button'
              className='unit-tile-ctrl unit-tile-ctrl--plus'
              onClick={onAdd}
              disabled={!onAdd}
              aria-label={`Add ${unit.id}`}
              title={`Add ${unit.id}`}
            >
              +
            </button>
          </div>
        )}

        {score !== undefined && (
          <span className='unit-tile-score'>{score}</span>
        )}
      </div>
    </div>
  )
}
