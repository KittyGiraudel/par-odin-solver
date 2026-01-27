# Par Odin! Solver

A TypeScript solver for the *Par Odin!* game, which challenges players to split a set of symbols into two armies with equal total values.

## What is Par Odin!?

Par Odin! is a puzzle game where you’re given a draft of symbols (characters and creatures) and must divide them into two balanced armies. Each symbol has a specific value calculation:

- **White symbols** (positive values):
  - `HERO`: +3
  - `CAPTAIN`: +2
  - `SOLDIER`: +1
  - `CURSED`: -1
  - `MAGE`: Value equals the number of non-mage white symbols (excluding itself)
  - `TRAITOR`: +1, but -3 if paired with a HERO

- **Black symbols** (variable values):
  - `WOLF`: Double the highest positive white symbol value
  - `SNAKE`: Negate the highest positive white symbol value
  - `HORSE`: Value equals the number of white symbols
  - `DRAGON`: Negative value equal to the number of white symbols

The solver finds all possible ways to split the symbols into two armies with equal total values.

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

### Production Build

Build the TypeScript project:

```bash
npm run build
```

Run the compiled JavaScript:

```bash
npm start
```

### Testing

Run tests in development mode:

```bash
npm run test:dev
```

Or run the compiled tests:

```bash
npm test
```

## How It Works

The solver uses a permutation-based approach to find solutions:

1. Generates all possible permutations of the input symbols
2. For each permutation, tries all possible split points
3. Calculates the total value of each army
4. Returns the first solution where both armies have equal values

The algorithm uses a generator function to efficiently iterate through permutations without storing them all in memory.
