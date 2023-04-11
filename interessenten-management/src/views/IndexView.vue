<script setup lang="ts">
import SearchBar from "@/components/SearchBar.vue";
import {computed, ref} from "vue";
import PropertyListItem from "@/components/PropertyListItem.vue";
import {usePropertyStore} from "@/stores/property-store";
import type {Immobilie} from "@/stores/property-store";
import Button from "@/components/Button.vue";
import {useRouter} from "vue-router";

const search = ref('');
const properties = usePropertyStore();
const filteredProperties = computed(() => properties.all
    .filter(property => property.name.toUpperCase().includes(search.value.toUpperCase())));

const sortedProperties = computed(() => filteredProperties.value.sort((a, b) => {
    const first = a.name.toUpperCase();
    const second = b.name.toUpperCase();
    return (first < second) ? -1 : (first > second) ? 1 : 0;
}))

const router = useRouter();

const createNewProperty = () => {
    const property = properties.addProperty();
    goToProperty(property);
}

function goToProperty(property: Immobilie) {
    return router.push({
        name: 'property',
        params: {
            propertyId: property.id,
        },
    })
}
</script>

<template>
    <main class="w-full flex flex-col h-full">
        <div class="search-bar-section p-4 border-b border-b-gray-300">
            <SearchBar v-model="search" placeholder="Nach Immobilie suchen..."></SearchBar>
        </div>

        <div class="property-list flex-grow bg-gray-200 flex flex-col px-2">
            <template v-if="sortedProperties.length">
                <PropertyListItem v-for="property in sortedProperties"
                                  :property="property"
                                  @click="goToProperty(property)"
                                  class="mt-2"
                />
            </template>
            <template v-else>
                <p class="text-center text-lg p-2">
                    <template v-if="!search.length">
                        Hier erscheinen deine Immobilien
                    </template>
                    <template v-else>
                        Keine Immobilien mit diesen Kriterien
                    </template>
                </p>
            </template>
        </div>

        <div class="add-property-section border-t p-4 border-t-gray-300">
            <Button @click="createNewProperty">Immobilie anlegen</Button>
        </div>
    </main>
</template>
