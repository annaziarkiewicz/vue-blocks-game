import type { Block } from '@/composables/useBlocksShapes'

type Cell = string | ''

export const useBlocksGame = (
    rows: number,
    cols: number
) => {
    const createEmptyBoard = (): Cell[][] =>
        Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => '')
        )

    const createNewGame = () => ({
        board: createEmptyBoard(),
        score: 0
    })

    const isInsideBoard = (x: number, y: number): boolean =>
        x >= 0 && y >= 0 && x < cols && y < rows

    const canPlace = (
        block: Block,
        board: Cell[][],
        startX: number,
        startY: number
    ): boolean => {
        for (let y = 0; y < block.shape.length; y++) {
            for (let x = 0; x < block.shape[y].length; x++) {
                if (!block.shape[y][x]) continue

                const bx = startX + x
                const by = startY + y

                if (!isInsideBoard(bx, by) || board[by][bx]) {
                    return false
                }
            }
        }
        return true
    }

    const canFitOnBoard = (
        block: Block,
        board: Cell[][]
    ): boolean => {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                if (canPlace(block, board, x, y)) return true
            }
        }
        return false
    }

    const updateDisabledBlocks = (
        blocks: (Block | null)[],
        board: Cell[][]
    ): void => {
        blocks.forEach(block => {
            if (block) {
                block.disabled = !canFitOnBoard(block, board)
            }
        })
    }

    const place = (
        block: Block,
        board: Cell[][],
        startX: number,
        startY: number
    ): void => {
        for (let y = 0; y < block.shape.length; y++) {
            for (let x = 0; x < block.shape[y].length; x++) {
                if (block.shape[y][x]) {
                    board[startY + y][startX + x] = block.color
                }
            }
        }
    }

    const clearLines = (
        board: Cell[][]
    ): number => {
        let cleared = 0

        for (let y = 0; y < rows; y++) {
            if (board[y].every(cell => cell)) {
                board[y].fill('')
                cleared++
            }
        }

        for (let x = 0; x < cols; x++) {
            let isFull = true

            for (let y = 0; y < rows; y++) {
                if (!board[y][x]) {
                    isFull = false
                    break
                }
            }

            if (isFull) {
                for (let y = 0; y < rows; y++) {
                    board[y][x] = ''
                }
                cleared++
            }
        }

        return cleared
    }

    const calculateScore = (
        cleared: number
    ): number =>
        cleared === 0
            ? 0
            : cleared * 10 + Math.max(0, cleared - 1) * 10

    const isGameOver = (
        blocks: (Block | null)[]
    ): boolean =>
        blocks.every(block => !block || block.disabled)

    return {
        createNewGame,
        canPlace,
        canFitOnBoard,
        updateDisabledBlocks,
        place,
        clearLines,
        calculateScore,
        isGameOver
    }
}