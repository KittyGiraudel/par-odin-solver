import assert from 'node:assert'
import test from 'node:test'
import {
  CAPTAIN,
  CURSED,
  DRAGON,
  HERO,
  HORSE,
  MAGE,
  SNAKE,
  SOLDIER,
  TRAITOR,
  WOLF,
} from './constants.js'
import { resolveSymbols, solve } from './utils.js'

test('Should throw for unsolvable challenges', () => {
  assert.throws(() =>
    solve([SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER])
  )
})

test('Should handle the basic rules', () => {
  assert.deepEqual(
    solve([HERO, HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, SOLDIER]),
    [
      [HERO, HERO, SOLDIER],
      [HERO, CAPTAIN, SOLDIER, SOLDIER],
    ]
  )
})

test('Should handle the Traitor', () => {
  assert.deepEqual(
    solve([CAPTAIN, CAPTAIN, SOLDIER, SOLDIER, HERO, HERO, TRAITOR]),
    [
      [CAPTAIN, CAPTAIN, SOLDIER],
      [HERO, HERO, SOLDIER, TRAITOR],
    ]
  )
})

test('Should handle the Cursed', () => {
  assert.deepEqual(
    solve([CAPTAIN, CAPTAIN, CAPTAIN, HERO, HERO, HERO, CURSED]),
    [
      [HERO, CAPTAIN, CAPTAIN],
      [HERO, HERO, CAPTAIN, CURSED],
    ]
  )
})

test('Should handle the Traitor *and* the Cursed', () => {
  assert.deepEqual(solve([HERO, HERO, HERO, HERO, SOLDIER, TRAITOR, CURSED]), [
    [HERO, HERO, SOLDIER, TRAITOR],
    [HERO, HERO, CURSED],
  ])
})

test('Should handle the Wolf', () => {
  const solution = solve([
    HERO,
    HERO,
    HERO,
    CAPTAIN,
    SOLDIER,
    SOLDIER,
    MAGE,
    WOLF,
  ])
  // Verify the solution is valid (both armies have equal sums)
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
  // Multiple valid solutions exist - just verify it's a valid split
  assert.strictEqual(
    solution[0].length + solution[1].length,
    8,
    'Solution should contain all symbols'
  )
})

test('Should not penalize Traitors without Heroes', () => {
  assert.deepEqual(resolveSymbols([TRAITOR, TRAITOR]), [1, 1])
})

test('Should penalize only as many Traitors as there are Heroes', () => {
  assert.deepEqual(
    resolveSymbols([HERO, HERO, TRAITOR, TRAITOR, TRAITOR]),
    [3, 3, -2, -2, 1]
  )
})

test('Should penalize Traitors when there are more Heroes than Traitors', () => {
  assert.deepEqual(resolveSymbols([HERO, HERO, HERO, TRAITOR]), [3, 3, 3, -2])
})

// Challenge #1 (already covered by "Should handle the basic rules")
// Challenge #2 (already covered by "Should handle the Traitor")
// Challenge #3 (already covered by "Should handle the Cursed")
// Challenge #4 (already covered by "Should handle the Traitor *and* the Cursed")

test('Challenge #5', () => {
  assert.deepEqual(
    solve([SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, SOLDIER, MAGE]),
    [
      [SOLDIER, SOLDIER, SOLDIER, SOLDIER],
      [SOLDIER, SOLDIER, MAGE],
    ]
  )
})

test('Challenge #6', () => {
  assert.deepEqual(
    solve([HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, SOLDIER, MAGE]),
    [
      [HERO, HERO, SOLDIER],
      [CAPTAIN, SOLDIER, SOLDIER, MAGE],
    ]
  )
})

test('Challenge #7', () => {
  assert.deepEqual(
    solve([HERO, HERO, CAPTAIN, SOLDIER, SOLDIER, CURSED, MAGE]),
    [
      [HERO, CAPTAIN, SOLDIER],
      [HERO, SOLDIER, CURSED, MAGE],
    ]
  )
})

test('Challenge #8', () => {
  assert.deepEqual(
    solve([HERO, CAPTAIN, CAPTAIN, CAPTAIN, CURSED, CURSED, MAGE]),
    [
      [CAPTAIN, CAPTAIN, CAPTAIN, CURSED, CURSED],
      [HERO, MAGE],
    ]
  )
})

test('Challenge #9', () => {
  assert.deepEqual(
    solve([HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR, MAGE]),
    [
      [HERO, CAPTAIN, SOLDIER],
      [HERO, CAPTAIN, MAGE, TRAITOR],
    ]
  )
})

test('Challenge #10', () => {
  assert.deepEqual(
    solve([HERO, HERO, CAPTAIN, TRAITOR, TRAITOR, TRAITOR, MAGE]),
    [
      [HERO, HERO, TRAITOR, TRAITOR, TRAITOR],
      [CAPTAIN, MAGE],
    ]
  )
})

test('Challenge #11', () => {
  assert.deepEqual(
    solve([HERO, HERO, CAPTAIN, CAPTAIN, TRAITOR, CURSED, MAGE]),
    [
      [HERO, CAPTAIN, CAPTAIN, CURSED, TRAITOR],
      [HERO, MAGE],
    ]
  )
})

test('Challenge #12', () => {
  assert.deepEqual(solve([HERO, HERO, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE]), [
    [HERO, SOLDIER, SOLDIER],
    [HERO, MAGE, MAGE, TRAITOR],
  ])
})

test('Challenge #13', () => {
  assert.deepEqual(solve([SOLDIER, CURSED, CURSED, MAGE, MAGE, MAGE, MAGE]), [
    [SOLDIER, CURSED, MAGE],
    [CURSED, MAGE, MAGE, MAGE],
  ])
})

test('Challenge #14', () => {
  assert.deepEqual(solve([HERO, CAPTAIN, CAPTAIN, CURSED, MAGE, MAGE, MAGE]), [
    [CAPTAIN, CAPTAIN, MAGE],
    [HERO, CURSED, MAGE, MAGE],
  ])
})

test('Challenge #15', () => {
  assert.deepEqual(solve([HERO, SOLDIER, TRAITOR, TRAITOR, MAGE, MAGE, MAGE]), [
    [HERO, SOLDIER, MAGE],
    [MAGE, MAGE, TRAITOR, TRAITOR],
  ])
})

// Challenge #16 (already covered by "Should handle the Wolf")

test('Challenge #17', () => {
  assert.deepEqual(
    solve([HERO, CAPTAIN, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR, MAGE, WOLF]),
    [
      [CAPTAIN, CAPTAIN, CAPTAIN, SOLDIER],
      [HERO, MAGE, TRAITOR, WOLF],
    ]
  )
})

test('Challenge #18', () => {
  assert.deepEqual(
    solve([HERO, SOLDIER, SOLDIER, SOLDIER, TRAITOR, MAGE, MAGE, WOLF]),
    [
      [HERO, MAGE, MAGE, TRAITOR],
      [SOLDIER, SOLDIER, SOLDIER, WOLF],
    ]
  )
})

test('Challenge #19', () => {
  const solution = solve([
    HERO,
    SOLDIER,
    SOLDIER,
    CURSED,
    CURSED,
    CURSED,
    MAGE,
    SNAKE,
  ])
  // Verify the solution is valid (both armies have equal sums)
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
  // Multiple valid solutions exist - just verify it's a valid split
  assert.strictEqual(
    solution[0].length + solution[1].length,
    8,
    'Solution should contain all symbols'
  )
})

test('Challenge #20', () => {
  assert.deepEqual(
    solve([HERO, TRAITOR, TRAITOR, CURSED, MAGE, MAGE, MAGE, SNAKE]),
    [
      [HERO, MAGE, TRAITOR],
      [CURSED, MAGE, MAGE, TRAITOR, SNAKE],
    ]
  )
})

test('Challenge #21', () => {
  assert.deepEqual(
    solve([HERO, HERO, CAPTAIN, TRAITOR, CURSED, MAGE, MAGE, SNAKE]),
    [
      [HERO, HERO, CURSED, TRAITOR],
      [CAPTAIN, MAGE, MAGE, SNAKE],
    ]
  )
})

test('Challenge #22', () => {
  assert.deepEqual(
    solve([HERO, CAPTAIN, CAPTAIN, CAPTAIN, SOLDIER, SOLDIER, MAGE, HORSE]),
    [
      [HERO, CAPTAIN, CAPTAIN, SOLDIER],
      [CAPTAIN, SOLDIER, MAGE, HORSE],
    ]
  )
})

test('Challenge #23', () => {
  assert.deepEqual(
    solve([HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR, MAGE, HORSE]),
    [
      [HERO, CAPTAIN, CAPTAIN, SOLDIER, TRAITOR],
      [HERO, MAGE, HORSE],
    ]
  )
})

test('Challenge #24', () => {
  assert.deepEqual(
    solve([HERO, CAPTAIN, TRAITOR, CURSED, MAGE, MAGE, MAGE, HORSE]),
    [
      [CAPTAIN, MAGE, MAGE, TRAITOR],
      [HERO, CURSED, MAGE, HORSE],
    ]
  )
})

test('Challenge #25', () => {
  assert.deepEqual(
    solve([SOLDIER, SOLDIER, SOLDIER, CURSED, CURSED, CURSED, MAGE, DRAGON]),
    [
      [CURSED, CURSED, CURSED, MAGE],
      [SOLDIER, SOLDIER, SOLDIER, DRAGON],
    ]
  )
})

test('Challenge #26', () => {
  assert.deepEqual(
    solve([HERO, HERO, HERO, HERO, TRAITOR, CURSED, MAGE, DRAGON]),
    [
      [HERO, HERO, TRAITOR],
      [HERO, HERO, CURSED, MAGE, DRAGON],
    ]
  )
})

test('Challenge #27', () => {
  assert.deepEqual(
    solve([HERO, HERO, CAPTAIN, SOLDIER, TRAITOR, MAGE, MAGE, DRAGON]),
    [
      [HERO, SOLDIER],
      [HERO, CAPTAIN, MAGE, MAGE, TRAITOR, DRAGON],
    ]
  )
})
