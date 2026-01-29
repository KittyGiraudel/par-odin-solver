import { type CSSProperties, useMemo } from 'react'
import type { UnitType } from '../../../solver/types'
import { countByUnit } from '../../helpers/countByUnit'
import { SINGLETON_UNITS, UNIT_METADATA } from '../App'
import { Section } from '../Section'
import { UnitTile } from '../UnitTile'
import './styles.css'
import { CHALLENGES } from '../../../solver/constants'

export interface UnitSelectorProps {
  onAddUnit: (unit: UnitType) => void
  onRemoveUnit: (unit: UnitType) => void
  draft: UnitType[]
  selectedChallengeIndex: number | ''
  onReset: () => void
  onRandomDraft: () => void
  onSolve: () => void
  onSelectChallenge: (value: string) => void
}

export const DraftPanel: React.FC<UnitSelectorProps> = ({
  onSolve,
  onAddUnit,
  onRemoveUnit,
  draft,
  onReset,
  onRandomDraft,
  selectedChallengeIndex,
  onSelectChallenge,
}) => {
  const countsByUnit = useMemo(() => countByUnit(draft), [draft])
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectChallenge(event.target.value)
  }
  return (
    <Section
      aria-label='Unit Selector'
      title='Choose your units'
      subtitle='Use the controls to compose a draft, then let the solver split it into two armies.'
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
