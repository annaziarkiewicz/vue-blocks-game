<template>
	<div
		class="az-blocks"
		:style="{
			width: `${slotSize}px`
		}"
	>
		<div
			v-for="(block, index) in blocks"
			:key="index"
			class="az-blocks__slot"
			:class="{ 'az-blocks__slot--disabled': block?.disabled }"
			:style="{
				width: `${slotSize}px`,
				height: `${slotSize}px`,
				gridTemplateColumns: `repeat(5, ${previewTileSize}px)`,
				gridTemplateRows: `repeat(5, ${previewTileSize}px)`
			}"
			@mousedown="block && !block.disabled && startDrag(block, index, $event)"
		>
			<div
				v-if="block"
				class="az-blocks__holder"
				:style="getBlockGridStyle(block)"
			>
				<GameBlock
					:block="block"
					:scale="0.5"
					:size="size"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

import GameBlock from '@/components/GameBlock.vue'

import type { Block } from '@/types/blocks'

const props = defineProps<{
	blocks: (Block | null)[]
	size: number
	startDrag: (block: Block, index: number, event: MouseEvent) => void
}>()

const previewTileSize = computed(() => props.size / 2)
const slotSize = computed(() => previewTileSize.value * 5)

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
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 24px;

	&__slot {
		display: grid;
		cursor: grab;

		&:active {
			cursor: grabbing;
		}

		&--disabled {
			cursor: not-allowed;

			:deep(.az-tile) {
				background: $color-grey-200;
			}
		}
	}

	&__holder {
		display: inline-block;
	}
}
</style>