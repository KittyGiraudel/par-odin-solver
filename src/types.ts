import type { ChalkInstance } from 'chalk'
import type { SYMBOL_COLORS, SYMBOL_TYPES } from './constants.ts'

export type SymbolType = keyof typeof SYMBOL_TYPES

export type SymbolColor = keyof typeof SYMBOL_COLORS

export type SymbolValueFunction = (
  symbols: readonly SymbolType[],
  index: number
) => number

export interface SymbolDefinition {
  type: SymbolColor
  value: SymbolValueFunction
  color: ChalkInstance
}

export type SymbolsMap = {
  [K in SymbolType]: SymbolDefinition
}
