import type React from 'react'
import type { UnitType } from '../../../solver/types.js'
import { UnitTag } from '../UnitTag'
import './styles.css'
import { UNITS } from '../../../solver/constants.js'
import { getRandomId } from '../../helpers/getRandomId.js'

export interface SolutionColumnProps {
  title: string
  units: UnitType[]
  total: number
}

export const SolutionColumn: React.FC<SolutionColumnProps> = ({
  title,
  units,
  total,
}) => {
  return (
    <div className='po-solution-column'>
      <div className='po-solution-header'>
        <h4 className='po-solution-title'>{title}</h4>
        <span className='po-solution-total'>Total: {total}</span>
      </div>

      {units.length === 0 ? (
        <p className='po-solution-empty'>Empty army.</p>
      ) : (
        <ul className='po-solution-list'>
          {units.map(unit => (
            <li key={`${unit}-${getRandomId()}`} className='po-solution-item'>
              <UnitTag unit={unit} color={UNITS[unit].type} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
