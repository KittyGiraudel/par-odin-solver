import chalk from 'chalk'
import type { UnitsMap, UnitType } from './types.js'
import {
  is,
  isnt,
  mapValues,
  occurrences,
  resolveUnitScore,
  sum,
} from './utils.js'

export const UNIT_COLORS = {
  WHITE: 'WHITE' as const,
  BLACK: 'BLACK' as const,
}

export const UNIT_TYPES = {
  HERO: 'HERO' as const,
  CAPTAIN: 'CAPTAIN' as const,
  SOLDIER: 'SOLDIER' as const,
  CURSED: 'CURSED' as const,
  TRAITOR: 'TRAITOR' as const,
  MAGE: 'MAGE' as const,
  WOLF: 'WOLF' as const,
  SNAKE: 'SNAKE' as const,
  HORSE: 'HORSE' as const,
  DRAGON: 'DRAGON' as const,
  BOAR: 'BOAR' as const,
  EAGLE: 'EAGLE' as const,
}

const {
  HERO,
  CAPTAIN,
  SOLDIER,
  TRAITOR,
  CURSED,
  MAGE,
  WOLF,
  SNAKE,
  DRAGON,
  HORSE,
  BOAR,
  EAGLE,
} = UNIT_TYPES
const { WHITE, BLACK } = UNIT_COLORS

export const UNITS: UnitsMap = {
  // The Hero has a static value of +3. It can be diminished by the Traitor, but that effect is
  // done in the Traitor’s value resolution.
  [HERO]: {
    type: WHITE,
    value: () => +3,
    color: chalk.magenta,
  },
  // The Captain has a static value of +2.
  [CAPTAIN]: {
    type: WHITE,
    value: () => +2,
    color: chalk.white,
  },
  // The Soldier has a static value of +1.
  [SOLDIER]: {
    type: WHITE,
    value: () => +1,
    color: chalk.green,
  },
  // The Cursed has a static value of -1.
  [CURSED]: {
    type: WHITE,
    value: () => -1,
    color: chalk.yellow,
  },
  // The Mage has a dynamic value equal to the amount of non-mage white units.
  [MAGE]: {
    type: WHITE,
    value: units =>
      units.filter(is('color', WHITE)).filter(isnt('type', MAGE)).length,
    color: chalk.cyan,
  },
  // The Traitor has a base value of +1, and can diminish a Hero’s value by -3. However, a given
  // Traitor can only affect 1 Hero, so the value resolution relies on indices to know which Hero
  // was diminished by which Traitor. For instance, 2 Traitor + 1 Hero should yield a -3 penalty,
  // and not a -6 penalty, since only 1 Traitor can affect the Hero.
  [TRAITOR]: {
    type: WHITE,
    value: (units, index) => {
      const heroes = units.filter(is('type', HERO))
      const traitors = units
        .map((unit, pos) => (is('type', unit)(TRAITOR) ? pos : null))
        .filter((position): position is number => position !== null)
      const isPaired =
        traitors.indexOf(index) > -1 &&
        traitors.indexOf(index) < Math.min(heroes.length, traitors.length)

      return +1 + (isPaired ? -3 : 0)
    },
    color: chalk.red,
  },
  // The Wolf has a dynamic value equal to the *double* of the highest positive white unit. Note
  // that the notion of positivity is unnecessary to handle since all white units can only yield
  // positive values, except for the Traitor, but that only happens when there is a Hero alongside
  // him, which means the highest white unit is always positive.
  [WOLF]: {
    type: BLACK,
    value: units =>
      (units
        .filter(is('color', WHITE))
        .map((unit, i) => resolveUnitScore(unit, i, units))
        .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))
        .pop() ?? 0) * 2,
    color: chalk.bgBlue,
  },
  // The Snake is some kind of reverse Wolf, with a dynamic value equal to the inverse of the
  // highest positive white unit. There again, the notion of positivity is unnecessary to handle.
  // The Snake’s value resolution uses the Wolf’s value resolution as a base for simplicity, but
  // it could just as well implements the resolution directly.
  [SNAKE]: {
    type: BLACK,
    value: (units, index) => (UNITS.WOLF.value(units, index) / 2) * -1,
    color: chalk.bgGreen,
  },
  // The Horse has a dynamic value equal to the amount of white units.
  [HORSE]: {
    type: BLACK,
    value: units => units.filter(is('color', WHITE)).length,
    color: chalk.bgGrey,
  },
  // The Dragon is like a reverse Horse, with a dynamic value equal to *negative* the amount of
  // white units.
  [DRAGON]: {
    type: BLACK,
    value: (units, index) => UNITS.HORSE.value(units, index) * -1,
    color: chalk.bgRed,
  },
  // The Boar increases the value of non-unique white units by +1, so it has a dynamic value that
  // varies based on the amount of duplicate white units. Note that while the Boar does not take
  // side per se because it impacts both armies, its value resolution works like any other unit’s —
  // the Boar is simply inserted in *both* armies.
  [BOAR]: {
    type: BLACK,
    value: units =>
      sum(
        mapValues(occurrences(units.filter(is('color', WHITE)))).filter(
          c => c >= 2
        )
      ),
    color: chalk.bgYellow,
  },
  // The Eagle is essentially the reverse Boar, decreasing the score by -1 for every non-unique
  // white unit. Same as the Boar, while the Eagle does not take side per se because it impacts both
  // armies, its value resolution works like any other unit’s — the Eagle is simply inserted in
  // *both* armies.
  [EAGLE]: {
    type: BLACK,
    value: (units, index) => UNITS.BOAR.value(units, index) * -1,
    color: chalk.bgMagenta,
  },
}

export const CHALLENGES: UnitType[][] = [
  [HERO, HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, SOLDIER], // 1
  [HERO, HERO, CAPTAIN, CAPTAIN, CAPTAIN, CAPTAIN, TRAITOR],
  [HERO, HERO, HERO, CAPTAIN, CAPTAIN, CAPTAIN, CURSED],
  [HERO, HERO, HERO, HERO, SOLDIER, TRAITOR, CURSED],
  [SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, MAGE], // 5
  [HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, SOLDIER, MAGE],
  [HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, CURSED, MAGE],
  [HERO, CAPTAIN, CAPTAIN, CAPTAIN, CURSED, CURSED, MAGE],
  [HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR, MAGE],
  [HERO, HERO, CAPTAIN, TRAITOR, TRAITOR, TRAITOR, MAGE], // 10
  [HERO, HERO, CAPTAIN, CAPTAIN, TRAITOR, CURSED, MAGE],
  [HERO, HERO, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE],
  [SOLDIER, CURSED, CURSED, MAGE, MAGE, MAGE, MAGE],
  [HERO, CAPTAIN, CAPTAIN, CURSED, MAGE, MAGE, MAGE],
  [HERO, SOLDIER, TRAITOR, TRAITOR, MAGE, MAGE, MAGE], // 15
  [HERO, HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, MAGE, WOLF],
  [HERO, CAPTAIN, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR, MAGE, WOLF],
  [HERO, SOLDIER, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE, WOLF],
  [HERO, SOLDIER, SOLDIER, CURSED, CURSED, CURSED, MAGE, SNAKE],
  [HERO, TRAITOR, TRAITOR, CURSED, MAGE, MAGE, MAGE, SNAKE], // 20
  [HERO, HERO, CAPTAIN, TRAITOR, CURSED, MAGE, MAGE, SNAKE],
  [HERO, CAPTAIN, CAPTAIN, CAPTAIN, SOLDIER, SOLDIER, MAGE, HORSE],
  [HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR, MAGE, HORSE],
  [HERO, CAPTAIN, TRAITOR, CURSED, MAGE, MAGE, MAGE, HORSE],
  [SOLDIER, SOLDIER, SOLDIER, CURSED, CURSED, CURSED, MAGE, DRAGON], // 25
  [HERO, HERO, HERO, HERO, TRAITOR, CURSED, MAGE, DRAGON],
  [HERO, HERO, CAPTAIN, SOLDIER, TRAITOR, MAGE, MAGE, DRAGON],
  [CAPTAIN, CAPTAIN, CAPTAIN, SOLDIER, CURSED, CURSED, MAGE, BOAR],
  [HERO, HERO, TRAITOR, CURSED, CURSED, MAGE, MAGE, BOAR],
  [HERO, TRAITOR, TRAITOR, CURSED, MAGE, MAGE, MAGE, BOAR], // 30
  [HERO, HERO, CAPTAIN, SOLDIER, CURSED, CURSED, MAGE, EAGLE],
  [HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, TRAITOR, MAGE, EAGLE],
  [HERO, HERO, HERO, SOLDIER, TRAITOR, MAGE, MAGE, EAGLE],
  [HERO, HERO, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE, HORSE, BOAR],
  [SOLDIER, SOLDIER, CURSED, CURSED, CURSED, MAGE, MAGE, WOLF, DRAGON], // 35
  [HERO, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE, MAGE, HORSE, EAGLE],
  [HERO, SOLDIER, SOLDIER, TRAITOR, TRAITOR, MAGE, MAGE, DRAGON, BOAR],
  [HERO, HERO, SOLDIER, TRAITOR, TRAITOR, TRAITOR, MAGE, SNAKE, EAGLE],
  [HERO, CAPTAIN, CAPTAIN, TRAITOR, MAGE, MAGE, MAGE, WOLF, HORSE],
  [HERO, SOLDIER, SOLDIER, SOLDIER, CURSED, CURSED, MAGE, SNAKE, DRAGON], // 40
  [HERO, HERO, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE, WOLF, EAGLE],
  [HERO, HERO, HERO, TRAITOR, TRAITOR, CURSED, MAGE, DRAGON, BOAR],
  [HERO, HERO, TRAITOR, CURSED, CURSED, MAGE, MAGE, WOLF, BOAR],
  [SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, CAPTAIN, MAGE, WOLF, SNAKE],
  [CAPTAIN, SOLDIER, SOLDIER, SOLDIER, MAGE, MAGE, MAGE, HORSE, EAGLE], // 45
  [HERO, HERO, CAPTAIN, SOLDIER, TRAITOR, CURSED, MAGE, WOLF, WOLF],
  [HERO, SOLDIER, SOLDIER, TRAITOR, TRAITOR, TRAITOR, MAGE, SNAKE, BOAR],
  [HERO, HERO, TRAITOR, TRAITOR, TRAITOR, CURSED, MAGE, WOLF, EAGLE],
  [HERO, HERO, CAPTAIN, CAPTAIN, CAPTAIN, TRAITOR, MAGE, WOLF, SNAKE],
  [HERO, HERO, CAPTAIN, TRAITOR, MAGE, MAGE, MAGE, SNAKE, HORSE], // 50
]
