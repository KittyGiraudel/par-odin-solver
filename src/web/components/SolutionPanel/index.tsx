import type React from 'react'
import type { UnitType } from '../../../solver/types.js'
import { SolutionColumn } from '../SolutionColumn'
import { UnitTag } from '../UnitTag'
import './styles.css'
import { SINGLETON_UNITS } from '../App/index.js'

export interface SolveState {
  armyA: UnitType[]
  armyB: UnitType[]
  scoreA: number
  scoreB: number
}

export interface SolutionPanelProps {
  solution: SolveState | null
  error: string | null
}

export const SolutionPanel: React.FC<SolutionPanelProps> = ({
  solution,
  error,
}) => {
  const sharedNeutrals: UnitType[] =
    solution === null
      ? []
      : SINGLETON_UNITS.filter(
          unit => solution.armyA.includes(unit) || solution.armyB.includes(unit)
        )

  return (
    <div className='po-solution-panel'>
      <h3 className='po-solution-panel-title'>Solution</h3>

      {error ? (
        <div className='po-solution-panel-error'>
          <div className='po-solution-panel-error-icon' aria-hidden='true'>
            ⚠️
          </div>
          <div className='po-solution-panel-error-body'>
            <p className='po-solution-panel-error-title'>
              No balanced split for this draft.
            </p>
            <p className='po-solution-panel-error-text'>
              There appears to be no solution for the given draft. Try tweaking
              the units or loading a different challenge.
            </p>
          </div>
        </div>
      ) : !solution ? (
        <p className='po-solution-panel-empty'>
          Solve a draft to see how it can be split into two balanced armies.
        </p>
      ) : (
        <>
          <div className='po-solution-panel-grid'>
            <SolutionColumn
              title='Army A'
              units={solution.armyA}
              total={solution.scoreA}
            />
            <SolutionColumn
              title='Army B'
              units={solution.armyB}
              total={solution.scoreB}
            />
          </div>

          {sharedNeutrals.length > 0 && (
            <div className='po-solution-panel-shared'>
              <span className='po-solution-panel-shared-label'>
                Shared neutrals
              </span>
              <div className='po-solution-panel-shared-tags'>
                {sharedNeutrals.map(unit => (
                  <UnitTag key={unit} unit={unit} color='BLACK' />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
