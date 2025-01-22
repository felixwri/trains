<template>
  <div id="target" ref="target"></div>
  <div id="title"></div>
</template>

<style>
#target {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;

  transition: opacity 1s ease;
}

#title {
  position: absolute;
  top: 5rem;
  left: 2rem;
  font-size: 2rem;
}

.title-button {
  border-radius: 15px;
  border: none;
  background-color: var(--accent-primary);
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  color: var(--text-inverted);
  cursor: pointer;
  display: flex;
  align-items: center;

  height: 2rem;

  transition: background-color 0.25s;
}

#GitHub-button {
  background-color: var(--grey);
}

.button-text {
  margin-left: 0.5rem;
}

#contact-button:hover {
  background-color: var(--accent-secondary);
}

.button-wrapper {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

@media screen and (max-width: 550px) {
  #title {
    font-size: 1rem;
  }

  .title-button {
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
  }
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { MainScene } from '@/scripts/scene';
import MailIcon from '@/components/icons/MailIcon.vue';
import GitHubIcon from '@/components/icons/GitHubIcon.vue';

const target = ref();

const main = new MainScene();

onMounted(() => {
  const renderer = main.init();
  target.value.appendChild(renderer.domElement);
  main.showScene(target.value);
});
</script>
