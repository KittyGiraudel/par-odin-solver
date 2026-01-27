import type { ChalkInstance } from 'chalk'
import { SYMBOL_TYPES } from './constants.ts'

export type SymbolType = (typeof SYMBOL_TYPES)[number]

export type SymbolColor = 'WHITE' | 'BLACK'

export type SymbolValueFunction = (symbols: readonly SymbolType[], index: number) => number

export interface SymbolDefinition {
  type: SymbolColor
  value: SymbolValueFunction
  color: ChalkInstance
}

export type SymbolsMap = {
  [K in SymbolType]: SymbolDefinition
}
