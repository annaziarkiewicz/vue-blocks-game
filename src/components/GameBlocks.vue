<template>
    <div class="az-blocks">
        <div
            v-for="(block, index) in blocks"
            :key="index"
            class="az-blocks__slot"
            :class="{ 'az-blocks__slot--disabled': block?.disabled }"
            @mousedown="block && !block.disabled && startDrag(block, index, $event)"
        >
            <div
                v-if="block"
                class="az-blocks__holder"
                :style="getBlockGridStyle(block)"
            >
                <GameBlock
                    :block="block"
                    :tile="tile"
                    :scale="0.5"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import GameBlock from '@/components/GameBlock.vue'
import type { Block } from '@/composables/useBlocksShapes'

defineProps<{
    blocks: (Block | null)[]
    tile: number
    startDrag: (block: Block, index: number, e: MouseEvent) => void
}>()

const getBlockGridStyle = (block: Block): {
    gridColumnStart: number
    gridRowStart: number
} => {
    const shapeHeight = block.shape.length
    const shapeWidth = block.shape[0].length

    return {
        gridColumnStart: Math.floor((5 - shapeWidth) / 2) + 1,
        gridRowStart: Math.floor((5 - shapeHeight) / 2) + 1
    }
}
</script>

<style lang="scss" scoped>
.az-blocks {
    position: absolute;
    top: 48px;
    right: -192px;
    width: 160px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;

    &__slot {
        width: 160px;
        height: 160px;
        display: grid;
        grid-template-columns: repeat(5, 32px);
        grid-template-rows: repeat(5, 32px);
        background-color: #B1B1AA;
        background-image:
            repeating-linear-gradient(
                45deg,
                $color-milk-300 25%,
                transparent 25%,
                transparent 75%,
                $color-milk-300 75%,
                $color-milk-300
            ),
            repeating-linear-gradient(
                45deg,
                $color-milk-300 25%,
                #B1B1AA 25%,
                #B1B1AA 75%,
                $color-milk-300 75%,
                $color-milk-300
            );
        background-position: 0 0, 32px 32px;
        background-size: 64px 64px;
        border: 1px solid #BFBFBA80;
        cursor: grab;

        &:active {
            cursor: grabbing;
        }

        &--disabled {
            cursor: not-allowed;

            :deep(.az-tile) {
                background-color: $color-grey-200 !important;
            }
        }
    }

    &__holder {
        display: inline-block;
    }
}
</style>