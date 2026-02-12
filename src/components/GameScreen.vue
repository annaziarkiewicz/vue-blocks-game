<template>
    <div class="az-game-screen">
        <div class="az-game-screen__box">
            <template v-if="screen === 'intro'">
                <div class="az-game-screen__heading">
                    Vue.js Blocks
                </div>
                <div class="az-game-screen__subtitle">
                    This is a classic block puzzle game where you place differently shaped blocks onto a grid to clear full rows and columns, and aim for the highest score by planning several moves ahead.
                </div>
            </template>

            <template v-else>
                <div class="az-game-screen__heading">
                    Your score
                </div>
                <div class="az-game-screen__subtitle">
                    {{ score }} points
                </div>
            </template>

            <div class="az-game-screen__action">
                <button
                    class="az-game-screen__button"
                    :class="buttonClass"
                    @click="emitStart"
                >
                    {{ screen === 'intro' ? 'Start' : 'Restart' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
    screen: 'intro' | 'gameover'
    score: number
}>()

const emit = defineEmits<{
    (e: 'start'): void
}>()

const emitStart = () => emit('start')

const buttonClass = computed(() =>
    props.screen === 'intro'
        ? 'az-game-screen__button--mint'
        : 'az-game-screen__button--rose'
)
</script>

<style lang="scss" scoped>
.az-game-screen {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #AFAFA880;

    &:after {
        content: '';
        position: absolute;
        bottom: 36px;
        left: -178px;
        width: 337px;
        height: 225px;
        rotate: -25deg;
        transform: scale(0.85);
        pointer-events: none;
        background-repeat: no-repeat;
        background-size: contain;
        background-image: url('@/assets/rose.png');

        @media (max-width: 960px) {
            display: none;
        }
    }

    &__box {
        position: relative;
        width: 480px;
        height: 280px;
        padding: 0 84px;
        margin-top: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: $color-milk-200;
        box-shadow: 0 0 24px $color-milk-300;
        border-radius: 24px;

        &:before,
        &:after {
            content: '';
            position: absolute;
            pointer-events: none;
            transform: scale(0.85);
            background-repeat: no-repeat;
            background-size: contain;
            
            @media (max-width: 960px) {
                display: none;
            }
        }

        &:before {
            top: -154px;
            left: -214px;
            width: 337px;
            height: 225px;
            rotate: 25deg;
            background-image: url('@/assets/navy.png');
        }

        &:after {
            bottom: 22px;
            right: -218px;
            width: 337px;
            height: 338px;
            rotate: -15deg;
            background-image: url('@/assets/mint.png');
        }
    }

    &__heading {
        font-size: 32px;
        font-weight: 700;
        line-height: 1;
        color: $color-milk-500;
        text-align: center;
    }

    &__subtitle {
        margin: 0 -36px;
        font-size: 13px;
        font-weight: 200;
        line-height: 1.25rem;
        color: $color-grey-400;
        text-align: center;
    }

    &__action {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    &__button {
        width: 100%;
        padding: 16px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 500;
        text-transform: uppercase;
        transition: 0.5s;

        &--rose {
            background: $color-rose-200;

            &:hover {
                background: $color-rose-300;
            }
        }

        &--mint {
            background: $color-mint-300;

            &:hover {
                background: $color-mint-400;
            }
        }
    }
}
</style>