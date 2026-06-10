import type { Block } from '@/types/blocks'

type Shape = number[][]

export const colors: string[] = [
	'mint',
	'rose',
	'navy',
]

export const shapes: Shape[] = [
	[[1]],

	[[1, 1]],
	[[1], [1]],

	[[1, 1, 1]],
	[[1], [1], [1]],

	[[1, 1, 1, 1]],
	[[1], [1], [1], [1]],

	[[1, 1, 1, 1, 1]],
	[[1], [1], [1], [1], [1]],

	[[1, 0], [1, 1]],
	[[0, 1], [1, 1]],
	[[1, 1], [1, 0]],
	[[1, 1], [0, 1]],

	[[1, 0, 0], [1, 0, 0], [1, 1, 1]],
	[[0, 0, 1], [0, 0, 1], [1, 1, 1]],
	[[1, 1, 1], [0, 0, 1], [0, 0, 1]],
	[[1, 1, 1], [1, 0, 0], [1, 0, 0]],

	[[1, 1], [1, 1]],

	[[0, 1, 0], [1, 1, 1]],
	[[1, 1, 1], [0, 1, 0]],

	[[1, 0], [1, 1], [1, 0]],
	[[0, 1], [1, 1], [0, 1]],

	[[0, 1, 1], [1, 1, 0]],
	[[1, 1, 0], [0, 1, 1]],

	[[1, 0], [1, 1], [0, 1]],
	[[0, 1], [1, 1], [1, 0]],

	[[1, 1, 1], [1, 0, 1]],
	[[1, 0, 1], [1, 1, 1]],

	[[1, 1], [1, 0], [1, 1]],
	[[1, 1], [0, 1], [1, 1]],

	[[1, 0], [1, 0], [1, 1]],
	[[0, 1], [0, 1], [1, 1]],

	[[1, 0, 0], [1, 1, 1]],
	[[0, 0, 1], [1, 1, 1]],

	[[1, 1], [1, 0], [1, 0]],
	[[1, 1], [0, 1], [0, 1]],

	[[1, 1, 1], [1, 0, 1], [1, 0, 1]],
	[[1, 0, 1], [1, 0, 1], [1, 1, 1]],

	[[1, 1, 1], [0, 0, 1], [1, 1, 1]],
	[[1, 1, 1], [1, 0, 0], [1, 1, 1]]
]

let globalBag: Shape[] = []

export const useBlocksMovement = () => {
	const createBlock = (shape: Shape, color: string): Block => ({
		shape,
		color,
		disabled: false
	})

	const countPieces = (shape: Shape): number =>
		shape.reduce(
			(sum, row) => sum + row.filter(value => value === 1).length,
			0
		)

	const buildBagGroup = (
		source: Shape[],
		count: number
	): Shape[] =>
		Array.from(
			{ length: count },
			() => source[Math.floor(Math.random() * source.length)]
		)

	const rebuildGlobalBag = (): void => {
		const groupSmall: Shape[] = []
		const groupMedium: Shape[] = []
		const groupLarge: Shape[] = []

		shapes.forEach(shape => {
			const pieces = countPieces(shape)

			if (pieces <= 2) {
				groupSmall.push(shape)
			} else if (pieces <= 4) {
				groupMedium.push(shape)
			} else {
				groupLarge.push(shape)
			}
		})

		globalBag = [
			...buildBagGroup(groupMedium, 60),
			...buildBagGroup(groupSmall, 15),
			...buildBagGroup(groupLarge, 25)
		].sort(() => Math.random() - 0.5)
	}

	const drawFromBag = (): Shape => {
		if (!globalBag.length) {
			rebuildGlobalBag()
		}

		return globalBag.pop()!
	}

	const createRound = (): Block[] =>
		[...colors]
			.sort(() => Math.random() - 0.5)
			.slice(0, 3)
			.map(color => createBlock(drawFromBag(), color))

	return {
		colors,
		createBlock,
		createRound,
		shapes
	}
}