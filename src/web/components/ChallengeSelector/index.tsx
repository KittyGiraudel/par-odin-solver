import { useCallback } from 'react'
import { CHALLENGES } from '../../../solver/constants'
import './styles.css'

export interface ChallengeSelectorProps {
  selectedChallengeIndex: number | ''
  onSelectChallenge: (value: string) => void
}

export const ChallengeSelector: React.FC<{
  selectedChallengeIndex: number | ''
  onSelectChallenge: (value: string) => void
}> = ({ selectedChallengeIndex, onSelectChallenge }) => {
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onSelectChallenge(event.target.value)
    },
    [onSelectChallenge]
  )

  return (
    <div className='ChallengeSelector'>
      <label htmlFor='challenge' className='ChallengeSelector__label'>
        Start from:
      </label>
      <select
        id='challenge'
        value={String(selectedChallengeIndex)}
        onChange={handleChange}
        className='ChallengeSelector__select'
      >
        <option value=''>Custom draft</option>
        {CHALLENGES.map((challenge, index) => (
          <option key={challenge.join('-') || index} value={index}>
            Challenge #{index + 1} ({challenge.length} units)
          </option>
        ))}
      </select>
    </div>
  )
}
