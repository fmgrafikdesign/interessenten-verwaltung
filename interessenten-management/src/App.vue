<script setup lang="ts">
import { RouterView } from 'vue-router'
import Snackbar from "@/components/Snackbar.vue";
</script>

<template>
  <RouterView />
  <Snackbar/>
</template>

<style>
html, body {
    height: 100%;
}
</style>
