import chalk from 'chalk'
import type { SymbolsMap } from './types.ts'
import { isPositive, isWhite, resolveSymbol, sortDesc, is, isnt } from './utils.ts'

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
export const SYMBOL_TYPES = [HERO, CAPTAIN, SOLDIER, CURSED, TRAITOR, MAGE, WOLF, SNAKE, HORSE, DRAGON] as const

export const SYMBOLS: SymbolsMap = {
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
    value: (symbols) => symbols.filter(isWhite).filter(isnt('MAGE')).length,
    color: chalk.cyan,
  },
  [TRAITOR]: {
    type: 'WHITE',
    value: (symbols, index) => {
      const heroes = symbols.filter(is(HERO))
      const traitorPos = symbols
        .map((symbol, pos) => (is(symbol)(TRAITOR) ? pos : null))
        .filter((position): position is number => position !== null)
      const isPaired =
        traitorPos.indexOf(index) > -1 &&
        traitorPos.indexOf(index) < Math.min(heroes.length, traitorPos.length)

      return +1 + (isPaired ? -3 : 0)
    },
    color: chalk.red,
  },
  [WOLF]: {
    type: 'BLACK',
    value: (symbols) => {
      const values = symbols
        .filter(isWhite)
        .map((symbol, i) => resolveSymbol(symbol, i, symbols))
        .filter(isPositive)
        .sort(sortDesc)
      const max = values.pop()
      return max !== undefined ? max * 2 : 0
    },
    color: chalk.bgBlue,
  },
  [SNAKE]: {
    type: 'BLACK',
    value: (symbols) => {
      const values = symbols
        .filter(isWhite)
        .map((symbol, i) => resolveSymbol(symbol, i, symbols))
        .filter(isPositive)
        .sort(sortDesc)
      const max = values.pop()
      return max !== undefined ? max * -1 : 0
    },
    color: chalk.bgGreen,
  },
  [HORSE]: {
    type: 'BLACK',
    value: (symbols) => symbols.filter(isWhite).length,
    color: chalk.bgGrey,
  },
  [DRAGON]: {
    type: 'BLACK',
    value: (symbols) => symbols.filter(isWhite).length * -1,
    color: chalk.bgRed,
  },
}
