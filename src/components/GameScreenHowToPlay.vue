<template>
	<section class="az-how-to-play">
		<div class="az-how-to-play__heading">How to play</div>
		<div class="az-how-to-play__close" @click="emit('close')">✕</div>

		<div class="az-how-to-play__content">
			<div class="az-how-to-play__description">
				This is a classic block puzzle game where you place differently shaped blocks onto a grid to clear full rows and columns, and aim for the highest score by planning several moves ahead.
			</div>

			<div class="az-how-to-play__row">
				<div class="az-elements">
					<div class="az-elements__heading">Game elements:</div>

					<div
						v-for="(block, index) in elementBlocks"
						:key="index"
						class="az-elements__item"
					>
						<GameBlock
							:block="block"
							:scale="0.5"
							:size="64"
						/>

						<div class="az-elements__item-name">block</div>
					</div>
				</div>

				<div class="az-controls">
					<div class="az-controls__heading">Game controls:</div>

					<div class="az-controls__item">
						<div class="az-controls__item-mouse">
							<GameScreenMouse left-button />
						</div>

						<div class="az-controls__item-name">
							drag a block from the sidebar and drop it onto the board
						</div>
					</div>
				</div>

				<div class="az-shortcodes">
					<div class="az-shortcodes__heading">Keyboard shortcodes:</div>

					<div class="az-shortcodes__item">
						<GameScreenKey key-type="letter">M</GameScreenKey>
						<div class="az-shortcodes__item-name">open menu</div>
					</div>

					<div class="az-shortcodes__item">
						<GameScreenKey key-type="letter">P</GameScreenKey>
						<div class="az-shortcodes__item-name">pause / resume</div>
					</div>

					<div class="az-shortcodes__item">
						<GameScreenKey key-type="letter">R</GameScreenKey>
						<div class="az-shortcodes__item-name">restart game</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script lang="ts" setup>
import GameBlock from '@/components/GameBlock.vue'
import GameScreenKey from '@/components/GameScreenKey.vue'
import GameScreenMouse from '@/components/GameScreenMouse.vue'

import type { Block } from '@/types/blocks'

const emit = defineEmits<{
	(e: 'close'): void
}>()

const elementBlocks: Block[] = [
	{
		color: 'navy',
		disabled: false,
		shape: [
			[0, 0, 1],
			[1, 1, 1]
		]
	},
	{
		color: 'rose',
		disabled: false,
		shape: [
			[1, 1, 1]
		]
	},
	{
		color: 'mint',
		disabled: false,
		shape: [
			[0, 1, 0],
			[1, 1, 1]
		]
	}
]
</script>

<style lang="scss" scoped>
.az-how-to-play {
	position: absolute;
	inset: 0;
	overflow-y: scroll;
	width: 100%;
	height: 100%;
	padding: 24px 48px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: start;
	gap: 24px;
	background: $color-milk-200;

	&__heading {
		font-size: 48px;
		font-weight: 700;
		line-height: 1em;
		color: $color-navy-200;
		text-transform: uppercase;
	}

	&__close {
		position: absolute;
		top: 30px;
		right: 30px;
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		cursor: pointer;
		background: $color-navy-200;
		color: $color-milk-200;

		&:hover {
			background: $color-navy-300;
		}
	}

	&__content {
		display: flex;
		flex-direction: column;
		gap: 48px;
		color: $color-grey-400;
	}

	&__description {
		font-size: 20px;
		line-height: 1.5em;
		text-align: justify;
	}

	&__row {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 48px;

		[class$='heading'] {
			margin-bottom: 8px;
			font-size: 15px;
			font-weight: 500;
			line-height: 1.35em;
			text-transform: uppercase;
		}

		[class$='item'] {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 12px;
		}

		[class$='name'] {
			font-size: 15px;
			line-height: 1.5em;
		}
	}

	.az-elements,
	.az-controls,
	.az-shortcodes {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.az-elements {
		width: 172px;

		&__item {
			min-height: 64px;
		}
	}

	.az-controls {
		width: calc(100% - 220px);

		&__item-mouse {
			flex-shrink: 0;
		}
	}

	.az-shortcodes {
		width: 100%;
	}
}
</style>