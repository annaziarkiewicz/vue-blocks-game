<template>
	<section class="az-game">
		<GameDashboard
			:round="round"
			:score="score"
			:time="time"
		/>

		<GameBoard
			ref="gameBoardRef"
			:board="board"
			:cols="cols"
			:is-preview-tile="isPreviewTile"
			:rows="rows"
			:size="size"
		>
			<GameOverlayText
				v-if="gameState.paused && gameState.overlay === null && gameState.screen === 'game'"
				text="PAUSED"
			/>

			<GameOverlayText
				v-if="resultOverlayText"
				:text="resultOverlayText"
			/>

			<GameOverlayInput
				v-if="gameState.overlay === 'input'"
				heading="What's your name?"
				placeholder="Type your name and hit enter"
				@close="onInputClose"
				@submit="onScoreSubmit"
			/>
		</GameBoard>

		<GameBlocks
			v-if="gameState.screen === 'game'"
			:blocks="blocks"
			:size="size"
			:start-drag="startDrag"
		/>

		<div
			v-if="draggingBlock"
			class="az-game__drag"
			:style="{
				left: `${dragX}px`,
				top: `${dragY}px`
			}"
		>
			<GameBlock
				:block="draggingBlock"
				:scale="1"
				:size="size"
			/>
		</div>

		<GameScreen
			v-if="gameState.screen !== 'game'"
			:button-back-to-game="hasActiveGame"
			:button-high-scores="true"
			:button-how-to-play="true"
			:button-play-game="!hasActiveGame"
			:game-headline="gameHeadline"
			@back-to-game="backToGame"
			@play-game="playGame"
			@show-high-scores="showHighScores"
			@show-how-to-play="showHowToPlay"
		>
			<template #illustrations>
				<div class="az-illustration az-illustration--mint" />
				<div class="az-illustration az-illustration--rose" />
				<div class="az-illustration az-illustration--navy" />
            </template>

			<GameScreenHighScores
				v-if="gameState.screen === 'highScores'"
				@close="closeHighScores"
			/>

			<GameScreenHowToPlay
				v-if="gameState.screen === 'howToPlay'"
				@close="closeHowToPlay"
			/>
		</GameScreen>
	</section>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

import GameBlock from '@/components/GameBlock.vue'
import GameBlocks from '@/components/GameBlocks.vue'
import GameBoard from '@/components/GameBoard.vue'
import GameDashboard from '@/components/GameDashboard.vue'
import GameOverlayInput from '@/components/GameOverlayInput.vue'
import GameOverlayText from '@/components/GameOverlayText.vue'
import GameScreen from '@/components/GameScreen.vue'
import GameScreenHighScores from '@/components/GameScreenHighScores.vue'
import GameScreenHowToPlay from '@/components/GameScreenHowToPlay.vue'

import { useBlocksCollision } from '@/composables/useBlocksCollision'
import { useBlocksGame } from '@/composables/useBlocksGame'
import { useBlocksMap } from '@/composables/useBlocksMap'
import { useBlocksMovement } from '@/composables/useBlocksMovement'
import { useBlocksScores } from '@/composables/useBlocksScores'

import type { Block, GameOverlay, GameScreen as GameScreenType, Tile } from '@/types/blocks'

const gameHeadline = 'Blocks'
const gameActionDelay = 1000

const {
	clearLines,
	cols,
	createEmptyBoard,
	placeBlock,
	rows,
	size
} = useBlocksMap()

const {
	canFitOnBoard,
	canPlace
} = useBlocksCollision(cols, rows)

const {
	calculateScore,
	isGameOver,
	updateDisabledBlocks
} = useBlocksGame()

const { createRound } = useBlocksMovement()
const { addScore, isHighScore } = useBlocksScores()

const gameBoardRef = ref<{
	gameBoardRef: HTMLElement | null
} | null>(null)

const board = ref<Tile[][]>([])
const blocks = ref<(Block | null)[]>([])
const dragX = ref(0)
const dragY = ref(0)
const draggingBlock = ref<Block | null>(null)
const draggingIndex = ref<number | null>(null)
const gameState = ref<{
	overlay: GameOverlay
	paused: boolean
	screen: GameScreenType
}>({
	overlay: null,
	paused: true,
	screen: 'menu'
})
const hasActiveGame = ref(false)
const isGameFrozen = ref(false)
const previewX = ref<number | null>(null)
const previewY = ref<number | null>(null)
const round = ref(1)
const score = ref(0)
const time = ref(0)

let timer: number | null = null

const resultOverlayText = computed(() => {
	if (gameState.value.overlay === 'gameOver') return 'GAME OVER'

	return ''
})

const isGamePaused = computed(() =>
	gameState.value.paused ||
	gameState.value.screen !== 'game' ||
	gameState.value.overlay !== null ||
	isGameFrozen.value
)

const stopTimer = () => {
	if (timer !== null) {
		clearInterval(timer)
		timer = null
	}
}

const startTimer = () => {
	stopTimer()

	timer = window.setInterval(() => {
		if (!isGamePaused.value) {
			time.value++
		}
	}, 1000)
}

const resetGame = () => {
	board.value = createEmptyBoard()
	blocks.value = createRound()
	score.value = 0
	round.value = 1
	time.value = 0

	updateDisabledBlocks(blocks.value, board.value, canFitOnBoard)
}

const clearActiveGame = () => {
	resetGame()
	hasActiveGame.value = false
}

const runWithDelay = (action: () => void, delay = gameActionDelay) => {
	isGameFrozen.value = true

	window.setTimeout(() => {
		action()
		isGameFrozen.value = false
	}, delay)
}

const showResultScreen = () => {
	clearActiveGame()

	gameState.value.overlay = null
	gameState.value.paused = true
	gameState.value.screen = 'menu'
}

const checkGameOver = () => {
	if (!isGameOver(blocks.value)) return

	gameState.value.paused = true

	if (isHighScore(score.value)) {
		gameState.value.overlay = 'input'
		return
	}

	gameState.value.overlay = 'gameOver'

	runWithDelay(() => {
		showResultScreen()
	}, gameActionDelay * 2)
}

const playGame = () => {
	resetGame()

	hasActiveGame.value = true

	gameState.value.overlay = null
	gameState.value.paused = false
	gameState.value.screen = 'game'

	startTimer()
	checkGameOver()
}

const backToGame = () => {
	if (!hasActiveGame.value) return

	gameState.value.overlay = null
	gameState.value.paused = false
	gameState.value.screen = 'game'
}

const openMenu = () => {
	if (!hasActiveGame.value) return

	gameState.value.overlay = null
	gameState.value.paused = true
	gameState.value.screen = 'menu'
}

const togglePause = () => {
	if (gameState.value.screen !== 'game') return
	if (gameState.value.overlay !== null) return

	gameState.value.paused = !gameState.value.paused
}

const showHighScores = () => {
	gameState.value.screen = 'highScores'
}

const closeHighScores = () => {
	gameState.value.screen = 'menu'
}

const showHowToPlay = () => {
	gameState.value.screen = 'howToPlay'
}

const closeHowToPlay = () => {
	gameState.value.screen = 'menu'
}

const onScoreSubmit = (name: string) => {
	addScore({
		name,
		score: score.value
	})

	clearActiveGame()

	gameState.value.overlay = null
	gameState.value.paused = true
	gameState.value.screen = 'highScores'
}

const onInputClose = () => {
	showResultScreen()
}

const nextRound = () => {
	round.value++
	blocks.value = createRound()

	updateDisabledBlocks(blocks.value, board.value, canFitOnBoard)
	checkGameOver()
}

const startDrag = (
	block: Block,
	index: number,
	event: MouseEvent
) => {
	if (isGamePaused.value || block.disabled) return

	draggingBlock.value = block
	draggingIndex.value = index

	dragX.value = event.clientX - size / 2
	dragY.value = event.clientY - size / 2

	window.addEventListener('mousemove', onMove)
	window.addEventListener('mouseup', endDrag)
}

const onMove = (event: MouseEvent) => {
	if (isGamePaused.value) return
	if (!draggingBlock.value || !gameBoardRef.value?.gameBoardRef) return

	dragX.value = event.clientX - size / 2
	dragY.value = event.clientY - size / 2

	const rect = gameBoardRef.value.gameBoardRef.getBoundingClientRect()
	const x = Math.floor((event.clientX - rect.left) / size)
	const y = Math.floor((event.clientY - rect.top) / size)

	if (canPlace(draggingBlock.value, board.value, x, y)) {
		previewX.value = x
		previewY.value = y
	} else {
		previewX.value = null
		previewY.value = null
	}
}

const endDrag = () => {
	if (
		!isGamePaused.value &&
		draggingBlock.value &&
		draggingIndex.value !== null &&
		previewX.value !== null &&
		previewY.value !== null
	) {
		placeBlock(draggingBlock.value, board.value, previewX.value, previewY.value)

		const cleared = clearLines(board.value)

		if (cleared) {
			score.value += calculateScore(cleared)
		}

		blocks.value[draggingIndex.value] = null

		if (blocks.value.every(block => block === null)) {
			nextRound()
		} else {
			updateDisabledBlocks(blocks.value, board.value, canFitOnBoard)
			checkGameOver()
		}
	}

	draggingBlock.value = null
	draggingIndex.value = null
	previewX.value = null
	previewY.value = null

	window.removeEventListener('mousemove', onMove)
	window.removeEventListener('mouseup', endDrag)
}

const isPreviewTile = (x: number, y: number): boolean => {
	if (
		!draggingBlock.value ||
		previewX.value === null ||
		previewY.value === null
	) {
		return false
	}

	const previewBlockX = x - previewX.value
	const previewBlockY = y - previewY.value

	return draggingBlock.value.shape[previewBlockY]?.[previewBlockX] === 1
}

const handleKey = (event: KeyboardEvent) => {
	if (isGameFrozen.value) return
	if (gameState.value.overlay === 'input') return

	if (event.key === 'm' || event.key === 'M') openMenu()
	if (event.key === 'p' || event.key === 'P') togglePause()
	if (event.key === 'r' || event.key === 'R') playGame()
}

onMounted(() => {
	resetGame()
	window.addEventListener('keydown', handleKey)
})

onUnmounted(() => {
	stopTimer()
	window.removeEventListener('keydown', handleKey)
	window.removeEventListener('mousemove', onMove)
	window.removeEventListener('mouseup', endDrag)
})
</script>

<style lang="scss" scoped>
.az-game {
	position: relative;
	width: 576px;
	margin: 0 192px;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	column-gap: 32px;

	&__drag {
		position: fixed;
		z-index: 1;
		pointer-events: none;
	}
}

.az-illustration {
	position: absolute;
	pointer-events: none;
	background-position: center;
	background-size: contain;
	background-repeat: no-repeat;

	&--mint {
		bottom: 164px;
		right: 42px;
		width: 144px;
		height: 144px;
		rotate: 20deg;
		background-image: url('@/assets/screen-mint.png');
	}

	&--rose {
		bottom: 158px;
		left: 34px;
		width: 144px;
		height: 96px;
		rotate: -25deg;
		background-image: url('@/assets/screen-rose.png');
	}

	&--navy {
		top: 105px;
		left: 34px;
		width: 144px;
		height: 96px;
		rotate: 30deg;
		background-image: url('@/assets/screen-navy.png');
	}
}
</style>