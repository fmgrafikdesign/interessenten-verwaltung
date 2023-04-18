<template>
  <teleport to="#app">
    <transition name="slide-fade">
      <div v-if="snackbar.snack" class="snackbar bg-green-500" v-bind="$attrs">
        <p>{{ snackbar.snack.text }}</p>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { useSnackbarStore } from "@/stores/snackbar-store";

const snackbar = useSnackbarStore();
</script>

<style>
.snackbar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  box-shadow: 0 12px 28px rgba(0,0,0,0.20), 0 15px 12px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  padding: 8px 16px 8px 8px;
  z-index: 10;
  color: white;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-50%) translateY(-10px);
  opacity: 0;
}
</style>
