<template>
    <v-btn :icon="theme.global.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        :title="theme.global.name.value === 'dark' ? 'Turn on a light theme' : 'Turn on the dark theme'"
        @click="toggleTheme" />
</template>

<script setup lang="ts">
import { useTheme } from 'vuetify'

const theme = useTheme()

function toggleTheme() {
    const newTheme = theme.global.current.value.dark ? 'light' : 'dark'
    theme.global.name.value = newTheme
    localStorage.setItem('theme', newTheme)
}

</script>