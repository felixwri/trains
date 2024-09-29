<template>
  <div id="target" ref="target"></div>
</template>

<style>
#target {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import { MainScene } from '@/scripts/scene';

const target = ref();

const main = new MainScene();

const renderer = main.init();

onMounted(() => {
  target.value.appendChild(renderer.domElement);
  main.animate();
});
</script>
