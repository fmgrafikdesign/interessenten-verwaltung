<script setup lang="ts">

defineProps<{
  modelValue: string,
}>()

const emit = defineEmits(['update:model-value'])
</script>

<template>
  <input class="p-2 rounded shadow w-full" :value="modelValue" @input="emit('update:model-value', $event.target.value)">
</template>

<style scoped>
</style>