<template>
	<div class="az-dashboard">
		<div class="az-dashboard__start">
			Score: {{ score }}
		</div>

		<div class="az-dashboard__center">
			Round: {{ round }}
		</div>

		<div class="az-dashboard__end">
			<GameDashboardTimer
				align="center"
				:time="time"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import GameDashboardTimer from '@/components/GameDashboardTimer.vue'

defineProps<{
	round: number
	score: number
	time: number
}>()
</script>

<style lang="scss" scoped>
.az-dashboard {
	width: 100%;
	height: 24px;
	padding: 0 8px;
	display: grid;
	grid-template-columns: 240px 1fr 240px;
	align-items: center;
	background: $color-grey-200;
	font-size: 13px;
	color: $color-grey-400;

	&__start {
		justify-self: start;
	}

	&__center {
		justify-self: center;
	}

	&__end {
		justify-self: end;
	}
}
</style>