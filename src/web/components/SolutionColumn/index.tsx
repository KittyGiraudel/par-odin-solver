import type React from 'react'
import { UNIT_METADATA } from '../App/index.js'
import type { SolvedUnit } from '../SolutionPanel'
import { UnitTile } from '../UnitTile'
import './styles.css'
import type { CSSProperties } from 'react'

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
    <div className='solution-column'>
      <div className='solution-header'>
        <h3 className='solution-title'>{title}</h3>
        <span className='solution-total'>Total: {total}</span>
      </div>

      {units.length === 0 ? (
        <p className='solution-empty'>Empty army.</p>
      ) : (
        <div
          className='unit-grid solution-list'
          style={
            {
              '--columns-xl': 2,
              '--columns-sm': 1,
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
