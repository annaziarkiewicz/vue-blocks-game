<template>
	<div
		v-if="tile"
		class="az-tile"
		:class="[
			`az-tile--${tile}`,
			{
				'az-tile--normal': scale === 1,
				'az-tile--small': scale === 0.5
			}
		]"
		:style="{
			width: `${size * scale}px`,
			height: `${size * scale}px`
		}"
	/>
</template>

<script lang="ts" setup>
import type { Tile } from '@/types/blocks'

defineProps<{
	scale: number
	size: number
	tile: Tile
}>()
</script>

<style lang="scss" scoped>
.az-tile {
	border-style: solid;
	border-color: rgba(#FFFFFF, 0.4) rgba(#000000, 0.25) rgba(#000000, 0.25) rgba(#FFFFFF, 0.4);

	&--mint {
		background: $color-mint-200;
	}

	&--rose {
		background: $color-rose-200;
	}

	&--navy {
		background: $color-navy-200;
	}

	&--normal {
		border-width: 10px;
	}

	&--small {
		border-width: 5px;
	}
}
</style>