<template>
	<div class="az-block">
		<div
			v-for="(row, y) in block.shape"
			:key="y"
			class="az-block__row"
		>
			<div
				v-for="(tile, x) in row"
				:key="x"
				class="az-block__tile"
				:style="{
					width: `${size * scale}px`,
					height: `${size * scale}px`
				}"
			>
				<GameTile
					v-if="tile"
					:scale="scale"
					:size="size"
					:tile="block.color"
				/>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import GameTile from '@/components/GameTile.vue'

import type { Block } from '@/types/blocks'

defineProps<{
	block: Block
	scale: number
	size: number
}>()
</script>

<style lang="scss" scoped>
.az-block {
	display: inline-flex;
	flex-direction: column;

	&__row {
		display: flex;
	}

	&__tile {
		position: relative;
	}
}
</style>