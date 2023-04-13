<script setup lang="ts">
import {useRouter} from "vue-router";
import Input from "@/components/Input.vue";
import {computed, ref} from "vue";
import {usePropertyStore} from "@/stores/property-store";
import type { Interessent} from "@/stores/property-store";
import SearchBar from "@/components/SearchBar.vue";
import InteressentListItem from "@/components/InteressentListItem.vue";
import Button from "@/components/Button.vue";
import { useSnackbarStore } from "@/stores/snackbar-store";

const props = defineProps({
    propertyId: {
        required: true,
        type: String,
    }
})

const router = useRouter()
const properties = usePropertyStore();

const property = computed(() => properties.all
    .find(propertyToCheck => props.propertyId === propertyToCheck.id));

const removeProperty = () => {
    router.push({
        name: 'index',
    });
    properties.removeProperty(property);
}

const searchCriteria = ref('');
const filteredInteressenten = computed(() => property.value.interessenten
    .filter(interessent => interessent.firstName.toUpperCase().includes(searchCriteria.value.toUpperCase())
    || interessent.surname.toUpperCase().includes(searchCriteria.value.toUpperCase())));

const sortedInteressenten = computed(() => filteredInteressenten.value.sort((a, b) => {
    const first = a.surname.toUpperCase();
    const second = b.surname.toUpperCase();
    return (first < second) ? -1 : (first > second) ? 1 : 0;
}))

const createNewInteressent = () => {
    const interessent = properties.addInteressent(property.value);
    goToInteressent(interessent);
}

function goToInteressent(interessent: Interessent) {
    return router.push({
        name: 'interessent',
        params: {
            propertyId: property.value.id,
            interessentenId: interessent.id,
        },
    })
}

const snackbar = useSnackbarStore();
const saveProperty = async () => {
    await properties.persistProperty(property);
    snackbar.showSnackbar({
        text: 'Immobilie gespeichert!',
    })
}
</script>

<template>
    <div class="property-view w-full flex flex-col h-full">
        <div class="top-navigation flex justify-between p-2 border-b border-b-gray-300">
            <button class="back-button" @click="router.push({ name: 'index' })">
                ◀ Zurück
            </button>
            <h1 class="text-xl">Immobilie</h1>
            <button class="save-button" @click="saveProperty">
                Speichern 💾
            </button>
        </div>

        <div class="property-content flex-grow bg-gray-200 flex flex-col px-2 pt-4">
            <template v-if="property">
                <div class="property-title">
                    <Input v-model="property.name" placeholder="Name der Immobilie"></Input>
                </div>

                <h2 class="text-center text-xl mt-4 mb-2">Interessenten</h2>
                <template v-if="property.interessenten.length">
                    <SearchBar v-model="searchCriteria" placeholder="Nach Interessenten suchen"/>
                    <template v-if="sortedInteressenten.length">
                    <div class="property-list flex-grow bg-gray-200 flex flex-col">
                        <InteressentListItem v-for="interessent in sortedInteressenten"
                                             :interessent="interessent"
                                             @click="goToInteressent(interessent)"
                                             class="mt-2"
                        />
                    </div>
                    </template>
                    <template v-else>
                        <p class="text-center mt-4">Keine Interessenten entsprechen diesen Kriterien</p>
                    </template>
                </template>
                <template v-else>
                    <p class="text-center text-lg p-2">Hier erscheinen deine Interessenten</p>
                </template>
            </template>
        </div>

        <div class="add-property-section border-t p-4 border-t-gray-300">
            <Button @click="createNewInteressent">Interessent anlegen</Button>
        </div>
    </div>
</template>
