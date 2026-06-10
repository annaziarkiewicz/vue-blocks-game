import type { Block, Tile } from '@/types/blocks'

export const useBlocksMap = () => {
	const cols = 9
	const rows = 9
	const size = 64

	const createEmptyBoard = (): Tile[][] =>
		Array.from({ length: rows }, () =>
			Array.from({ length: cols }, () => '')
		)

	const placeBlock = (
		block: Block,
		board: Tile[][],
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
		board: Tile[][]
	): number => {
		const rowsToClear: number[] = []
		const colsToClear: number[] = []

		for (let y = 0; y < rows; y++) {
			if (board[y].every(tile => tile)) {
				rowsToClear.push(y)
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
				colsToClear.push(x)
			}
		}

		rowsToClear.forEach(y => {
			board[y].fill('')
		})

		colsToClear.forEach(x => {
			for (let y = 0; y < rows; y++) {
				board[y][x] = ''
			}
		})

		return rowsToClear.length + colsToClear.length
	}

	return {
		clearLines,
		cols,
		createEmptyBoard,
		placeBlock,
		rows,
		size
	}
}