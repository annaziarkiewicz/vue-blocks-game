export type Tile = string | ''

export type GameScreen = 'game' | 'menu' | 'highScores' | 'howToPlay'

export type GameOverlay = null | 'input' | 'gameOver'

export interface Block {
	shape: number[][]
	color: string
	disabled: boolean
}