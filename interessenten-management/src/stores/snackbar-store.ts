import { defineStore } from "pinia";
import { ref } from "vue";

interface SnackbarData {
  text: string,
}
export const useSnackbarStore = defineStore('snackbar', () => {
  const snack = ref<SnackbarData | undefined>(undefined);

  function showSnackbar(snackData: SnackbarData) {
    snack.value = snackData;

    setTimeout(() => snack.value = undefined, 3000);
  }

  return {
    snack,
    showSnackbar,
  }
})
