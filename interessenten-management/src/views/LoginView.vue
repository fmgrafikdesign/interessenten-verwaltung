<script setup>


import {onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {getCurrentUser} from "vuefire";
import Button from "@/components/Button.vue";
import {GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const router = useRouter();
const route = useRoute();

onMounted(async () => {
    const currentUser = await getCurrentUser()
    if (currentUser) {
        const to =
            route.query.redirect && typeof route.query.redirect === 'string'
                ? route.query.redirect
                : '/'

        await router.push(to);
    }
})

const login = async () => {
    const auth = getAuth();
    auth.useDeviceLanguage();

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(() => {
            router.push({ name: 'index' });
        }).catch(() => {
    });
}
</script>

<template>
  <div class="login-page flex flex-col gap-4 px-6 justify-center h-full text-center">
      <p>Bitte melde dich an, um fortzufahren:</p>
    <Button class="max-w-lg mx-auto" @click="login">Anmelden</Button>
  </div>
</template>

<style scoped>

</style>