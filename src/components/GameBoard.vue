<template>
	<div
		ref="gameBoardRef"
		class="az-board"
		:style="{
			width: `${cols * size}px`,
			height: `${rows * size}px`
		}"
	>
		<div
			v-for="(row, y) in board"
			:key="y"
			class="az-board__row"
		>
			<div
				v-for="(tile, x) in row"
				:key="x"
				class="az-board__tile"
				:style="{
					width: `${size}px`,
					height: `${size}px`
				}"
			>
				<GameTile
					v-if="tile"
					:scale="1"
					:size="size"
					:tile="tile"
				/>

				<div
					v-else-if="isPreviewTile(x, y)"
					class="az-board__preview"
				/>
			</div>
		</div>

		<slot />
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import GameTile from '@/components/GameTile.vue'

import type { Tile } from '@/types/blocks'

defineProps<{
	board: Tile[][]
	cols: number
	isPreviewTile: (x: number, y: number) => boolean
	rows: number
	size: number
}>()

const gameBoardRef = ref<HTMLElement | null>(null)

defineExpose({
	gameBoardRef
})
</script>

<style lang="scss" scoped>
.az-board {
	position: relative;
	background-color: $color-milk-200;
	background-image:
		repeating-linear-gradient(45deg, $color-milk-200 25%, transparent 25%, transparent 75%, $color-milk-200 75%, $color-milk-200),
		repeating-linear-gradient(45deg, $color-milk-200 25%, #EDEDE9 25%, #EDEDE9 75%, $color-milk-200 75%, $color-milk-200);
	background-position: 0 0, 64px 64px;
	background-size: 128px 128px;

	&__row {
		display: flex;
	}

	&__tile {
		position: relative;
	}

	&__preview {
		position: absolute;
		inset: 0;
		background: rgba($color-milk-400, 0.5);
	}
}
</style>