<template>
  <div :class="getGameDifficulty()">
    <header class="game-header">
      <div class="controls">
        <div class="timer">⏳ Время: 00:00</div>
        <div class="flags-counter">🚩 Флажки: 10</div>
      </div>
      <div class="actions">
        <router-link to="/" class="btn restart-btn" @click="useStore.cleanStore()">🔄 Перезапуск</router-link>
        <router-link to="/" class="btn settings-btn">⚙️ Настройки</router-link>
      </div>
    </header>
    <main>
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div v-if="useStore.gameStatus" class="loser">
            LOSER
        </div>
        <div v-for="(row, rowIndex) in Array(useStore.rows || 8).fill(0)"  :style="{display: 'flex', flexDirection: 'row'}">
          <div v-for="(cell, colIndex) in Array(useStore.columns || 8).fill(0)" class="cell" @click="selectPlace(rowIndex, colIndex)" >
            {{ checkPlace(rowIndex, colIndex) }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>

import { ref } from 'vue';
import { useUserStore } from '../../store.js';
import { onMounted } from 'vue';

const useStore = useUserStore();

onMounted(() => {
  if(!useStore.difficulty){
    useStore.setDifficulty(8,'easy')
  }
})
const handleRestart = () => {
  // Очищаем хранилище
  useStore.cleanStore();

  // Переходим на главную страницу
  router.push('/');
};

const selectPlace = (rowIndex, colIndex) => { //Выбор клетки
  if(useStore.gameStatus){
    return
  }
  useStore.setDangerPlace(rowIndex, colIndex)
};
function checkPlace(rowIndex, colIndex){
  if(this.checkValue(rowIndex, colIndex) && this.checkBomb(rowIndex, colIndex)){
    useStore.gameStatus = 'Lose'
    return useStore.cells[useStore.findIndex(rowIndex, colIndex)].bomb
  } else if(this.checkValue(rowIndex, colIndex) && this.checkDanger(rowIndex, colIndex)){
    return useStore.cells[useStore.findIndex(rowIndex, colIndex)].danger
} else {return useStore.cells[useStore.findIndex(rowIndex, colIndex)].value}
}

function checkBomb(rowIndex, colIndex){ //Проверка есть ли бомба
  return useStore.cells[useStore.findIndex(rowIndex, colIndex)].bomb
};
function checkValue(rowIndex, colIndex){ //Проверка открыта ли ячейка
  return useStore.cells[useStore.findIndex(rowIndex, colIndex)].value
};
function checkDanger(rowIndex, colIndex){
  return useStore.cells[useStore.findIndex(rowIndex, colIndex)].danger
}

function getGameDifficulty() {
  switch (useStore.difficulty) {
    case 'easy':
      return 'game-container-easy-medium'
      break;
    case 'medium':
      return 'game-container-easy-medium'
      break;
    case 'hard':
      return 'game-container-hard'
      break;
  }
}
</script>

<style scoped>
/* Общие стили */
.game-container-easy-medium {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
}
.game-container-hard {
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  min-width: fit-content;
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  gap: 20px;
  font-size: 1.2rem;
  color: #333;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.restart-btn {
  background-color: #4caf50;
  color: white;
}

.restart-btn:hover {
  background-color: #43a047;
  transform: scale(1.05);
}

.settings-btn {
  background-color: #007bff;
  color: white;
}

.settings-btn:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

/* Игровое поле */
.game-board {
  display: flex;
  justify-content: center;
}

.cell {
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.cell:hover {
  background-color: #d1d1d1;
}

/* Адаптивность */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(8, 30px);
    grid-template-rows: repeat(8, 30px);
  }

  .cell {
    width: 30px;
    height: 30px;
  }
}
.loser {
  position: fixed;
    color: red;
    font-size: 50px;
}
</style>