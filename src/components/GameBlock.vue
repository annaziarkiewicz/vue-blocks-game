<template>
    <div class="az-block">
        <div
            v-for="(row, y) in block.shape"
            :key="y"
            class="az-block__row"
        >
            <div
                v-for="(cell, x) in row"
                :key="x"
                class="az-block__cell"
                :style="{
                    width: `${tile * scale}px`,
                    height: `${tile * scale}px`
                }"
            >
                <GameTile
                    v-if="cell"
                    :color="block.color"
                    :tile="tile"
                    :scale="scale"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import GameTile from '@/components/GameTile.vue'
import type { Block } from '@/composables/useBlocksShapes'

defineProps<{
    block: Block
    tile: number
    scale: number
}>()
</script>

<style lang="scss" scoped>
.az-block {
    display: inline-flex;
    flex-direction: column;

    &__row {
        display: flex;
    }

    &__cell {
        position: relative;
    }
}
</style>