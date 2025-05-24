<template>
  <v-app>
    <v-app-bar color="primary" elevation="1">
      <v-container class="mx-auto d-flex align-center justify-center" max-width="1200">
        <div class="text-decoration-none text-white text-h5 me-4 d-flex align-center">
          <img src="/src/assets/logo.png" alt="Editson Logo" height="36" class="me-2">
          Editson
        </div>
        <v-spacer />
        <ThemeToggle class="ms-4" />
      </v-container>
    </v-app-bar>
    <v-main>
      <v-container max-width="1300">
        <JsonFileForm />
      </v-container>
    </v-main>
    <v-footer color="primary" height="44" app>
      <div class="flex-1-0-100 text-center">
        © {{ new Date().getFullYear() }} Editson - All rights reserved
      </div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'
import { onMounted } from 'vue'
import JsonFileForm from './components/JsonFileForm.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const theme = useTheme()

const getSystemTheme = (): string => {
  if (typeof window !== "undefined" && window.matchMedia) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  }
  return "light";
};

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    theme.global.name.value = savedTheme
  } else {
    theme.global.name.value = getSystemTheme()
  }
})
//
</script>
