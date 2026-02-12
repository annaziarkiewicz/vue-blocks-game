<template>
    <div
        ref="gameBoardRef"
        class="az-board"
        :style="{
            width: `${cols * tile}px`,
            height: `${rows * tile}px`
        }"
    >
        <div
            v-for="(row, y) in board"
            :key="y"
            class="az-board__row"
        >
            <div
                v-for="(cell, x) in row"
                :key="x"
                class="az-board__cell"
            >
                <GameTile
                    v-if="cell"
                    :color="cell"
                    :tile="tile"
                    :scale="1"
                />

                <div
                    v-else-if="isPreviewCell(x, y)"
                    class="az-board__preview"
                    :style="{
                        width: `${tile}px`,
                        height: `${tile}px`
                    }"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose } from 'vue'
import GameTile from '@/components/GameTile.vue'

defineProps<{
    board: (string | '')[][]
    tile: number
    rows: number
    cols: number
    isPreviewCell: (x: number, y: number) => boolean
}>()

const gameBoardRef = ref<HTMLElement | null>(null)

defineExpose({
    gameBoardRef
})
</script>

<style lang="scss" scoped>
.az-board {
    background-color: #EBEBE7;
    background-image:
        repeating-linear-gradient(
            45deg,
            $color-milk-200 25%,
            transparent 25%,
            transparent 75%,
            $color-milk-200 75%,
            $color-milk-200
        ),
        repeating-linear-gradient(
            45deg,
            $color-milk-200 25%,
            #EBEBE7 25%,
            #EBEBE7 75%,
            $color-milk-200 75%,
            $color-milk-200
        );
    background-position: 0 0, 64px 64px;
    background-size: 128px 128px;

    &__row {
        display: flex;
    }

    &__cell {
        position: relative;
        width: 64px;
        height: 64px;
    }

    &__preview {
        position: absolute;
        inset: 0;
        background: #AFAFA880;
    }
}
</style>