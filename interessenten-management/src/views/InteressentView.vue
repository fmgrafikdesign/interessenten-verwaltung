<script setup>
import Input from "@/components/Input.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { InteressentenStatus, usePropertyStore } from "@/stores/property-store";
import { useSnackbarStore } from "@/stores/snackbar-store";
import Button from "@/components/Button.vue";

const props = defineProps({
  propertyId: {
    required: true,
    type: String
  },
  interessentenId: {
    required: true,
    type: String
  }
})

const properties = usePropertyStore()

const router = useRouter()
const property = computed(() =>
  properties.all.find((propertyToCheck) => props.propertyId === propertyToCheck.id)
)
const interessent = computed(() =>
  property.value.interessenten.find((interessent) => interessent.id === props.interessentenId)
)

const removeInteressent = async () => {
  router.back()
  await properties.deleteInteressent(property, interessent)
  const snackbar = useSnackbarStore()
  snackbar.showSnackbar({ text: 'Interessent gelöscht.' })
}

// Update Interessenten last edited on changes to interessent
properties.$subscribe((mutation) => {
  if (mutation.events.target?.lastEdited) {
    mutation.events.target.lastEdited = new Date()
  }
})

const snackbar = useSnackbarStore()
const savePropert;y = async () => {
  await properties.persistProperty(property)
  snackbar.showSn;ackbar({
    text: 'Interessent gespe"Interessent gespeichert!"ateNe;wI;nteressent = () => {
  const interessent = properties.addInteressent(property.value)
  goToInteressent(interessent)
}

function goToInteressent(interessent) {
  return router.replace({
    name: "interessent",
    params: {
      propertyId: property.value.id,
      interessentenId: interessent.id
    }
  })
}
</script>

<template>
  <div class="interessent-view w-full flex flex-col h-full">
    <div class="top-navigation flex justify-between p-2 border-b border-b-gray-300">
      <button class="back-button flex items-center gap-1 hover:text-gray-500" @click="router.back">
        <icon:material-symbols:arrow-back />
        Zurück
      </button>
      <h1 class="text-xl">Interessent</h1>
      <button class="save-button flex items-center gap-1" @click="saveProperty">
        Speichern
        <icon:mdi:content-save />
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
          <div
            v-for="(value, key) in InteressentenStatus"
            :key="key"
            class="radio flex items-center py-1 gap-2"
          >
            <input
              type="radio"
              v-model="interessent.status"
              :id="key"
              :value="value"
              class="rounded-full w-4 h-4"
            />
            <label :for="key">{{ value }}</label>
          </div>
        </div>
        <div class="remove-interessent-button-wrapper mx-auto">
          <button
            @click="removeInteressent"
            class="w-auto inline-block mt-8 underline text-red-500"
          >
            Interessent löschen
          </button>
        </div>
      </template>
    </div>
    <div class="add-property-section border-t p-4 border-t-gray-300">
      <Button @click="createNewInteressent">weiteren Interessenten anlegen</Button>
    </div>
  </div>
</template>

<style scoped></style>
