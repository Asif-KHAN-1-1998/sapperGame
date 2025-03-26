<template>
  <div class="settings">
    <h1 v-if="useStore.nickName">{{ useStore.nickName }}, выберите уровень сложности </h1>
    <h1 v-else> Выберите уровень сложности </h1>
    <DifficultyCard />
    <StartParameters />
  </div>
</template>

<script setup>
  import { useUserStore } from '../../store.js';
  import DifficultyCard from '../DifficultyCard/index.vue';
  import StartParameters from '../StartParameters/index.vue';

  const useStore = useUserStore();
</script>

<style scoped>
.settings {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 50px auto;
}

h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}
</style>