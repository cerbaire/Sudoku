import Logic = require('logic-solver')
import assert = require('assert')

class SudokuSolver {
    private addBlockConstraints(solver, size: number) {
        const blockSize = Math.sqrt(size)
    
        for (let blockRow = 0; blockRow < blockSize; blockRow++) {
            for (let blockCol = 0; blockCol < blockSize; blockCol++) {
                for (let value = 1; value <= size; value++) {
                    let varsForBlock: string[] = []
    
                    for (let rowDelta = 0; rowDelta < blockSize; rowDelta++) {
                        for (let colDelta = 0; colDelta < blockSize; colDelta++) {
                            const row = blockRow * blockSize + rowDelta
                            const col = blockCol * blockSize + colDelta
    
                            varsForBlock.push(`R${row}C${col}#${value}`)
                        }
                    }
    
                    solver.require(Logic.exactlyOne(...varsForBlock))
                }
            }
        }
    }

    private addSudokuConstraints(solver, puzzle: string, characters: string, emptyChar: string) {
        let size = Math.sqrt(puzzle.length);
        let grid = [];
        for (let i = 0; i < size; i++) {
            grid[i] = puzzle.slice(i * size, (i + 1) * size).split('')
        }
   
        this.printGrid(grid)
        
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (grid[row][col] !== emptyChar) {
                    const value = characters.indexOf(grid[row][col]) + 1
                    const varName = `R${row}C${col}#${value}`
                    solver.require(Logic.exactlyOne(varName))
                } else {
                    solver.require(Logic.or(...characters.split('').map((char, index) => {
                        const value = index + 1
                        const varName = `R${row}C${col}#${value}`
                        return varName
                    })))
                }
            }
        }
    
        for (let row = 0; row < size; row++) {
            for (let value = 1; value <= size; value++) {
                let varsForRow: string[] = []
                for (let col = 0; col < size; col++) {
                    varsForRow.push(`R${row}C${col}#${value}`)
                }
                solver.require(Logic.exactlyOne(...varsForRow))
            }
        }
    
        for (let col = 0; col < size; col++) {
            for (let value = 1; value <= size; value++) {
                let varsForCol: string[] = []
                for (let row = 0; row < size; row++) {
                    varsForCol.push(`R${row}C${col}#${value}`)
                }
                solver.require(Logic.exactlyOne(...varsForCol))
            }
        }
        
        this.addBlockConstraints(solver, size)
    }

    public solveSudoku(puzzle: string, characters: string, emptyChar: string): string | null {
        const solver = new Logic.Solver()

        this.addSudokuConstraints(solver, puzzle, characters, emptyChar)

        const solution = solver.solve()

        if (solution) {
            const size = Math.sqrt(puzzle.length);
            const solvedGrid: string[][] = new Array(size).fill(null).map(() => new Array(size).fill(emptyChar))

            solution.getTrueVars().forEach(varName => {
                const matches = /R(\d+)C(\d+)#(\d+)/.exec(varName)
                if (matches) {
                    const row = parseInt(matches[1], 10)
                    const col = parseInt(matches[2], 10)
                    const valueIndex = parseInt(matches[3], 10) - 1
                    const value = characters[valueIndex]

                    solvedGrid[row][col] = value
                }
            })

            this.printGrid(solvedGrid)

            return solvedGrid.map(row => row.join('')).join('')
        } else {
            return null
        }
    }

    private printGrid(grid: string[][]) {
        // grid.forEach(row => console.log(row.join(' ')))
    }
}

const main = (): string | null => {
    const [puzzle, characters, emptyChar] = process.argv.slice(2)

    if (!puzzle || !characters || !emptyChar) {
        console.error('Usage: node index.js <Puzzle> <Valid characters> <Empty cell character>')
        process.exit(1)
    }
    
    const size = Math.sqrt(puzzle.length)
    assert.ok(size === characters.length, `Number of valid character does not match the size of the puzzle, Puzzle: ${size}, Characters: ${characters.length}`)

    const sudokuSolver = new SudokuSolver()
    const solution = sudokuSolver.solveSudoku(puzzle, characters, emptyChar)
    assert.ok(solution?.length === puzzle.length, 'Solution length does not match the length of the puzzle')
    
    return solution
}

console.log(main())
