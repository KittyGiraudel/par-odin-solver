import type React from 'react'
import type { UnitType } from '../../../solver/types.js'
import type { UnitColor } from '../../../solver/types.js'
import './styles.css'

export interface UnitTagProps {
  unit: UnitType
  color: UnitColor
}

const getUnitEmoji = (unit: UnitType): string => {
  switch (unit) {
    case 'HERO':
      return '🛡️'
    case 'CAPTAIN':
      return '⚔️'
    case 'SOLDIER':
      return '🗡️'
    case 'CURSED':
      return '📿'
    case 'TRAITOR':
      return '🔪'
    case 'MAGE':
      return '🪄'
    case 'WOLF':
      return '🐺'
    case 'SNAKE':
      return '🐍'
    case 'DRAGON':
      return '🐉'
    case 'HORSE':
      return '🐴'
    case 'BOAR':
      return '🐗'
    case 'EAGLE':
      return '🦅'
    default:
      return ''
  }
}

export const UnitTag: React.FC<UnitTagProps> = ({ unit, color }) => {
  const typeClass = color === 'WHITE' ? 'po-unit-tag--white' : 'po-unit-tag--black'
  const emoji = getUnitEmoji(unit)

  return (
    <span className={`po-unit-tag ${typeClass} po-unit-color--${unit}`}>
      {emoji && <span className='po-unit-tag-emoji'>{emoji}</span>}
      <span>{unit}</span>
    </span>
  )
}

