<template>
    <div
        v-if="color"
        class="az-tile"
        :class="{
            'az-tile--normal': scale === 1,
            'az-tile--small': scale === 0.5
        }"
        :style="{
            width: `${tile * scale}px`,
            height: `${tile * scale}px`,
            backgroundColor: color
        }"
    />
</template>

<script lang="ts" setup>
defineProps<{
    color: string | ''
    tile: number
    scale: number
}>()
</script>

<style lang="scss" scoped>
.az-tile {
    box-sizing: border-box;
    border-style: solid;
    border-left-color: #FFFFFF66;
    border-top-color: #FFFFFF66;
    border-right-color: #00000040;
    border-bottom-color: #00000040;

    &--normal {
        border-width: 10px;
    }

    &--small {
        border-width: 5px;
    }
}
</style>