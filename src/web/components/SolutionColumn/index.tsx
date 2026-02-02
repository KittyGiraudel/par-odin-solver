import type React from 'react'
import type { CSSProperties } from 'react'
import { UNIT_METADATA } from '../App/index.js'
import type { SolvedUnit } from '../SolutionPanel'
import { UnitTile } from '../UnitTile'
import './styles.css'

export interface SolutionColumnProps {
  title: string
  units: SolvedUnit[]
  total: number
}

export const SolutionColumn: React.FC<SolutionColumnProps> = ({
  title,
  units,
  total,
}) => {
  return (
    <div className='SolutionColumn'>
      <div className='SolutionColumn__header'>
        <h3 className='SolutionColumn__title'>{title}</h3>
        <span className='SolutionColumn__total'>Total: {total}</span>
      </div>

      {units.length === 0 ? (
        <p className='SolutionColumn__empty'>Empty army.</p>
      ) : (
        <div
          className='UnitGrid SolutionColumn__list'
          style={
            {
              '--columns-xl': 2,
              '--columns-sm': 2,
            } as CSSProperties
          }
        >
          {units.map(entry => (
            <UnitTile
              key={entry.unit}
              unit={UNIT_METADATA.find(meta => meta.id === entry.unit)!}
              count={1}
              score={entry.score}
            />
          ))}
        </div>
      )}
    </div>
  )
}
