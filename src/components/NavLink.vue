<script setup lang="ts">
import { ref } from 'vue';

const isHovered = ref(false);

defineProps<{ to: string }>();
</script>

<template>
  <div class="wrapper">
    <router-link class="link" :to="to" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <slot></slot>
    </router-link>
    <div>
      <svg width="696" height="46" viewBox="0 0 696 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 3C74.5 3 48.5 43 106.5 43C157.5 43 153 3 198 3C243 3 255 43 301.5 43C348 43 349.5 3 391 3C432.5 3 452 43 501 43C556 43 533.5 3 596.5 3C646.9 3 657.5 43 695.5 43"
          stroke-width="5"
          :stroke="isHovered ? 'var(--accent-primary)' : 'transparent'"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
}

.link {
  text-decoration: none;
  color: var(--text);
  font-family: var(--font);
  padding: 0.5rem;

  transition: color 0.25s;
}

.link:hover {
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}

svg {
  position: absolute;
  width: 100%;
  top: 1.2rem;
  height: 1rem;
}

path {
  stroke-width: 10px;
  /* stroke-dasharray: 696px;
  stroke-dashoffset: 696px; */
  transition: stroke 0.25s;
}
</style>
