<script setup lang="ts">
import { RouterView } from 'vue-router'
import {usePropertyStore} from "@/stores/property-store";

// Pinia storage persist
const properties = usePropertyStore();
properties.$subscribe((mutation, state) => {

    localStorage.setItem('cart', JSON.stringify(state))
})
</script>

<template>
  <RouterView />
</template>

<style>
html, body {
    height: 100%;
}
</style>
