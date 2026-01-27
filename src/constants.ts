import chalk from 'chalk'
import type { SymbolsMap } from './types.ts'
import {
  indices,
  is,
  isnt,
  isWhite,
  mapValues as mValues,
  mapOccurences as occurrences,
  resolveSymbol,
  sortDesc,
  sum,
} from './utils.ts'

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
export const BOAR = 'BOAR'
export const EAGLE = 'EAGLE'
export const SYMBOL_TYPES = [
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
] as const

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
    value: symbols => symbols.filter(isWhite).filter(isnt('MAGE')).length,
    color: chalk.cyan,
  },
  [TRAITOR]: {
    type: 'WHITE',
    value: (symbols, index) => {
      const heroes = symbols.filter(is(HERO))
      const traitors = indices(symbols, TRAITOR)
      const isPaired =
        traitors.indexOf(index) > -1 &&
        traitors.indexOf(index) < Math.min(heroes.length, traitors.length)

      return +1 + (isPaired ? -3 : 0)
    },
    color: chalk.red,
  },
  [WOLF]: {
    type: 'BLACK',
    value: symbols =>
      (symbols
        .filter(isWhite)
        .map((symbol, i) => resolveSymbol(symbol, i, symbols))
        .sort(sortDesc)
        .pop() ?? 0) * 2,
    color: chalk.bgBlue,
  },
  [SNAKE]: {
    type: 'BLACK',
    value: (symbols, index) => (SYMBOLS.WOLF.value(symbols, index) / 2) * -1, // Reverse(ish) wolf
    color: chalk.bgGreen,
  },
  [HORSE]: {
    type: 'BLACK',
    value: symbols => symbols.filter(isWhite).length,
    color: chalk.bgGrey,
  },
  [DRAGON]: {
    type: 'BLACK',
    value: (symbols, index) => SYMBOLS.HORSE.value(symbols, index) * -1, // Reverse horse
    color: chalk.bgRed,
  },
  [BOAR]: {
    type: 'BLACK',
    value: symbols =>
      sum(mValues(occurrences(symbols.filter(isWhite))).filter(c => c >= 2)),
    color: chalk.bgYellow,
  },
  [EAGLE]: {
    type: 'BLACK',
    value: (symbols, index) => SYMBOLS.BOAR.value(symbols, index) * -1, // Reverse boar
    color: chalk.bgMagenta,
  },
}
