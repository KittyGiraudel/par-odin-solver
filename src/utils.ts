import { SYMBOL_COLORS, SYMBOL_TYPES, SYMBOLS } from './constants.js'
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
  const { BOAR, EAGLE } = SYMBOL_TYPES
  const symbolsWithoutNeutrals = symbols.filter(
    symbol => symbol !== BOAR && symbol !== EAGLE
  )

  for (const permutation of permute(symbolsWithoutNeutrals)) {
    for (let i = 0; i < permutation.length - 1; i++) {
      const A = permutation.slice(0, i)
      const B = permutation.slice(i)

      if (symbols.includes(BOAR)) A.push(BOAR), B.push(BOAR)
      if (symbols.includes(EAGLE)) A.push(EAGLE), B.push(EAGLE)

      const valuesA = resolveSymbols(A)
      const valuesB = resolveSymbols(B)

      if (sum(valuesA) === sum(valuesB))
        return [A.sort(sortSymbols), B.sort(sortSymbols)]
    }
  }

  throw new Error(`Could not solve: ${display(symbols, false)}`)
}

export function display(
  symbols: readonly SymbolType[],
  withValues = false
): string {
  return symbols
    .map((symbol, index) =>
      withValues
        ? `${SYMBOLS[symbol].color(symbol)} (${SYMBOLS[symbol].value(symbols, index)})`
        : SYMBOLS[symbol].color(symbol)
    )
    .join(withValues ? ' + ' : ', ')
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
  SYMBOLS[symbol].type === SYMBOL_COLORS.WHITE

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

export const mapOccurences = (symbols: readonly SymbolType[]) =>
  symbols.reduce(
    (acc, symbol) => acc.set(symbol, (acc.get(symbol) || 0) + 1),
    new Map<string, number>()
  )

export const mapValues = <K, V>(map: Map<K, V>): V[] => Array.from(map.values())

export const indices = (symbols: readonly SymbolType[], type: SymbolType) =>
  symbols
    .map((symbol, pos) => (is(symbol)(type) ? pos : null))
    .filter((position): position is number => position !== null)
