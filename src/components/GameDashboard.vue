<template>
    <div class="az-dashboard">
        <div class="az-dashboard__score">
            Score: {{ score }}
        </div>

        <div
            v-if="paused"
            class="az-dashboard__paused"
        >
            PAUSED
        </div>

        <div
            v-else
            class="az-dashboard__round"
        >
            Round: {{ round }}
        </div>

        <div class="az-dashboard__time">
            Time: {{ formattedTime }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    score: number
    round: number
    time: number
    paused: boolean
}>()

const formattedTime = computed((): string => {
    const minutes = Math.floor(props.time / 60)
    const seconds = props.time % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})
</script>

<style lang="scss" scoped>
.az-dashboard {
    width: 100%;
    height: 24px;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: $color-grey-200;
    font-size: 13px;
    font-weight: 400;
    color: $color-grey-400;

    &__score {
        width: 120px;
        text-align: left;
    }

    &__paused {
        font-weight: 700;
        text-align: center;
        text-transform: uppercase;
    }

    &__round {
        font-weight: 500;
        text-align: center;
    }

    &__time {
        width: 120px;
        text-align: right;
    }
}
</style>