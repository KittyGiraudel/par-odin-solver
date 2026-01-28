import type React from 'react'
import type { CSSProperties } from 'react'
import type { UnitType } from '../../../solver/types.js'
import { Section } from '../Section/index.js'
import { UnitGrid } from '../UnitGrid/index.js'
import './styles.css'
import { CHALLENGES } from '../../../solver/constants.js'

export interface DraftPanelProps {
  draft: UnitType[]
  onSolve: () => void
  selectedChallengeIndex: number | ''
  onSelectChallenge: (value: string) => void
  onRandomDraft: () => void
  onReset: () => void
}

export const DraftPanel: React.FC<DraftPanelProps> = ({
  draft,
  onSolve,
  selectedChallengeIndex,
  onSelectChallenge,
  onRandomDraft,
  onReset,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectChallenge(event.target.value)
  }

  return (
    <Section
      aria-label='Draft'
      title='Current draft'
      subtitle={
        draft.length === 0 ? 'Add some units or load a challenge.' : undefined
      }
      style={
        {
          '--columns-xl': 4,
          '--columns-sm': 2,
        } as CSSProperties
      }
      actions={
        draft.length > 0 ? (
          <button type='button' onClick={onReset} className='draft-reset'>
            Reset draft
          </button>
        ) : (
          <button
            type='button'
            onClick={onRandomDraft}
            className='draft-random'
          >
            Random draft
          </button>
        )
      }
    >
      {draft.length === 0 ? (
        <div className='draft-controls'>
          <label htmlFor='draft-challenge' className='draft-label'>
            Start from:
          </label>
          <select
            id='draft-challenge'
            value={String(selectedChallengeIndex)}
            onChange={handleChange}
            className='draft-select'
          >
            <option value=''>Custom draft</option>
            {CHALLENGES.map((challenge, index) => (
              <option key={challenge.join('-') || index} value={index}>
                Challenge #{index + 1} ({challenge.length} units)
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {draft.length > 0 && <UnitGrid units={draft} />}

      <button
        type='button'
        onClick={onSolve}
        disabled={draft.length < 2}
        className='draft-solve'
      >
        {draft.length >= 2 ? 'Solve draft' : 'Add more units to solve'}
      </button>
    </Section>
  )
}
