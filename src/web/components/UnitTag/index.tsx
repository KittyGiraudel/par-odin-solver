import type React from 'react'
import type { UnitColor, UnitType } from '../../../solver/types.js'
import './styles.css'
import type { ComponentProps } from 'react'

export interface UnitTagProps {
  unit: UnitType
  color: UnitColor
  withEmoji?: boolean
}

export const getUnitEmoji = (unit: UnitType): string => {
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

export const UnitTag: React.FC<UnitTagProps & ComponentProps<'span'>> = ({
  unit,
  color,
  withEmoji = true,
  ...props
}) => {
  const typeClass = color === 'WHITE' ? 'unit-tag--white' : 'unit-tag--black'
  const emoji = getUnitEmoji(unit)

  return (
    <span
      {...props}
      className={`${props.className ?? ''} unit-tag ${typeClass} unit-color--${unit}`}
    >
      {withEmoji && emoji && <span className='unit-tag-emoji'>{emoji}</span>}
      <span>{unit}</span>
    </span>
  )
}
