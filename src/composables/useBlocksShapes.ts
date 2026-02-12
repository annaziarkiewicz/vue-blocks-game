export interface Block {
    shape: number[][]
    color: string
    disabled: boolean
}

export const colors = ['#9AE0DE', '#E08DA6', '#587993']

export const shapes: number[][][] = [
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

let globalBag: number[][][] = []

export const useBlocksShapes = () => {
    const createBlock = (shape: number[][], color: string): Block => ({
        shape,
        color,
        disabled: false
    })

    const countPieces = (shape: number[][]): number =>
        shape.reduce(
            (sum, row) => sum + row.filter(v => v === 1).length,
            0
        )

    const buildBagGroup = (
        source: number[][][],
        count: number
    ): number[][][] =>
        Array.from(
            { length: count },
            () => source[Math.floor(Math.random() * source.length)]
        )

    const rebuildGlobalBag = (): void => {
        const groupSmall: number[][][] = []
        const groupMedium: number[][][] = []
        const groupLarge: number[][][] = []

        shapes.forEach(shape => {
            const pieces = countPieces(shape)
            if (pieces <= 2) groupSmall.push(shape)
            else if (pieces <= 4) groupMedium.push(shape)
            else groupLarge.push(shape)
        })

        globalBag = [
            ...buildBagGroup(groupMedium, 60),
            ...buildBagGroup(groupSmall, 15),
            ...buildBagGroup(groupLarge, 25)
        ].sort(() => Math.random() - 0.5)
    }

    const drawFromBag = (): number[][] => {
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

    const canFitOnBoard = (
        block: Block,
        board: (string | '')[][]
    ): boolean => {
        const rows = board.length
        const cols = board[0].length

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let fits = true

                for (let sy = 0; sy < block.shape.length; sy++) {
                    for (let sx = 0; sx < block.shape[sy].length; sx++) {
                        if (!block.shape[sy][sx]) continue

                        const bx = x + sx
                        const by = y + sy

                        if (
                            bx < 0 ||
                            by < 0 ||
                            bx >= cols ||
                            by >= rows ||
                            board[by][bx]
                        ) {
                            fits = false
                            break
                        }
                    }
                    if (!fits) break
                }

                if (fits) return true
            }
        }

        return false
    }

    return {
        colors,
        shapes,
        createBlock,
        createRound,
        canFitOnBoard
    }
}