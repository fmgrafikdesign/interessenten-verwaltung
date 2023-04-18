<script lang='ts' setup>
import { useRouter } from 'vue-router'
import Input from '@/components/Input.vue'
import { computed, ref } from 'vue'
import type { Interessent } from '@/stores/property-store'
import { usePropertyStore } from '@/stores/property-store'
import SearchBar from '@/components/SearchBar.vue'
import InteressentListItem from '@/components/InteressentListItem.vue'
import Button from '@/components/Button.vue'
import { useSnackbarStore } from '@/stores/snackbar-store'

const props = defineProps({
    propertyId: {
        required: true,
        type: String
    }
})

const router = useRouter()
const properties = usePropertyStore()

const property = computed(() =>
    properties.all.find((propertyToCheck) => props.propertyId === propertyToCheck.id)
)

const removeProperty = async () => {
    router.push({
        name: 'index'
    })
    await properties.removeProperty(property)
    const snackbar = useSnackbarStore()
    snackbar.showSnackbar({ text: 'Immobilie gelöscht.' })
}

const searchCriteria = ref('')
const filteredInteressenten = computed(() =>
    property.value.interessenten
        .filter(
            (interessent) =>
                interessent.firstName.toUpperCase().includes(searchCriteria.value.toUpperCase()) ||
                interessent.surname.toUpperCase().includes(searchCriteria.value.toUpperCase())
        )
        .sort((a, b) => {
            const first = a.surname.toUpperCase()
            const second = b.surname.toUpperCase()
            return first < second ? -1 : first > second ? 1 : 0
        })
)

const createNewInteressent = () => {
    const interessent = properties.addInteressent(property.value)
    goToInteressent(interessent)
}

function goToInteressent(interessent: Interessent) {
    return router.push({
        name: 'interessent',
        params: {
            propertyId: property.value.id,
            interessentenId: interessent.id
        }
    })
}

const snackbar = useSnackbarStore()
const saveProperty = async () => {
    await properties.persistProperty(property)
    snackbar.showSnackbar({ text: 'Immobilie gespeichert!' })
}
</script>

<template>
    <div class='property-view w-full flex flex-col h-full'>
        <div class='top-navigation flex justify-between p-2 border-b border-b-gray-300'>
            <button
                class='back-button flex items-center gap-1 hover:text-gray-500'
                @click="router.push({ name: 'index' })"
            >
                <icon-material-symbols:arrow-back />
                Zurück
            </button>
            <h1 class='text-xl'>Immobilie</h1>
            <button class='save-button flex items-center gap-1 hover:text-gray-500' @click='saveProperty'>
                Speichern
                <icon-mdi:content-save />
            </button>
        </div>

        <div class='property-content flex-grow bg-gray-200 flex flex-col px-2 pt-4'>
            <template v-if='property'>
                <div class='property-title'>
                    <Input v-model='property.name' placeholder='Name der Immobilie'></Input>
                </div>

                <div class='interessenten-section flex-grow'>
                    <h2 class='text-center text-xl mt-4 mb-2'>Interessenten</h2>
                    <template v-if='property.interessenten.length'>
                        <SearchBar v-model='searchCriteria' placeholder='Nach Interessenten suchen' />
                        <template v-if='filteredInteressenten.length'>
                            <div class='property-list flex-grow bg-gray-200 flex flex-col'>
                                <InteressentListItem
                                    v-for='interessent in filteredInteressenten'
                                    :key='interessent.id'
                                    :interessent='interessent'
                                    class='mt-2'
                                    @click='goToInteressent(interessent)'
                                />
                            </div>
                        </template>
                        <template v-else>
                            <p class='text-center mt-4'>Keine Interessenten entsprechen diesen Kriterien</p>
                        </template>
                    </template>
                    <template v-else>
                        <p class='text-center text-lg p-2'>Hier erscheinen deine Interessenten</p>
                    </template>
                </div>
                <div class='remove-property-button-wrapper mx-auto'>
                    <button class='w-auto inline-block mb-8 underline text-red-500' @click='removeProperty'>
                        Immobilie löschen
                    </button>
                </div>
            </template>
        </div>

        <div class='add-property-section border-t p-4 border-t-gray-300'>
            <Button @click='createNewInteressent'>Interessent anlegen</Button>
        </div>
    </div>
</template>
