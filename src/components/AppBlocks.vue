<template>
    <section class="az-game">
        <GameDashboard
            :score="score"
            :round="round"
            :time="time"
            :paused="paused"
        />

        <GameBoard
            ref="gameBoardRef"
            :board="board"
            :tile="tile"
            :rows="rows"
            :cols="cols"
            :is-preview-cell="isPreviewCell"
        />

        <GameBlocks
            v-if="!showGameScreen"
            :blocks="blocks"
            :tile="tile"
            :start-drag="startDrag"
        />

        <div
            v-if="draggingBlock"
            class="az-game__drag"
            :style="{ left: `${dragX}px`, top: `${dragY}px` }"
        >
            <GameBlock
                :block="draggingBlock"
                :tile="tile"
                :scale="1"
            />
        </div>

        <GameScreen
            v-if="showGameScreen"
            :screen="screenMode"
            :score="score"
            @start="startGame"
        />
    </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

import GameDashboard from '@/components/GameDashboard.vue'
import GameBoard from '@/components/GameBoard.vue'
import GameBlocks from '@/components/GameBlocks.vue'
import GameBlock from '@/components/GameBlock.vue'
import GameScreen from '@/components/GameScreen.vue'

import { useBlocksShapes, type Block } from '@/composables/useBlocksShapes'
import { useBlocksGame } from '@/composables/useBlocksGame'

type Cell = string | ''

const tile = 64
const rows = 9
const cols = 9

const { createRound } = useBlocksShapes()
const {
    createNewGame,
    canPlace,
    updateDisabledBlocks,
    place,
    clearLines,
    calculateScore,
    isGameOver
} = useBlocksGame(rows, cols)

const board = ref<Cell[][]>([])
const blocks = ref<(Block | null)[]>([])
const score = ref(0)

const round = ref(1)
const time = ref(0)
const paused = ref(false)

let timer: number | null = null

const showGameScreen = ref(true)
const screenMode = ref<'intro' | 'gameover'>('intro')

const gameBoardRef = ref<any>(null)

const draggingBlock = ref<Block | null>(null)
const draggingIndex = ref<number | null>(null)
const dragX = ref(0)
const dragY = ref(0)

const previewX = ref<number | null>(null)
const previewY = ref<number | null>(null)

const stopTimer = () => {
    if (timer !== null) {
        clearInterval(timer)
        timer = null
    }
}

const startTimer = () => {
    stopTimer()
    timer = window.setInterval(() => {
        if (!paused.value) {
            time.value++
        }
    }, 1000)
}

const checkGameOver = () => {
    if (isGameOver(blocks.value)) {
        showGameScreen.value = true
        screenMode.value = 'gameover'
        stopTimer()
    }
}

const startGame = () => {
    const game = createNewGame()

    board.value = game.board
    score.value = 0
    time.value = 0
    round.value = 1
    paused.value = false

    blocks.value = createRound()
    updateDisabledBlocks(blocks.value, board.value)

    showGameScreen.value = false
    screenMode.value = 'intro'

    startTimer()
    checkGameOver()
}

const nextRound = () => {
    round.value++
    blocks.value = createRound()
    updateDisabledBlocks(blocks.value, board.value)
    checkGameOver()
}

const togglePause = () => {
    paused.value = !paused.value
}

const onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
        e.preventDefault()
        togglePause()
    }
}

const startDrag = (block: Block, index: number, e: MouseEvent) => {
    if (paused.value || block.disabled) return

    draggingBlock.value = block
    draggingIndex.value = index

    dragX.value = e.clientX - tile / 2
    dragY.value = e.clientY - tile / 2

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', endDrag)
}

const onMove = (e: MouseEvent) => {
    if (paused.value) return
    if (!draggingBlock.value || !gameBoardRef.value?.gameBoardRef) return

    dragX.value = e.clientX - tile / 2
    dragY.value = e.clientY - tile / 2

    const rect = gameBoardRef.value.gameBoardRef.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / tile)
    const y = Math.floor((e.clientY - rect.top) / tile)

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
        !paused.value &&
        draggingBlock.value &&
        draggingIndex.value !== null &&
        previewX.value !== null &&
        previewY.value !== null
    ) {
        place(draggingBlock.value, board.value, previewX.value, previewY.value)

        const cleared = clearLines(board.value)
        if (cleared) {
            score.value += calculateScore(cleared)
        }

        blocks.value[draggingIndex.value] = null

        if (blocks.value.every(block => block === null)) {
            nextRound()
        } else {
            updateDisabledBlocks(blocks.value, board.value)
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

const isPreviewCell = (x: number, y: number): boolean => {
    if (
        !draggingBlock.value ||
        previewX.value === null ||
        previewY.value === null
    ) {
        return false
    }

    const px = x - previewX.value
    const py = y - previewY.value

    return draggingBlock.value.shape[py]?.[px] === 1
}

onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
    stopTimer()
    window.removeEventListener('keydown', onKeyDown)
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
        pointer-events: none;
        z-index: 1;
    }
}
</style>