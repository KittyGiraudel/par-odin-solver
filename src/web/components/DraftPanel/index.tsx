import { type CSSProperties, useCallback, useMemo } from 'react'
import { CHALLENGES } from '../../../solver/constants'
import type { UnitType } from '../../../solver/types'
import { countByUnit } from '../../helpers/countByUnit'
import { SINGLETON_UNITS, UNIT_METADATA } from '../App'
import { Section } from '../Section'
import { UnitTile } from '../UnitTile'
import './styles.css'
import { ChallengeSelector } from '../ChallengeSelector'

export interface UnitSelectorProps {
  draft: UnitType[]
  onAddUnit: (unit: UnitType) => void
  onRandomDraft: () => void
  onRemoveUnit: (unit: UnitType) => void
  onReset: () => void
  onSelectChallenge: (value: string) => void
  onSolve: () => void
  selectedChallengeIndex: number | ''
}

export const DraftPanel: React.FC<UnitSelectorProps> = ({
  draft,
  onAddUnit,
  onRandomDraft,
  onRemoveUnit,
  onReset,
  onSelectChallenge,
  onSolve,
  selectedChallengeIndex,
}) => {
  const countsByUnit = useMemo(() => countByUnit(draft), [draft])
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) =>
      onSelectChallenge(event.target.value),
    [onSelectChallenge]
  )

  return (
    <Section
      aria-label='Choose your units'
      title='Choose your units'
      subtitle='Use the controls to compose a draft, then let the solver split it into two armies.'
      actions={
        draft.length > 0 ? (
          <button type='button' onClick={onReset} className='DraftPanel__reset'>
            Reset draft
          </button>
        ) : (
          <button
            type='button'
            onClick={onRandomDraft}
            className='DraftPanel__random'
          >
            Random draft
          </button>
        )
      }
    >
      {draft.length === 0 ? (
        <ChallengeSelector
          selectedChallengeIndex={selectedChallengeIndex}
          onSelectChallenge={onSelectChallenge}
        />
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
          const canAdd = !(SINGLETON_UNITS.includes(meta.id) && count >= 1)

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
        className='DraftPanel__solve'
      >
        {draft.length >= 2 ? 'Solve draft' : 'Add more units to solve'}
      </button>
    </Section>
  )
}
