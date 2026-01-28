import assert from 'node:assert'
import test from 'node:test'
import { SYMBOL_TYPES } from './constants.js'
import { resolveSymbol, resolveSymbols, solve } from './utils.js'

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

test('Should handle the Boar - value for duplicate white dice', () => {
  // Boar should add +1 for each duplicate white die
  // [HERO, HERO, SOLDIER, BOAR] -> 2 HERO (duplicates) = +2 total
  const army = [HERO, HERO, SOLDIER, BOAR] as const
  const boarValue = resolveSymbol(BOAR, 3, army)
  assert.strictEqual(boarValue, 2, 'Boar should add +2 for 2 duplicate HERO')
})

test('Should handle the Boar - no value for unique white dice', () => {
  // Boar should add 0 when all white dice are unique
  const army = [HERO, SOLDIER, CAPTAIN, BOAR] as const
  const boarValue = resolveSymbol(BOAR, 3, army)
  assert.strictEqual(boarValue, 0, 'Boar should add 0 when no duplicates')
})

test('Should handle the Boar - multiple duplicate types', () => {
  // Multiple duplicate types should all count
  // [HERO, HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, BOAR] -> 3 HERO + 2 CAPTAIN = +5 total
  const army = [HERO, HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, BOAR] as const
  const boarValue = resolveSymbol(BOAR, 6, army)
  assert.strictEqual(
    boarValue,
    5,
    'Boar should add +5 for 3 HERO and 2 CAPTAIN'
  )
})

test('Should handle the Boar - boar value in army context', () => {
  // Boar's value depends on the army it's in
  const army1 = [HERO, HERO, BOAR] as const
  const army2 = [SOLDIER, BOAR] as const
  const boarValue1 = resolveSymbol(BOAR, 2, army1)
  const boarValue2 = resolveSymbol(BOAR, 1, army2)
  assert.strictEqual(boarValue1, 2, 'Boar in army with 2 HERO should be +2')
  assert.strictEqual(boarValue2, 0, 'Boar in army with unique dice should be 0')
})

test('Challenge #28 (Boar)', () => {
  const solution = solve([
    CAPTAIN,
    CAPTAIN,
    CAPTAIN,
    SOLDIER,
    CURSED,
    CURSED,
    MAGE,
    BOAR,
  ])
  // Verify the solution is valid (both armies have equal sums with boar)
  // Boar should be in both armies
  assert.strictEqual(
    solution[0].length + solution[1].length,
    9,
    'Solution should contain all symbols including boar in both armies'
  )
  assert.ok(
    solution[0].includes(BOAR) && solution[1].includes(BOAR),
    'Boar should be in both armies'
  )
  // Verify the solution is valid (both armies have equal sums)
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #29 (Boar)', () => {
  const solution = solve([
    HERO,
    HERO,
    TRAITOR,
    CURSED,
    CURSED,
    MAGE,
    MAGE,
    BOAR,
  ])
  // Verify the solution is valid
  assert.strictEqual(
    solution[0].length + solution[1].length,
    9,
    'Solution should contain all symbols including boar in both armies'
  )
  assert.ok(
    solution[0].includes(BOAR) && solution[1].includes(BOAR),
    'Boar should be in both armies'
  )
  // Verify the solution is valid (both armies have equal sums)
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #30 (Boar)', () => {
  const solution = solve([
    HERO,
    TRAITOR,
    TRAITOR,
    CURSED,
    MAGE,
    MAGE,
    MAGE,
    BOAR,
  ])
  // Verify the solution is valid
  assert.strictEqual(
    solution[0].length + solution[1].length,
    9,
    'Solution should contain all symbols including boar in both armies'
  )
  assert.ok(
    solution[0].includes(BOAR) && solution[1].includes(BOAR),
    'Boar should be in both armies'
  )
  // Verify the solution is valid (both armies have equal sums)
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Should handle the Eagle - value for duplicate white dice', () => {
  // Eagle should subtract -1 for each duplicate white die
  // [HERO, HERO, SOLDIER, EAGLE] -> 2 HERO (duplicates) = -2 total
  const army = [HERO, HERO, SOLDIER, EAGLE] as const
  const eagleValue = resolveSymbol(EAGLE, 3, army)
  assert.strictEqual(
    eagleValue,
    -2,
    'Eagle should subtract -2 for 2 duplicate HERO'
  )
})

test('Should handle the Eagle - no value for unique white dice', () => {
  // Eagle should subtract 0 when all white dice are unique
  const army = [HERO, SOLDIER, CAPTAIN, EAGLE] as const
  const eagleValue = resolveSymbol(EAGLE, 3, army)
  assert.ok(
    eagleValue === 0 || eagleValue === 0,
    'Eagle should subtract 0 when no duplicates'
  )
})

test('Should handle the Eagle - multiple duplicate types', () => {
  // Multiple duplicate types should all count
  // [HERO, HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, EAGLE] -> 3 HERO + 2 CAPTAIN = -5 total
  const army = [HERO, HERO, HERO, CAPTAIN, CAPTAIN, SOLDIER, EAGLE] as const
  const eagleValue = resolveSymbol(EAGLE, 6, army)
  assert.strictEqual(
    eagleValue,
    -5,
    'Eagle should subtract -5 for 3 HERO and 2 CAPTAIN'
  )
})

test('Should handle the Eagle - eagle value in army context', () => {
  // Eagle's value depends on the army it's in
  const army1 = [HERO, HERO, EAGLE] as const
  const army2 = [SOLDIER, EAGLE] as const
  const eagleValue1 = resolveSymbol(EAGLE, 2, army1)
  const eagleValue2 = resolveSymbol(EAGLE, 1, army2)
  assert.strictEqual(eagleValue1, -2, 'Eagle in army with 2 HERO should be -2')
  assert.ok(
    eagleValue2 === 0 || eagleValue2 === 0,
    'Eagle in army with unique dice should be 0'
  )
})

test('Should handle the Eagle - opposite of boar', () => {
  // Eagle should be the negative of boar for the same army
  const army = [HERO, HERO, SOLDIER] as const
  const armyWithBoar = [...army, BOAR] as const
  const armyWithEagle = [...army, EAGLE] as const
  const boarValue = resolveSymbol(BOAR, 3, armyWithBoar)
  const eagleValue = resolveSymbol(EAGLE, 3, armyWithEagle)
  assert.strictEqual(
    eagleValue,
    -boarValue,
    'Eagle should be the negative of boar for the same duplicates'
  )
})

test('Challenge #31 (Eagle)', () => {
  const solution = solve([
    HERO,
    HERO,
    CAPTAIN,
    SOLDIER,
    CURSED,
    CURSED,
    MAGE,
    EAGLE,
  ])
  assert.strictEqual(
    solution[0].length + solution[1].length,
    9,
    'Solution should contain all symbols including eagle in both armies'
  )
  assert.ok(
    solution[0].includes(EAGLE) && solution[1].includes(EAGLE),
    'Eagle should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #32 (Eagle)', () => {
  const solution = solve([
    HERO,
    HERO,
    CAPTAIN,
    SOLDIER,
    SOLDIER,
    TRAITOR,
    MAGE,
    EAGLE,
  ])
  assert.strictEqual(
    solution[0].length + solution[1].length,
    9,
    'Solution should contain all symbols including eagle in both armies'
  )
  assert.ok(
    solution[0].includes(EAGLE) && solution[1].includes(EAGLE),
    'Eagle should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #33 (Eagle)', () => {
  const solution = solve([
    HERO,
    HERO,
    HERO,
    SOLDIER,
    TRAITOR,
    MAGE,
    MAGE,
    EAGLE,
  ])
  assert.strictEqual(
    solution[0].length + solution[1].length,
    9,
    'Solution should contain all symbols including eagle in both armies'
  )
  assert.ok(
    solution[0].includes(EAGLE) && solution[1].includes(EAGLE),
    'Eagle should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #34', () => {
  const solution = solve([
    HERO,
    HERO,
    SOLDIER,
    SOLDIER,
    TRAITOR,
    MAGE,
    MAGE,
    HORSE,
    BOAR,
  ])
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #35', () => {
  const solution = solve([
    SOLDIER,
    SOLDIER,
    CURSED,
    CURSED,
    CURSED,
    MAGE,
    MAGE,
    WOLF,
    DRAGON,
  ])
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #36', () => {
  const solution = solve([
    HERO,
    SOLDIER,
    SOLDIER,
    TRAITOR,
    MAGE,
    MAGE,
    MAGE,
    HORSE,
    EAGLE,
  ])
  assert.ok(
    solution[0].includes(EAGLE) && solution[1].includes(EAGLE),
    'Eagle should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #37', () => {
  const solution = solve([
    HERO,
    SOLDIER,
    SOLDIER,
    TRAITOR,
    TRAITOR,
    MAGE,
    MAGE,
    DRAGON,
    BOAR,
  ])
  assert.ok(
    solution[0].includes(BOAR) && solution[1].includes(BOAR),
    'Boar should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #38', () => {
  const solution = solve([
    HERO,
    HERO,
    SOLDIER,
    TRAITOR,
    TRAITOR,
    TRAITOR,
    MAGE,
    SNAKE,
    EAGLE,
  ])
  assert.ok(
    solution[0].includes(EAGLE) && solution[1].includes(EAGLE),
    'Eagle should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #39', () => {
  const solution = solve([
    HERO,
    CAPTAIN,
    CAPTAIN,
    TRAITOR,
    MAGE,
    MAGE,
    MAGE,
    WOLF,
    HORSE,
  ])
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #40', () => {
  const solution = solve([
    HERO,
    SOLDIER,
    SOLDIER,
    SOLDIER,
    CURSED,
    CURSED,
    MAGE,
    SNAKE,
    DRAGON,
  ])
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #41', () => {
  const solution = solve([
    HERO,
    HERO,
    SOLDIER,
    SOLDIER,
    TRAITOR,
    MAGE,
    MAGE,
    WOLF,
    EAGLE,
  ])
  assert.ok(
    solution[0].includes(EAGLE) && solution[1].includes(EAGLE),
    'Eagle should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #42', () => {
  const solution = solve([
    HERO,
    HERO,
    HERO,
    TRAITOR,
    TRAITOR,
    CURSED,
    MAGE,
    DRAGON,
    BOAR,
  ])
  assert.ok(
    solution[0].includes(BOAR) && solution[1].includes(BOAR),
    'Boar should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #43', () => {
  const solution = solve([
    HERO,
    HERO,
    TRAITOR,
    CURSED,
    CURSED,
    MAGE,
    MAGE,
    WOLF,
    BOAR,
  ])
  assert.ok(
    solution[0].includes(BOAR) && solution[1].includes(BOAR),
    'Boar should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #44', () => {
  const solution = solve([
    SOLDIER,
    SOLDIER,
    SOLDIER,
    SOLDIER,
    SOLDIER,
    CAPTAIN,
    MAGE,
    WOLF,
    SNAKE,
  ])
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #45', () => {
  const solution = solve([
    CAPTAIN,
    SOLDIER,
    SOLDIER,
    SOLDIER,
    MAGE,
    MAGE,
    MAGE,
    HORSE,
    EAGLE,
  ])
  assert.ok(
    solution[0].includes(EAGLE) && solution[1].includes(EAGLE),
    'Eagle should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #46', () => {
  const solution = solve([
    HERO,
    HERO,
    CAPTAIN,
    SOLDIER,
    TRAITOR,
    CURSED,
    MAGE,
    WOLF,
    WOLF,
  ])
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #47', () => {
  const solution = solve([
    HERO,
    SOLDIER,
    SOLDIER,
    TRAITOR,
    TRAITOR,
    TRAITOR,
    MAGE,
    SNAKE,
    BOAR,
  ])
  assert.ok(
    solution[0].includes(BOAR) && solution[1].includes(BOAR),
    'Boar should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #48', () => {
  const solution = solve([
    HERO,
    HERO,
    TRAITOR,
    TRAITOR,
    TRAITOR,
    CURSED,
    MAGE,
    WOLF,
    EAGLE,
  ])
  assert.ok(
    solution[0].includes(EAGLE) && solution[1].includes(EAGLE),
    'Eagle should be in both armies'
  )
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #49', () => {
  const solution = solve([
    HERO,
    HERO,
    CAPTAIN,
    CAPTAIN,
    CAPTAIN,
    TRAITOR,
    MAGE,
    WOLF,
    SNAKE,
  ])
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})

test('Challenge #50', () => {
  const solution = solve([
    HERO,
    HERO,
    CAPTAIN,
    TRAITOR,
    MAGE,
    MAGE,
    MAGE,
    SNAKE,
    HORSE,
  ])
  const sumA = resolveSymbols(solution[0]).reduce((a, b) => a + b, 0)
  const sumB = resolveSymbols(solution[1]).reduce((a, b) => a + b, 0)
  assert.strictEqual(sumA, sumB, 'Both armies should have equal sums')
})
