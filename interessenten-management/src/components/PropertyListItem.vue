<script setup lang="ts">
import type {Immobilie} from "@/stores/property-store";
import {computed} from "vue";
import {usePropertyStore} from "@/stores/property-store";

interface Props {
    property: Immobilie,
}
const props = defineProps<Props>();
const properties = usePropertyStore();

const displayedTitle = computed(() => props.property.name.length > 0 ? props.property.name : false)

const formattedDate = computed(() => {
    if (!props.property) return undefined;
    let date;
    if (props.property.created.seconds) {
        date = new Date(props.property.created.toDate());
    } else {
        date = new Date(props.property.created);
    }
    return date.toLocaleDateString('de-DE', {dateStyle: 'medium'})
})
</script>

<template>
  <button class="property-list-item shadow rounded bg-white p-2 text-left">
    <span class="flex gap-2 justify-between items-start">
      <span class="property-title text-lg block mb-2">
        <template v-if="displayedTitle">
          {{ displayedTitle }}
        </template>
        <template v-else>
          <em>Immobilie ohne Namen</em>
        </template>
      </span>
    <span class="last-edited text-sm flex items-center gap-1"><icon:material-symbols:calendar-add-on />{{ formattedDate
      }}</span>
      </span>
    <span class="flex gap-1">
      <span class="property-interessenten py-1 px-2 bg-blue-200 text-xs rounded-lg">
          {{ property.interessenten.length }} Kontakt{{ property.interessenten.length !== 1 ? 'e' : '' }}
      </span>
    <span class="property-interessenten py-1 px-2 bg-green-200 text-xs rounded-lg">
          {{ properties.interessiert(props.property) }} Interessent{{ properties.interessiert(props.property) !== 1 ? 'en' : '' }}
      </span>
      </span>
  </button>
</template>

<style scoped>

</style>
