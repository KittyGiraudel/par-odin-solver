import type React from 'react'
import type { UnitType } from '../../../solver/types.js'
import type { UnitMeta } from '../UnitsPanel'
import { UnitTag } from '../UnitTag'
import './styles.css'

export interface DraftPanelProps {
  draft: UnitType[]
  units: readonly UnitMeta[]
  onSolve: () => void
  canSolve: boolean
}

export const DraftPanel: React.FC<DraftPanelProps> = ({
  draft,
  units,
  onSolve,
  canSolve,
}) => {
  const resolveMeta = (unit: UnitType): UnitMeta | undefined =>
    units.find(candidate => candidate.id === unit)

  return (
    <div className='po-draft-panel'>
      <h3 className='po-draft-title'>Current draft</h3>
      {draft.length === 0 ? (
        <p className='po-draft-empty'>
          No units yet. Add some units or load a challenge.
        </p>
      ) : (
        <ol className='po-draft-list'>
          {draft.map(unit => {
            const meta = resolveMeta(unit)
            return (
              <li
                key={`${unit}-${Math.random().toString(36).slice(2, 8)}`}
                className='po-draft-item'
              >
                <UnitTag unit={unit} color={meta?.color ?? 'WHITE'} />
              </li>
            )
          })}
        </ol>
      )}

      <button
        type='button'
        onClick={onSolve}
        disabled={!canSolve}
        className={`po-draft-solve${
          canSolve ? ' po-draft-solve--enabled' : ' po-draft-solve--disabled'
        }`}
      >
        {canSolve ? 'Solve draft' : 'Add more units to solve'}
      </button>
    </div>
  )
}
