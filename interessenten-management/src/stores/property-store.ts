import {defineStore} from "pinia";
import {computed, unref} from "vue";
import type { Ref } from "vue";
import {useLocalStorage} from "@vueuse/core";
import { v4 as uuidv4 } from 'uuid';

export enum InteressentenStatus {
    Angefragt = 'Angefragt',
    NichtErreicht1 = 'Nicht Erreicht (1)',
    NichtErreicht2 = 'Nicht Erreicht (2)',
    NichtErreicht3 = 'Nicht Erreicht (3)',
    DigitalKontaktiert = 'Digital Kontaktiert',
    KeineBesichtigungGeplant = 'Keine Besichtigung geplant',
    BesichtigungVereinbart = 'Besichtigung Vereinbart',
    BesichtigungErfolgt = 'Besichtigung Erfolgt',
    ZweiteBesichtigungErfolgt = 'Zweite Besichtigung Erfolgt',
    Interessiert = 'Interessiert',
    Kaufwunsch = 'Kaufwunsch',
}

export const interessiertStatus = [
    InteressentenStatus.BesichtigungVereinbart,
    InteressentenStatus.BesichtigungErfolgt,
    InteressentenStatus.ZweiteBesichtigungErfolgt,
    InteressentenStatus.Interessiert,
    InteressentenStatus.Kaufwunsch,
]

export interface Interessent {
    firstName: string,
    surname: string,
    lastEdited: Date,
    notes: string,
    phone: string,
    status: InteressentenStatus,
    id: string,
}

export interface Immobilie {
    id: string,
    name: string,
    interessenten: Interessent[],
}


export const usePropertyStore = defineStore('properties', () => {
    //const properties = ref<Immobilie[]>([]);
    const properties = useLocalStorage<Immobilie[]>('properties', []);

    const interessiert = computed(() => (immobilie: Immobilie) => {
        return immobilie.interessenten.filter(interessent => interessiertStatus.includes(interessent.status)).length;
    })

    const addProperty = (property?: any) => {
        properties.value.push({
            name: '',
            interessenten: [],
            ...property,
            id: uuidv4(),
        });
        return properties.value[properties.value.length - 1];
    }

    const removeProperty = (propertyToRemove: Immobilie | Ref<Immobilie>) => {
        const index = properties.value.findIndex(property => property.id === unref(propertyToRemove).id);
        if (index !== -1) properties.value.splice(index, 1);
    }

    const addInteressent = (property: Immobilie) => {
        property.interessenten.push({
            firstName: "", lastEdited: new Date(), notes: "", phone: "", status: InteressentenStatus.Angefragt, surname: "",
            id: uuidv4(),
        });
        return property.interessenten[property.interessenten.length - 1];
    }

    const interessentFullName = computed(() => (interessent: Interessent) => {
        return interessent.surname + ', ' + interessent.firstName;
    });

    const deleteInteressent = (property: Immobilie | Ref<Immobilie>, interessent: Interessent | Ref<Interessent>) => {
        const index = unref(property).interessenten.findIndex(propertyInteressent => propertyInteressent.id === unref(interessent).id )
        if (index !== -1) unref(property).interessenten.splice(index, 1);
    }

    return {
        all: properties,
        interessiert,
        addProperty,
        interessentFullName,
        addInteressent,
        deleteInteressent,
        removeProperty,
    }
})
