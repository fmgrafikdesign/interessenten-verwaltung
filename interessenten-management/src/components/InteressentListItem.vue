<script lang="ts" setup>
import type {Interessent} from "@/stores/property-store";
import {usePropertyStore} from "@/stores/property-store";
import {computed} from "vue";

interface Props {
    interessent: Interessent,
}

const props = defineProps<Props>();
const formattedDate = computed(() => {
    let date;
    if (props.interessent.lastEdited.seconds) {
        date = new Date(props.interessent.lastEdited.toDate());
    } else {
        date = new Date(props.interessent.lastEdited);
    }
    return date.toLocaleDateString('de-DE', {dateStyle: 'medium'})
})

const properties = usePropertyStore();
</script>

<template>
    <button class="interessent-list-item shadow rounded bg-white p-2 text-left">
        <span class="upper flex gap-2">
            <span class="name text-lg flex-grow block mb-2">{{
                properties.interessentFullName(props.interessent)
                }}</span>
            <span class="last-edited text-sm">🖊 {{ formattedDate }}</span>
        </span>
        <span class="lower flex justify-between">
            <span>
        <span class="property-interessenten py-1 px-2 bg-blue-200 text-xs rounded-lg">
          {{ interessent.status }}

      </span>
            </span>
            <a class="p-2" v-if="interessent.phone.length" :href="'tel:' + interessent.phone">📞</a>
        </span>


        <span class="notes text-gray-700 text-sm" v-if="interessent.notes.length > 0">
            📒 {{ interessent.notes }}
        </span>

    </button>
</template>

<style scoped>

</style>