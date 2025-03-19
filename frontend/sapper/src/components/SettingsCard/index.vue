<template>
  <div class="settings">
    <h1>Выберите уровень сложности</h1>
    <div class="difficulty-options">
      <button @click="useStore.setDifficulty(64, 'easy')" class="btn easy">
        Простой (8x8, 10 мин)
      </button>
      <button @click="useStore.setDifficulty(256, 'medium')" class="btn medium">
        Средний (16x16, 40 мин)
      </button>
      <button @click="useStore.setDifficulty(512, 'hard')" class="btn hard">
        Сложный (32x16, 100 мин)
      </button>
    </div>
    <div v-if="useStore.difficulty">
      <p class="selected-level">Выбранный уровень: {{ useStore.difficulty }}</p>
      <router-link to="/game" class="start-game-btn">Начать игру</router-link>
    </div>
    <div v-else style="margin-top: 10px;">
        ВЫБЕРИТЕ УРОВЕНЬ
    </div>
  </div>
</template>

<script setup>
  import { useUserStore } from '../../store.js';
  import { onMounted } from 'vue';
  const useStore = useUserStore();
  onMounted(() => {
      if(!useStore.difficulty){
        console.log('worked')
        useStore.setDifficulty(64, 'easy')
      }
  })
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

.difficulty-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.easy {
  background-color: #4caf50; /* Зеленый */
}

.medium {
  background-color: #ff9800; /* Оранжевый */
}

.hard {
  background-color: #f44336; /* Красный */
}

.selected-level {
  margin-top: 20px;
  font-size: 18px;
  color: #555;
}

.start-game-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff; /* Синий */
  text-decoration: none;
  border-radius: 5px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.start-game-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>