import { defineStore } from "pinia";
import { ref } from "vue";

export const useSnackbarStore = defineStore('snackbar', () => {
  const snack = ref(null);

  function showSnackbar(snackData) {
    snack.value = snackData;

    setTimeout(() => snack.value = null, 3000);
  }

  return {
    snack,
    showSnackbar,
  }
})