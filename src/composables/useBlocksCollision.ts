import type { Block, Tile } from '@/types/blocks'

export const useBlocksCollision = (
	cols: number,
	rows: number
) => {
	const isInsideBoard = (x: number, y: number): boolean =>
		x >= 0 && y >= 0 && x < cols && y < rows

	const canPlace = (
		block: Block,
		board: Tile[][],
		startX: number,
		startY: number
	): boolean => {
		for (let y = 0; y < block.shape.length; y++) {
			for (let x = 0; x < block.shape[y].length; x++) {
				if (!block.shape[y][x]) continue

				const boardX = startX + x
				const boardY = startY + y

				if (!isInsideBoard(boardX, boardY) || board[boardY][boardX]) {
					return false
				}
			}
		}

		return true
	}

	const canFitOnBoard = (
		block: Block,
		board: Tile[][]
	): boolean => {
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (canPlace(block, board, x, y)) {
					return true
				}
			}
		}

		return false
	}

	return {
		canFitOnBoard,
		canPlace,
		isInsideBoard
	}
}