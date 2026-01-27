import chalk from 'chalk'
import { isPositive, isWhite, resolveSymbol, sortDesc, is, isnt } from './utils.mjs'

export const HERO = 'HERO'
export const CAPTAIN = 'CAPTAIN'
export const SOLDIER = 'SOLDIER'
export const CURSED = 'CURSED'
export const TRAITOR = 'TRAITOR'
export const MAGE = 'MAGE'
export const WOLF = 'WOLF'
export const SNAKE = 'SNAKE'
export const HORSE = 'HORSE'
export const DRAGON = 'DRAGON'

export const SYMBOLS = {
  [HERO]: {
    type: 'WHITE',
    value: () => +3,
    color: chalk.magenta,
  },
  [CAPTAIN]: {
    type: 'WHITE',
    value: () => +2,
    color: chalk.white,
  },
  [SOLDIER]: {
    type: 'WHITE',
    value: () => +1,
    color: chalk.green,
  },
  [CURSED]: {
    type: 'WHITE',
    value: () => -1,
    color: chalk.yellow,
  },
  [MAGE]: {
    type: 'WHITE',
    value: symbols => symbols.filter(isWhite).filter(isnt('MAGE')).length,
    color: chalk.cyan,
  },
  [TRAITOR]: {
    type: 'WHITE',
    value: (symbols, index) => {
      const heroes = symbols.filter(is(HERO))
      const traitorPos = symbols
        .map((symbol, pos) => (is(symbol)(TRAITOR) ? pos : null))
        .filter(position => position !== null)
      const isPaired =
        traitorPos.indexOf(index) > -1 &&
        traitorPos.indexOf(index) < Math.min(heroes.length, traitorPos.length)

      return +1 + (isPaired ? -3 : 0)
    },
    color: chalk.red,
  },
  [WOLF]: {
    type: 'BLACK',
    value: symbols =>
      symbols
        .filter(isWhite)
        .map(resolveSymbol)
        .filter(isPositive)
        .sort(sortDesc)
        .pop() * 2,
    color: chalk.bgBlue,
  },
  [SNAKE]: {
    type: 'BLACK',
    value: symbols =>
      symbols
        .filter(isWhite)
        .map(resolveSymbol)
        .filter(isPositive)
        .sort(sortDesc)
        .pop() * -1,
    color: chalk.bgGreen,
  },
  [HORSE]: {
    type: 'BLACK',
    value: symbols => symbols.filter(isWhite).length,
    color: chalk.bgGrey,
  },
  [DRAGON]: {
    type: 'BLACK',
    value: symbols => symbols.filter(isWhite).length * -1,
    color: chalk.bgRed,
  },
}
