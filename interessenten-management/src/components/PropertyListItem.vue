<script setup lang="ts">
import type {Immobilie} from "@/stores/property-store";
import {computed} from "vue";
import {usePropertyStore} from "@/stores/property-store";

interface Props {
    property: Immobilie,
}
const props = defineProps<Props>();
const properties = usePropertyStore();

const displayedTitle = computed(() => props.property.name.length > 0 ? props.property.name : 'Kein Titel')
</script>

<template>
  <button class="property-list-item shadow rounded bg-white p-2 text-left">
      <span class="property-title text-lg block mb-2">{{ displayedTitle }}</span>
      <span class="property-interessenten py-1 px-2 bg-blue-200 text-xs rounded-lg">
          {{ properties.interessiert(props.property) }} Interessent{{ properties.interessiert(props.property) !== 1 ? 'en' : '' }}
      </span>
  </button>
</template>

<style scoped>

</style>