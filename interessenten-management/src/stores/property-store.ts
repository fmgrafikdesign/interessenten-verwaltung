import {defineStore} from "pinia";
import {computed, unref} from "vue";
import type { MaybeRef } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';
import {useCollection} from "vuefire";
import {db} from "@/firebase";
import {addDoc, updateDoc, doc, collection} from "firebase/firestore";
import {getAuth} from "firebase/auth";

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
    // const propertiesFromLocalStorage = useLocalStorage<Immobilie[]>('properties', []);
    const auth = getAuth();

    const propertiesRef = collection(db, 'properties/' + auth.currentUser?.uid + '/immobilien');

    const properties = useCollection(propertiesRef);

    const interessiert = computed(() => (immobilie: Immobilie) => {
        return immobilie.interessenten.filter(interessent => interessiertStatus.includes(interessent.status)).length;
    })

    const addProperty = async (property?: any) => {
        const doc = await addDoc(propertiesRef, {
            name: '',
            interessenten: [],
            ...property,
            id: uuidv4(),
        });
        return properties.value[properties.value.length - 1];
    }

    const removeProperty = (propertyToRemove: MaybeRef<Immobilie>) => {
        const index = properties.value.findIndex(property => property.id === unref(propertyToRemove).id);
        if (index !== -1) properties.value.splice(index, 1);
    }

    const persistProperty = async (propertyToPersist: MaybeRef<Immobilie>) => {
        const d = doc(propertiesRef, unref(propertyToPersist).id);
        await updateDoc(d, unref(propertyToPersist));
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

    const deleteInteressent = (property: MaybeRef<Immobilie>, interessent: MaybeRef<Interessent>) => {
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
        persistProperty,
    }
})
