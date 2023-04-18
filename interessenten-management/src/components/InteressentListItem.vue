<script lang="ts" setup>
import type { Interessent } from '@/stores/property-store'
import { usePropertyStore } from '@/stores/property-store'
import { computed } from 'vue'

interface Props {
  interessent: Interessent
}

const props = defineProps<Props>()
const formattedDate = computed(() => {
  let date
  if (props.interessent.lastEdited.seconds) {
    date = new Date(props.interessent.lastEdited.toDate())
  } else {
    date = new Date(props.interessent.lastEdited)
  }
  return date.toLocaleDateString('de-DE', { dateStyle: 'medium' })
})

const properties = usePropertyStore()
</script>
;
<template>
  <button class="interessent-list-item shadow rounded bg-white p-2 text-left">
    <span class="upper flex gap-2 mb-2">
      <span class="name text-lg flex-grow block">{{
        properties.interessentFullName(props.interessent)
      }}</span>
      <span class="last-edited text-sm flex items-center gap-1"
        ><icon:material-symbols:edit-calendar />{{ formattedDate }}</span
      >
    </span>
    <span class="lower flex justify-between gap-2">
      <span class="flex-shrink-0">
        <span class="property-interessenten py-1 px-2 bg-blue-200 text-xs rounded-lg">
          {{ interessent.status }}
        </span>
      </span>
      <a
        v-if="interessent.phone.length"
        :href="'tel:' + interessent.phone"
        class="p-2 bg-indigo-500 focus-visible:bg-indigo-400 hover:bg-indigo-400 transition-colors inline-block rounded-full text-white"
        @click.stop
        ><icon:material-symbols:call
      /></a>
    </span>

    <span v-if="interessent.notes.length > 0" class="notes text-gray-700 text-sm">
      <icon:material-symbols:notes class="inline" /> {{ interessent.notes }}
    </span>
  </button>
</template>

<style scoped></style>
