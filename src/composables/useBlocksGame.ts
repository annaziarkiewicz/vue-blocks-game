import type { Block, Tile } from '@/types/blocks'

export const useBlocksGame = () => {
	const updateDisabledBlocks = (
		blocks: (Block | null)[],
		board: Tile[][],
		canFitOnBoard: (block: Block, board: Tile[][]) => boolean
	): void => {
		blocks.forEach(block => {
			if (block) {
				block.disabled = !canFitOnBoard(block, board)
			}
		})
	}

	const calculateScore = (cleared: number): number =>
		cleared === 0
			? 0
			: cleared * 10 + Math.max(0, cleared - 1) * 10

	const isGameOver = (
		blocks: (Block | null)[]
	): boolean =>
		blocks.every(block => !block || block.disabled)

	return {
		calculateScore,
		isGameOver,
		updateDisabledBlocks
	}
}