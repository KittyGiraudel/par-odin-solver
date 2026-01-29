import type React from 'react'
import { useState } from 'react'
import { useA11yDialog } from 'react-a11y-dialog'
import { createPortal } from 'react-dom'
import { CHALLENGES, UNIT_TYPES, UNITS } from '../../../solver/constants.js'
import { Solver } from '../../../solver/Solver.js'
import type { UnitColor, UnitType } from '../../../solver/types.js'
import { DraftPanel } from '../DraftPanel/index.js'
import { Header } from '../Header'
import { RulesDialog } from '../RulesDialog'
import type { SolvedUnit, SolveState } from '../SolutionPanel'
import { SolutionPanel } from '../SolutionPanel'
import '../RulesDialog/styles.css'
import './styles.css'

export interface UnitMeta {
  id: UnitType
  color: 'WHITE' | 'BLACK'
  label: string
  description: string
}

const ALL_UNIT_TYPES: readonly UnitType[] = Object.keys(
  UNIT_TYPES
) as UnitType[]

const describeUnit = (unit: UnitType): string => {
  const {
    HERO,
    CAPTAIN,
    SOLDIER,
    CURSED,
    TRAITOR,
    MAGE,
    WOLF,
    SNAKE,
    HORSE,
    DRAGON,
    BOAR,
    EAGLE,
  } = UNIT_TYPES

  if (unit === HERO)
    return 'White unit (+3). May be diminished by Traitors when paired with them.'
  if (unit === CAPTAIN) return 'White unit (+2).'
  if (unit === SOLDIER) return 'White unit (+1).'
  if (unit === CURSED) return 'White unit (-1).'
  if (unit === TRAITOR)
    return 'White unit (+1, or -2 effectively when paired with a Hero it diminishes).'
  if (unit === MAGE)
    return 'White unit with value equal to the number of non-mage white units in its army.'

  if (unit === WOLF)
    return 'Black unit worth double the highest positive white unit value in its army.'
  if (unit === SNAKE)
    return 'Black unit worth the negative of the highest positive white unit value in its army.'
  if (unit === HORSE)
    return 'Black unit with value equal to the number of white units in its army.'
  if (unit === DRAGON)
    return 'Black unit with value equal to the negative of the number of white units in its army.'
  if (unit === BOAR)
    return 'Neutral black unit that adds +1 for each duplicate white unit in an army (appears on both sides).'
  if (unit === EAGLE)
    return 'Neutral black unit that adds -1 for each duplicate white unit in an army (appears on both sides).'

  throw new Error(`Unknown unit: ${unit}`)
}

export const UNIT_METADATA: readonly UnitMeta[] = ALL_UNIT_TYPES.map(unit => ({
  id: unit,
  color: UNITS[unit].type as UnitColor,
  label: unit,
  description: describeUnit(unit),
}))

const PRESET_CHALLENGES: readonly UnitType[][] = CHALLENGES
export const SINGLETON_UNITS: readonly UnitType[] = ['BOAR', 'EAGLE']

const sortDraft = (units: readonly UnitType[]): UnitType[] => {
  const order = ALL_UNIT_TYPES
  return [...units].sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

const solveDraft = (units: readonly UnitType[]): SolveState => {
  const solver = new Solver(units)
  const [armyAUnits, armyBUnits] = solver.solve()
  const scoresA = solver.resolveUnits(armyAUnits)
  const scoresB = solver.resolveUnits(armyBUnits)

  const armyA: SolvedUnit[] = armyAUnits.map((unit, index) => ({
    unit,
    score: scoresA[index] ?? 0,
  }))
  const armyB: SolvedUnit[] = armyBUnits.map((unit, index) => ({
    unit,
    score: scoresB[index] ?? 0,
  }))

  const scoreA = armyA.reduce((sum, entry) => sum + entry.score, 0)
  const scoreB = armyB.reduce((sum, entry) => sum + entry.score, 0)

  return { armyA, armyB, scoreA, scoreB }
}

export const App: React.FC = () => {
  const [draft, setDraft] = useState<UnitType[]>([])
  const [solution, setSolution] = useState<SolveState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedChallengeIndex, setSelectedChallengeIndex] = useState<
    number | ''
  >('')

  const [rulesDialogInstance, rulesDialogAttrs] = useA11yDialog({
    id: 'rules-dialog',
    role: 'dialog',
  })

  const handleAddUnit = (unit: UnitType) => {
    setDraft(prev => {
      if (SINGLETON_UNITS.includes(unit) && prev.includes(unit)) return prev
      return sortDraft([...prev, unit])
    })
    setSelectedChallengeIndex('')
    setSolution(null)
    setError(null)
  }

  const handleRemoveUnit = (unit: UnitType) => {
    setDraft(prev => {
      const reversed = [...prev].reverse()
      const indexFromEnd = reversed.findIndex(current => current === unit)
      if (indexFromEnd === -1) return prev
      const removeAt = prev.length - 1 - indexFromEnd
      return sortDraft([
        ...prev.slice(0, removeAt),
        ...prev.slice(removeAt + 1),
      ])
    })
    setSelectedChallengeIndex('')
    setSolution(null)
    setError(null)
  }

  const handleSelectChallenge = (value: string) => {
    if (value === '') {
      setSelectedChallengeIndex('')
      setDraft([])
      setSolution(null)
      setError(null)
      return
    }

    const index = Number.parseInt(value, 10)
    const challenge = PRESET_CHALLENGES[index]
    setSelectedChallengeIndex(index)
    setDraft(sortDraft(challenge))
    setSolution(null)
    setError(null)
  }

  const handleSolve = () => {
    try {
      const result = solveDraft(draft)
      setSolution(result)
      setError(null)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to solve this draft.'
      setError(message)
      setSolution(null)
    }
  }

  const handleReset = () => {
    setDraft([])
    setSolution(null)
    setError(null)
    setSelectedChallengeIndex('')
  }

  const handleRandomDraft = () => {
    const all = UNIT_METADATA.map(meta => meta.id)
    const length = Math.floor(Math.random() * 3) + 7 // 7–9 units

    const nextDraft: UnitType[] = []

    while (nextDraft.length < length) {
      const candidate = all[Math.floor(Math.random() * all.length)]
      if (
        SINGLETON_UNITS.includes(candidate) &&
        nextDraft.includes(candidate)
      ) {
        continue
      }
      nextDraft.push(candidate)
    }

    setDraft(sortDraft(nextDraft))
    setSolution(null)
    setError(null)
    setSelectedChallengeIndex('')
  }

  const rulesDialog = createPortal(
    <RulesDialog attrs={rulesDialogAttrs} />,
    document.body
  )

  return (
    <>
      <Header onOpenRules={() => rulesDialogInstance?.show()} />

      <main className='App'>
        <DraftPanel
          draft={draft}
          onSolve={handleSolve}
          onRandomDraft={handleRandomDraft}
          onReset={handleReset}
          onAddUnit={handleAddUnit}
          onRemoveUnit={handleRemoveUnit}
          selectedChallengeIndex={selectedChallengeIndex}
          onSelectChallenge={handleSelectChallenge}
        />

        <SolutionPanel solution={solution} error={error} />
      </main>

      {rulesDialog}
    </>
  )
}
