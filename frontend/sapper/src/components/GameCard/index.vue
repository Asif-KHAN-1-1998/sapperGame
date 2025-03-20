<template>
  <div :class="getGameDifficulty()">
    <header class="game-header">
      <div class="controls">
        <div class="timer">⏳ Время: {{hours}}:{{ minutes }}:{{ seconds }}</div>
        <div class="flags-timeCounter">🚩 Флажки: 10 {{ useStore.gameStatus }}</div>
      </div>
      <div class="actions">
        <button class="btn restart-btn" @click="restartGame()">🔄 Перезапуск</button>
        <router-link to="/" class="btn settings-btn">⚙️ Настройки</router-link>
      </div>
    </header>
    <main>
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <div v-if="useStore.gameStatus == 'lose'" class="loser">
            LOSER
        </div>
        <div v-if="useStore.gameStatus == 'winner'" class="loser">
            WINNER
        </div>
        <div v-for="(row, rowIndex) in Array(useStore.rows).fill(0)"  :style="{display: 'flex', flexDirection: 'row'}">
          <div v-for="(cell, colIndex) in Array(useStore.columns).fill(0)" class="cell" @click="openCage(rowIndex, colIndex)" >
            {{ checkPlace(rowIndex, colIndex) }}
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
  import { useUserStore } from '../../store.js';
  import { ref, onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const useStore = useUserStore();

  let delay = 1000;
  let timeCounter = ref(0);
  let hours = ref(0)
  let minutes = ref(0)
  let seconds = ref(0)

  
  onMounted(() => {
    // useStore.setBombs()
  });
  const openedCages = computed(() => { //Отслеживаем количество открытых ячеек
    const filteredCells = useStore.cells.filter(item => item.value === '0')
    return filteredCells?.length
  })

  let timerId = setTimeout(function request() { //Секундомер
    hours.value = Math.floor(timeCounter.value / 3600);
    minutes.value = Math.floor((timeCounter.value % 3600) / 60);
    seconds.value = Math.floor(timeCounter.value % 60);
    if (useStore.gameStatus === 'lose' || useStore.gameStatus === 'winner') {
      if (useStore.gameStatus === 'winner') {
        useStore.setTime(hours, minutes, seconds);
        return
      }
      return
    }
    timeCounter.value++;
    timerId = setTimeout(request, delay);
  }, delay);

  const openCage = (rowIndex, colIndex) => { //Кликаем по клетке
    if(useStore.gameStatus === 'lose' || useStore.gameStatus === 'winner') return 
    useStore.setDangerPlace(rowIndex, colIndex)
    if(openedCages.value == 10){
      useStore.setGameStatus('winner')
      }
 
  };

  const restartGame = () => {//перезапуск игры + очистка store, localStore
    useStore.cleanStore();
    router.push('/');
}

  const checkPlace = (rowIndex, colIndex) => { // выводим значения клеток
    if (checkBomb(rowIndex, colIndex)){
      useStore.setGameStatus('lose')
      return checkBomb(rowIndex, colIndex)
    } else {      
      return checkDanger(rowIndex, colIndex)
    }
  }

  const checkBomb = (rowIndex, colIndex) =>  //Проверка есть ли бомба
    useStore.cells[useStore.findIndex(rowIndex, colIndex)].bomb;
  const checkDanger = (rowIndex, colIndex) => //Проверка коэффициента опасности
    useStore.cells[useStore.findIndex(rowIndex, colIndex)].danger;

  const getGameDifficulty = () => {//Установка стиля для контейнера
    switch (useStore.difficulty) {
      case 'easy':
        return 'game-container-easy-medium'
      case 'medium':
        return 'game-container-easy-medium'
      case 'hard':
        return 'game-container-hard'
    }
  };

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