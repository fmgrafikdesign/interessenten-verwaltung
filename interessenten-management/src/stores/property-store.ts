import { defineStore } from 'pinia'
import { computed, unref } from 'vue'
import type { MaybeRef } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { firestoreDefaultConverter, useCollection } from 'vuefire'
import { db } from '@/firebase'
import type { Timestamp } from 'firebase/firestore'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

export enum InteressentenStatus {
    Angefragt = 'Angefragt',
    OhneBesichtigungAbgesagt = 'Ohne Besichtigung abgesagt',
    NichtErreicht1 = 'Nicht Erreicht (1)',
    NichtErreicht2 = 'Nicht Erreicht (2)',
    NichtErreicht3 = 'Nicht Erreicht (3)',
    DigitalKontaktiert = 'Digital Kontaktiert',
    KeineBesichtigungGeplant = 'Keine Besichtigung geplant',
    BesichtigungVereinbart = 'Besichtigung Vereinbart',
    BesichtigungErfolgt = 'Besichtigung Erfolgt',
    ZweiteBesichtigungErfolgt = 'Zweite Besichtigung Erfolgt',
    Abgesagt = 'Abgesagt',
    Interessiert = 'Interessiert',
    Kaufwunsch = 'Kaufwunsch',
}

export const interessiertStatus = [
    InteressentenStatus.BesichtigungVereinbart,
    InteressentenStatus.BesichtigungErfolgt,
    InteressentenStatus.ZweiteBesichtigungErfolgt,
    InteressentenStatus.Interessiert,
    InteressentenStatus.Kaufwunsch
]

export interface Interessent {
    firstName: string,
    surname: string,
    lastEdited: Date | Timestamp,
    notes: string,
    phone: string,
    email: string,
    status: InteressentenStatus,
    id: string,
    isDeleted: boolean,
}

export interface Immobilie {
    id: string,
    name: string,
    created: Date | Timestamp,
    interessenten: Interessent[],
    isDeleted: boolean,
}


export const usePropertyStore = defineStore('properties', () => {
    const auth = getAuth()

    const propertiesRef = collection(db, 'properties/' + auth.currentUser?.uid + '/immobilien')
        .withConverter({
            fromFirestore(snapshot) {
                const data = firestoreDefaultConverter.fromFirestore(snapshot) as Immobilie
                // Don't use deleted interessenten
                data.interessenten = data.interessenten.filter(interessent => !interessent.isDeleted)
                return data
            },
            toFirestore: firestoreDefaultConverter.toFirestore
        })

    const allProperties = useCollection<Immobilie>(propertiesRef)
    // Filter out deleted properties
    const properties = computed(() => allProperties.value?.filter(property => !property.isDeleted) ?? [])
    const propertiesLoading = computed(() => allProperties.pending.value)

    const interessiert = computed(() => (immobilie: Immobilie) => {
        return immobilie.interessenten
            .filter(interessent => interessiertStatus.includes(interessent.status)).length
    })

    const addProperty = async (property?: any) => {
        const doc = await addDoc(propertiesRef, {
            name: '',
            created: new Date(),
            interessenten: [],
            ...property,
            id: uuidv4(),
            isDeleted: false
        })
        return doc.id
    }

    const removeProperty = async (propertyToRemove: MaybeRef<Immobilie>) => {
        const index = properties.value.findIndex(property => property.id === unref(propertyToRemove).id)
        if (index === -1) console.warn(`Property with id ${unref(propertyToRemove).id} does not exist and can not be removed`)
        const document = doc(propertiesRef, unref(propertyToRemove).id)
        await updateDoc(document, {
            isDeleted: true
        })
    }

    const persistProperty = async (propertyToPersist: MaybeRef<Immobilie>) => {
        const document = doc(propertiesRef, unref(propertyToPersist).id)
        await updateDoc(document, unref(propertyToPersist))
    }

    const addInteressent = (property: Immobilie) => {
        property.interessenten.push({
            firstName: '',
            lastEdited: new Date(),
            notes: '',
            phone: '',
            email: '',
            status: InteressentenStatus.Angefragt,
            surname: '',
            id: uuidv4(),
            isDeleted: false
        })
        return property.interessenten[property.interessenten.length - 1]
    }

    const interessentFullName = computed(() => (interessent: Interessent) => {
        return interessent.surname + ', ' + interessent.firstName
    })

    const deleteInteressent = async (property: MaybeRef<Immobilie>, interessent: MaybeRef<Interessent>) => {
        const index = unref(property).interessenten.findIndex(propertyInteressent => propertyInteressent.id === unref(interessent).id)
        if (index === -1) console.warn(`Interessent with id ${unref(interessent).id} does not exist on property and can not be removed`)
        unref(property).interessenten[index].isDeleted = true
        const document = doc(propertiesRef, unref(property).id)
        await updateDoc(document, unref(property))
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
        propertiesLoading
    }
})
