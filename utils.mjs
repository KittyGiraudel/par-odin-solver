import { SYMBOLS } from './constants.mjs'

// This is the main solving function. It is built on top of the `permute`
// function which was shamefully taken from StackOverflow because I am not smart
// enough to write such code. It makes use of a generator to iteratively yield
// permutations of the given symbols (instead of computing them all to begin
// with, which is slow and inefficient).
// See: https://stackoverflow.com/a/37580979
export function solve(symbols) {
  for (const permutation of permute(symbols)) {
    for (let i = 0; i < permutation.length - 1; i++) {
      const A = permutation.slice(0, i).sort(sortSymbols)
      const B = permutation.slice(i).sort(sortSymbols)

      if (sum(resolveSymbols(A)) === sum(resolveSymbols(B))) return [A, B]
    }
  }

  throw new Error('Could not solve: ' + display(symbols, false, false))
}

export function display(symbols, withValues = false, sortValues = true) {
  const sortedSymbols = sortValues ? symbols.slice(0).sort(sortSymbols) : symbols
  return sortedSymbols
    .map((symbol, index, symbols) => {
      const { color, value } = SYMBOLS[symbol]
      return withValues !== false
        ? color(symbol) + ' ' + `(${value(symbols, index)})`
        : color(symbol)
    })
    .join(withValues !== false ? ' + ' : ', ')
}

export const sortSymbols = (A, B) =>
  Object.keys(SYMBOLS).indexOf(A) - Object.keys(SYMBOLS).indexOf(B)

export const resolveSymbol = (symbol, index, symbols) =>
  SYMBOLS[symbol].value(symbols, index)
export const resolveSymbols = symbols =>
  symbols.map(resolveSymbol)
export const sum = array => array.reduce((a, b) => a + b, 0)
export const isWhite = symbol => SYMBOLS[symbol].type === 'WHITE'
export const isPositive = value => value > 0
export const sortDesc = (a, b) => a > b
export const is = value => symbol => symbol === value
export const isnt = value => symbol => symbol !== value

function* permute(permutation) {
  var length = permutation.length,
    c = Array(length).fill(0),
    i = 1,
    k,
    p

  yield permutation.slice()
  while (i < length) {
    if (c[i] < i) {
      k = i % 2 && c[i]
      p = permutation[i]
      permutation[i] = permutation[k]
      permutation[k] = p
      ++c[i]
      i = 1
      yield permutation.slice()
    } else {
      c[i] = 0
      ++i
    }
  }
}
