import type React from 'react'
import type { UnitType } from '../../../solver/types.js'
import './styles.css'

export interface HeaderProps {
  selectedChallengeIndex: number | ''
  challenges: readonly UnitType[][]
  onSelectChallenge: (value: string) => void
  onReset: () => void
  onRandomDraft: () => void
}

export const Header: React.FC<HeaderProps> = ({
  selectedChallengeIndex,
  challenges,
  onSelectChallenge,
  onReset,
  onRandomDraft,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectChallenge(event.target.value)
  }

  return (
    <header className='po-header'>
      <div className='po-header-text'>
        <h1 className='po-header-title'>Par Odin! Draft Solver</h1>
        <p className='po-header-subtitle'>
          Build a draft of units, then split it into two balanced armies.
        </p>
      </div>

      <div className='po-header-controls'>
        <label htmlFor='challenge-select' className='po-header-label'>
          Load challenge:
        </label>
        <select
          id='challenge-select'
          value={
            selectedChallengeIndex === '' ? '' : String(selectedChallengeIndex)
          }
          onChange={handleChange}
          className='po-header-select'
        >
          <option value=''>Custom draft</option>
          {challenges.map((challenge, index) => (
            <option key={challenge.join('-') || index} value={index}>
              Challenge #{index + 1} ({challenge.length} units)
            </option>
          ))}
        </select>
        <button
          type='button'
          onClick={onRandomDraft}
          className='po-header-random'
        >
          Random draft
        </button>
        <button type='button' onClick={onReset} className='po-header-reset'>
          Reset
        </button>
      </div>
    </header>
  )
}
