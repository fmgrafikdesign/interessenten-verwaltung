<script setup>
import Input from "@/components/Input.vue";
import {useRouter} from "vue-router";
import {computed} from "vue";
import {InteressentenStatus, usePropertyStore} from "@/stores/property-store";
import { useSnackbarStore } from "@/stores/snackbar-store";

const props = defineProps({
    propertyId: {
        required: true,
        type: String,
    },
    interessentenId: {
        required: true,
        type: String,
    },
})

const properties = usePropertyStore();

const router = useRouter();
const property = computed(() => properties.all
    .find(propertyToCheck => props.propertyId === propertyToCheck.id));
const interessent = computed(() => property.value.interessenten.find(interessent => interessent.id === props.interessentenId))

const removeInteressent = () => {
    router.back();
    properties.deleteInteressent(property, interessent)
}

// Update Interessenten last edited on changes to interessent
properties.$subscribe((mutation) => {
    if (mutation.events.target?.lastEdited) {
        mutation.events.target.lastEdited = new Date();
    }
})

const snackbar = useSnackbarStore();
const saveProperty = async () => {
    await properties.persistProperty(property);
    snackbar.showSnackbar({
        text: 'Interessent gespeichert!',
    })
}
</script>

<template>
    <div class="interessent-view w-full flex flex-col h-full">

        <div class="top-navigation flex justify-between p-2 border-b border-b-gray-300">
            <button class="back-button" @click="router.back()">
                ◀ Zurück
            </button>
            <h1 class="text-xl">Interessent</h1>
            <button class="save-button" @click="saveProperty">
                Speichern 💾
            </button>
        </div>

        <div class="interessent-content flex-grow bg-gray-200 flex flex-col px-2 pt-4">
            <template v-if="interessent">
                <div class="grid grid-cols-2 gap-2 mb-4">

                    <Input v-model="interessent.firstName" placeholder="Vorname"></Input>
                    <Input v-model="interessent.surname" placeholder="Nachname"></Input>

                    <Input v-model="interessent.phone" placeholder="Telefonnummer" class="col-span-2"></Input>
                    <Input v-model="interessent.notes" placeholder="Notizen" class="col-span-2"></Input>

                </div>
                <div class="interessent-status flex flex-col gap-1">
                    <h3 class="text-lg">Status: {{ interessent.status }}</h3>
                    <div v-for="(value, key) in InteressentenStatus"
                         class="radio flex items-center py-1 gap-2">
                        <input type="radio" v-model="interessent.status" :id="key" :value="value"
                               class="rounded-full w-4 h-4"/>
                        <label :for="key">{{ value }}</label>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>

</style>