import chalk from 'chalk'
import type { SymbolsMap as SymbolsDefinition, SymbolType } from './types.ts'
import {
  indices,
  is,
  isnt,
  isWhite,
  mapValues as mValues,
  mapOccurences as occurrences,
  resolveSymbol,
  sum,
} from './utils.ts'

export const SYMBOL_COLORS = {
  WHITE: 'WHITE' as const,
  BLACK: 'BLACK' as const,
}

export const SYMBOL_TYPES = {
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

export const SYMBOLS: SymbolsDefinition = {
  [SYMBOL_TYPES.HERO]: {
    type: SYMBOL_COLORS.WHITE,
    value: () => +3,
    color: chalk.magenta,
  },
  [SYMBOL_TYPES.CAPTAIN]: {
    type: SYMBOL_COLORS.WHITE,
    value: () => +2,
    color: chalk.white,
  },
  [SYMBOL_TYPES.SOLDIER]: {
    type: SYMBOL_COLORS.WHITE,
    value: () => +1,
    color: chalk.green,
  },
  [SYMBOL_TYPES.CURSED]: {
    type: SYMBOL_COLORS.WHITE,
    value: () => -1,
    color: chalk.yellow,
  },
  [SYMBOL_TYPES.MAGE]: {
    type: SYMBOL_COLORS.WHITE,
    value: symbols => symbols.filter(isWhite).filter(isnt(MAGE)).length,
    color: chalk.cyan,
  },
  [SYMBOL_TYPES.TRAITOR]: {
    type: SYMBOL_COLORS.WHITE,
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
  [SYMBOL_TYPES.WOLF]: {
    type: SYMBOL_COLORS.BLACK,
    value: symbols =>
      (symbols
        .filter(isWhite)
        .map((symbol, i) => resolveSymbol(symbol, i, symbols))
        .sort((a, b) => (a > b ? -1 : a < b ? 1 : 0))
        .pop() ?? 0) * 2,
    color: chalk.bgBlue,
  },
  [SYMBOL_TYPES.SNAKE]: {
    type: SYMBOL_COLORS.BLACK,
    value: (symbols, index) => (SYMBOLS.WOLF.value(symbols, index) / 2) * -1, // Reverse(ish) wolf
    color: chalk.bgGreen,
  },
  [SYMBOL_TYPES.HORSE]: {
    type: SYMBOL_COLORS.BLACK,
    value: symbols => symbols.filter(isWhite).length,
    color: chalk.bgGrey,
  },
  [SYMBOL_TYPES.DRAGON]: {
    type: SYMBOL_COLORS.BLACK,
    value: (symbols, index) => SYMBOLS.HORSE.value(symbols, index) * -1, // Reverse horse
    color: chalk.bgRed,
  },
  [SYMBOL_TYPES.BOAR]: {
    type: SYMBOL_COLORS.BLACK,
    value: symbols =>
      sum(mValues(occurrences(symbols.filter(isWhite))).filter(c => c >= 2)),
    color: chalk.bgYellow,
  },
  [SYMBOL_TYPES.EAGLE]: {
    type: SYMBOL_COLORS.BLACK,
    value: (symbols, index) => SYMBOLS.BOAR.value(symbols, index) * -1, // Reverse boar
    color: chalk.bgMagenta,
  },
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
} = SYMBOL_TYPES

export const CHALLENGES: SymbolType[][] = [
  [HERO, HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, SOLDIER],
  [HERO, HERO, CAPTAIN, CAPTAIN, CAPTAIN, CAPTAIN, TRAITOR],
  [HERO, HERO, HERO, CAPTAIN, CAPTAIN, CAPTAIN, CURSED],
  [HERO, HERO, HERO, HERO, SOLDIER, TRAITOR, CURSED],
  [SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, MAGE],
  [HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, SOLDIER, MAGE],
  [HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, CURSED, MAGE],
  [HERO, CAPTAIN, CAPTAIN, CAPTAIN, CURSED, CURSED, MAGE],
  [HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR, MAGE],
  [HERO, HERO, CAPTAIN, TRAITOR, TRAITOR, TRAITOR, MAGE],
  [HERO, HERO, CAPTAIN, CAPTAIN, TRAITOR, CURSED, MAGE],
  [HERO, HERO, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE],
  [SOLDIER, CURSED, CURSED, MAGE, MAGE, MAGE, MAGE],
  [HERO, CAPTAIN, CAPTAIN, CURSED, MAGE, MAGE, MAGE],
  [HERO, SOLDIER, TRAITOR, TRAITOR, MAGE, MAGE, MAGE],
  [HERO, HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, MAGE, WOLF],
  [HERO, CAPTAIN, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR, MAGE, WOLF],
  [HERO, SOLDIER, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE, WOLF],
  [HERO, SOLDIER, SOLDIER, CURSED, CURSED, CURSED, MAGE, SNAKE],
  [HERO, TRAITOR, TRAITOR, CURSED, MAGE, MAGE, MAGE, SNAKE],
  [HERO, HERO, CAPTAIN, TRAITOR, CURSED, MAGE, MAGE, SNAKE],
  [HERO, CAPTAIN, CAPTAIN, CAPTAIN, SOLDIER, SOLDIER, MAGE, HORSE],
  [HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR, MAGE, HORSE],
  [HERO, CAPTAIN, TRAITOR, CURSED, MAGE, MAGE, MAGE, HORSE],
  [SOLDIER, SOLDIER, SOLDIER, CURSED, CURSED, CURSED, MAGE, DRAGON],
  [HERO, HERO, HERO, HERO, TRAITOR, CURSED, MAGE, DRAGON],
  [HERO, HERO, CAPTAIN, SOLDIER, TRAITOR, MAGE, MAGE, DRAGON],
  [CAPTAIN, CAPTAIN, CAPTAIN, SOLDIER, CURSED, CURSED, MAGE, BOAR],
  [HERO, HERO, TRAITOR, CURSED, CURSED, MAGE, MAGE, BOAR],
  [HERO, TRAITOR, TRAITOR, CURSED, MAGE, MAGE, MAGE, BOAR],
  [HERO, HERO, CAPTAIN, SOLDIER, CURSED, CURSED, MAGE, EAGLE],
  [HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, TRAITOR, MAGE, EAGLE],
  [HERO, HERO, HERO, SOLDIER, TRAITOR, MAGE, MAGE, EAGLE],
  [HERO, HERO, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE, HORSE, BOAR],
  [SOLDIER, SOLDIER, CURSED, CURSED, CURSED, MAGE, MAGE, WOLF, DRAGON],
  [HERO, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE, MAGE, HORSE, EAGLE],
  [HERO, SOLDIER, SOLDIER, TRAITOR, TRAITOR, MAGE, MAGE, DRAGON, BOAR],
  [HERO, HERO, SOLDIER, TRAITOR, TRAITOR, TRAITOR, MAGE, SNAKE, EAGLE],
  [HERO, CAPTAIN, CAPTAIN, TRAITOR, MAGE, MAGE, MAGE, WOLF, HORSE],
  [HERO, SOLDIER, SOLDIER, SOLDIER, CURSED, CURSED, MAGE, SNAKE, DRAGON],
  [HERO, HERO, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE, WOLF, EAGLE],
  [HERO, HERO, HERO, TRAITOR, TRAITOR, CURSED, MAGE, DRAGON, BOAR],
  [HERO, HERO, TRAITOR, CURSED, CURSED, MAGE, MAGE, WOLF, BOAR],
  [SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, CAPTAIN, MAGE, WOLF, SNAKE],
  [CAPTAIN, SOLDIER, SOLDIER, SOLDIER, MAGE, MAGE, MAGE, HORSE, EAGLE],
  [HERO, HERO, CAPTAIN, SOLDIER, TRAITOR, CURSED, MAGE, WOLF, WOLF],
  [HERO, SOLDIER, SOLDIER, TRAITOR, TRAITOR, TRAITOR, MAGE, SNAKE, BOAR],
  [HERO, HERO, TRAITOR, TRAITOR, TRAITOR, CURSED, MAGE, WOLF, EAGLE],
  [HERO, HERO, CAPTAIN, CAPTAIN, CAPTAIN, TRAITOR, MAGE, WOLF, SNAKE],
  [HERO, HERO, CAPTAIN, TRAITOR, MAGE, MAGE, MAGE, SNAKE, HORSE],
]
