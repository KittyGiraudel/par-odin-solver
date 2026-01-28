# Par Odin! Solver

A TypeScript solver for the _Par Odin!_ game, which challenges players to split a set of units into two armies with equal total values.

## What is Par Odin!?

Par Odin! is a puzzle game where you’re given a draft of units (characters and creatures) and must divide them into two balanced armies. Each unit has a specific value calculation:

- **White units** (positive values):
  - `HERO`: +3
  - `CAPTAIN`: +2
  - `SOLDIER`: +1
  - `CURSED`: -1
  - `MAGE`: Value equals the number of non-mage white units (excluding itself)
  - `TRAITOR`: +1, but -3 if paired with a HERO

- **Black units** (variable values):
  - `WOLF`: Double the highest positive white unit value
  - `SNAKE`: Negate the highest positive white unit value
  - `HORSE`: Value equals the number of white units
  - `DRAGON`: Negative value equal to the number of white units
  - `BOAR`: Increases duplicate white dice by +1 each (appears on both sides)
  - `EAGLE`: Decreases duplicate white dice by -1 each (appears on both sides)

**Note:** `BOAR` and `EAGLE` are special units that don’t take a side in the split. They are automatically added to both armies and only affect white dice that appear 2+ times (duplicates) within each army. Unique white dice are not affected.

The solver finds all possible ways to split the units into two armies with equal total values.

## Installation

Install dependencies:

```bash
npm install
```

## Usage

### Development Mode

Run the solver directly with TypeScript (no build step required):

```bash
npm run dev
```

This will solve all predefined challenges and display the results with colored output.

### Testing

```bash
npm test
```

## How It Works

The solver uses a permutation-based approach to find solutions:

1. Generates all possible permutations of the input units
2. For each permutation, tries all possible split points
3. Calculates the total value of each army
4. Returns the first solution where both armies have equal values

The algorithm uses a generator function to efficiently iterate through permutations without storing them all in memory.
