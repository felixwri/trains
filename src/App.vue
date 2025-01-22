<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavView from './components/NavView.vue';
</script>

<template>
  <header>
    <title>This</title>
    <NavView />
  </header>

  <RouterView />
</template>

<style scoped></style>
