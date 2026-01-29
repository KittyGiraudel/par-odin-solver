import type React from 'react'
import type { UnitType } from '../../../solver/types.js'
import { SolutionColumn } from '../SolutionColumn'
import { UnitTag } from '../UnitTag'
import './styles.css'
import { SINGLETON_UNITS } from '../App/index.js'
import { Section } from '../Section/index.js'

export interface SolvedUnit {
  unit: UnitType
  score: number
}

export interface SolveState {
  armyA: SolvedUnit[]
  armyB: SolvedUnit[]
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
          unit =>
            solution.armyA.some(entry => entry.unit === unit) ||
            solution.armyB.some(entry => entry.unit === unit)
        )

  return (
    <Section
      aria-label='Solution'
      title='Solution'
      subtitle={
        !error && !solution
          ? 'Solve a draft to see how it can be split into two balanced armies.'
          : undefined
      }
    >
      {error ? (
        <div className='SolutionPanel__error'>
          <div className='SolutionPanel__error-icon' aria-hidden='true'>
            ⚠️
          </div>
          <div className='SolutionPanel__error-body'>
            <p className='SolutionPanel__error-title'>
              No balanced split for this draft.
            </p>
            <p className='SolutionPanel__error-text'>
              There appears to be no solution for the given draft. Try tweaking
              the units or loading a different challenge.
            </p>
          </div>
        </div>
      ) : !solution ? null : (
        <>
          <div className='SolutionPanel__grid'>
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
            <div className='SolutionPanel__shared'>
              <span className='SolutionPanel__shared-label'>
                Shared neutrals
              </span>
              <div className='SolutionPanel__shared-tags'>
                {sharedNeutrals.map(unit => (
                  <UnitTag key={unit} unit={unit} color='BLACK' />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  )
}
