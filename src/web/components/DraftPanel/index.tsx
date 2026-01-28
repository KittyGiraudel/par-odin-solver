import type React from 'react'
import type { UnitType } from '../../../solver/types.js'
import type { UnitMeta } from '../App/index.js'
import './styles.css'
import type { CSSProperties } from 'react'
import { Section } from '../Section/index.js'
import { UnitGrid } from '../UnitGrid/index.js'

export interface DraftPanelProps {
  draft: UnitType[]
  units: readonly UnitMeta[]
  onSolve: () => void
  canSolve: boolean
}

export const DraftPanel: React.FC<DraftPanelProps> = ({
  draft,
  onSolve,
  canSolve,
}) => {
  return (
    <Section
      aria-label='Draft'
      title='Current draft'
      subtitle={
        draft.length === 0 ? 'Add some units or load a challenge.' : undefined
      }
    >
      {draft.length > 0 && (
        <div
          className='unit-grid'
          style={
            {
              '--columns-xl': 4,
              '--columns-sm': 2,
            } as CSSProperties
          }
        >
          <UnitGrid units={draft} />
        </div>
      )}

      <button
        type='button'
        onClick={onSolve}
        disabled={!canSolve}
        className={`draft-solve${
          canSolve ? ' draft-solve--enabled' : ' draft-solve--disabled'
        }`}
      >
        {canSolve ? 'Solve draft' : 'Add more units to solve'}
      </button>
    </Section>
  )
}
