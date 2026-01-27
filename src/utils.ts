import { SYMBOLS } from './constants.js'
import type { SymbolType } from './types.js'

// This is the main solving function. It is built on top of the `permute`
// function which was shamefully taken from StackOverflow because I am not smart
// enough to write such code. It makes use of a generator to iteratively yield
// permutations of the given symbols (instead of computing them all to begin
// with, which is slow and inefficient).
// See: https://stackoverflow.com/a/37580979
export function solve(
  symbols: readonly SymbolType[]
): [SymbolType[], SymbolType[]] {
  for (const permutation of permute([...symbols])) {
    for (let i = 0; i < permutation.length - 1; i++) {
      const A = permutation.slice(0, i).sort(sortSymbols)
      const B = permutation.slice(i).sort(sortSymbols)

      if (sum(resolveSymbols(A)) === sum(resolveSymbols(B))) return [A, B]
    }
  }

  throw new Error(`Could not solve: ${display(symbols, false, false)}`)
}

export function display(
  symbols: readonly SymbolType[],
  withValues = false,
  sortValues = true
): string {
  const sortedSymbols = sortValues ? [...symbols].sort(sortSymbols) : symbols
  return sortedSymbols
    .map((symbol, index) => {
      const { color, value } = SYMBOLS[symbol]
      return withValues !== false
        ? `${color(symbol)} (${value(symbols, index)})`
        : color(symbol)
    })
    .join(withValues !== false ? ' + ' : ', ')
}

export const sortSymbols = (A: SymbolType, B: SymbolType): number =>
  Object.keys(SYMBOLS).indexOf(A) - Object.keys(SYMBOLS).indexOf(B)

export const resolveSymbol = (
  symbol: SymbolType,
  index: number,
  symbols: readonly SymbolType[]
): number => SYMBOLS[symbol].value(symbols, index)

export const resolveSymbols = (symbols: readonly SymbolType[]): number[] =>
  symbols.map((symbol, index) => resolveSymbol(symbol, index, symbols))

export const sum = (array: number[]): number => array.reduce((a, b) => a + b, 0)

export const isWhite = (symbol: SymbolType): boolean =>
  SYMBOLS[symbol].type === 'WHITE'

export const isPositive = (value: number): boolean => value > 0

export const sortDesc = (a: number, b: number): number =>
  a > b ? -1 : a < b ? 1 : 0

export const is =
  (value: SymbolType) =>
  (symbol: SymbolType): boolean =>
    symbol === value

export const isnt =
  (value: SymbolType) =>
  (symbol: SymbolType): boolean =>
    symbol !== value

function* permute(permutation: SymbolType[]): Generator<SymbolType[]> {
  const length = permutation.length
  const c = Array(length).fill(0)
  let i = 1
  let k: number
  let p: SymbolType

  yield [...permutation]
  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i] ? c[i] : 0
      p = permutation[i]
      permutation[i] = permutation[k]
      permutation[k] = p
      ++c[i]
      i = 1
      yield [...permutation]
    } else {
      c[i] = 0
      ++i
    }
  }
}
