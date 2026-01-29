import type React from 'react'
import type { useA11yDialog } from 'react-a11y-dialog'
import { UNIT_TYPES } from '../../../solver/constants.js'
import type { UnitType } from '../../../solver/types.js'
import { Dialog } from '../Dialog/index.js'
import { getUnitEmoji } from '../UnitTag'
import './styles.css'

type A11yDialogAttrs = ReturnType<typeof useA11yDialog>[1]

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
    return 'White unit worth +3. Traitors can reduce its impact when paired with it.'
  if (unit === CAPTAIN) return 'White unit worth +2.'
  if (unit === SOLDIER) return 'White unit worth +1.'
  if (unit === CURSED) return 'White unit worth −1.'
  if (unit === TRAITOR)
    return 'White unit worth +1 on its own, but can heavily penalize a Hero when together.'
  if (unit === MAGE)
    return 'White unit whose value equals the number of non-mage white units in its army.'

  if (unit === WOLF)
    return 'Black unit worth double the highest positive white unit value in its army.'
  if (unit === SNAKE)
    return 'Black unit worth the negative of the highest positive white unit value in its army.'
  if (unit === HORSE)
    return 'Black unit whose value equals the number of white units in its army.'
  if (unit === DRAGON)
    return 'Black unit whose value is the negative of the number of white units in its army.'
  if (unit === BOAR)
    return 'Neutral unit that adds +1 for each duplicate white unit in an army (appears on both sides).'
  if (unit === EAGLE)
    return 'Neutral unit that adds −1 for each duplicate white unit in an army (appears on both sides).'

  return ''
}

const ALL_UNITS: UnitType[] = Object.keys(UNIT_TYPES) as UnitType[]

export const RulesDialog: React.FC<{ attrs: A11yDialogAttrs }> = ({
  attrs,
}) => {
  return (
    <Dialog attrs={attrs} title='How to play Par Odin!'>
      <section className='RulesDialog__section'>
        <h2 className='RulesDialog__heading'>Goal of the game</h2>
        <p className='RulesDialog__text'>
          In <span className='RulesDialog__em'>Par Odin!</span>, you&apos;re
          given a draft of units (white and black) and must split them into two
          armies whose total values are equal. Each unit has its own scoring
          rule, and some units interact with others in tricky ways.
        </p>
        <p className='RulesDialog__text'>
          White units have fixed or synergy-based values, black units react to
          the white side, and special neutral units can appear on both armies at
          once and tweak duplicate white units.
        </p>
      </section>

      <section className='RulesDialog__section'>
        <h2 className='RulesDialog__heading'>Unit overview</h2>
        <p className='RulesDialog__text'>
          Here is a quick description of each unit. The solver uses these rules
          when it builds the two balanced armies.
        </p>

        <div className='RulesDialog__unit-grid'>
          {ALL_UNITS.map(unit => {
            const emoji = getUnitEmoji(unit)
            const description = describeUnit(unit)

            return (
              <article key={unit} className='RulesDialog__unit-card'>
                <div className='RulesDialog__unit-header'>
                  <span className='RulesDialog__unit-emoji' aria-hidden='true'>
                    {emoji}
                  </span>
                  <h3 className='RulesDialog__unit-name'>{unit}</h3>
                </div>
                <p className='RulesDialog__unit-text'>{description}</p>
              </article>
            )
          })}
        </div>
      </section>
    </Dialog>
  )
}
