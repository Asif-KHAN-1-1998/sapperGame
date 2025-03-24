<template>
  <div :class="getGameDifficulty()">
    <header class="game-header">
      <div class="controls">
        <div  class="timer">Время: {{ timerPanel || '0:0:0' }}</div>
        <div class="flags-counter">Флажки: {{ useStore.mines - flags }}</div>
      </div>
      <div class="actions">
        <button class="btn restart-btn" @click="restartGame()">Перезапуск</button>
        <router-link to="/" class="btn settings-btn">Настройки</router-link>
      </div>
    </header>
    <main>
      <div class="game-board-container">
        <div v-if="useStore.gameStatus === 'lose'" class="loser">LOSER</div>
        <div v-if="useStore.gameStatus === 'winner'" class="winner">WINNER</div>
        <div v-for="(row, rowIndex) in Array(useStore.rows).fill(0)" :key="rowIndex" class="row">
          <div
            v-for="(cell, colIndex) in Array(useStore.columns).fill(0)"
            :key="colIndex"
            class="cell"
            @click="() => openCage(rowIndex, colIndex)"
            @contextmenu.prevent="handleRightClick(rowIndex, colIndex)"
          >
            <div v-if="checkValue(rowIndex, colIndex)" :class="selectColor(rowIndex, colIndex)">
              {{ checkBomb(rowIndex, colIndex) || checkDanger(rowIndex, colIndex) }}
            </div>
            <div v-if="checkFlag(rowIndex, colIndex)">
              {{ checkFlag(rowIndex, colIndex) }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { useUserStore } from '../../store.js';
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const useStore = useUserStore();
  let hours = ref(0)
  let minutes = ref(0)
  let seconds = ref(0)


  const openedCages = computed(() => {
      const filteredCells = useStore.cells.filter(item => item.value === '0')
      return filteredCells?.length
    })

  const flags = computed(() => {
    const filteredCells = useStore.cells.filter(cell => cell.flag === 'flag')
    return filteredCells?.length;
  });
    
  const timerPanel = computed(() => {
    if (useStore.timer) {
      hours.value = Math.floor(useStore.timer / 3600) || 0;
      minutes.value = Math.floor((useStore.timer % 3600) / 60) || 0;
      seconds.value = Math.floor(useStore.timer % 60) || 0;
      // useStore.setTimer(`${hours.value}:${minutes.value}:${seconds.value}`);
    return `${hours.value}:${minutes.value}:${seconds.value}`
    } else console.log('timer is empty')
    
  })


  const handleLose = () => {
    useStore.bombIndexesState?.forEach(item => {
    useStore.openBombs(item)
    })
  }

  const openCage = (rowIndex, colIndex) => {
    console.log(useStore.bombIndexesState)
    if (openedCages.value === 0) {useStore.setBombs(rowIndex, colIndex)}
    if (openedCages.value >= useStore.cells.length - useStore.mines) {
      useStore.setGameStatus('winner');
    };
    if (useStore.gameStatus === 'lose' || useStore.gameStatus === 'winner') return;
    useStore.setPlaceValue(rowIndex, colIndex)
    if (checkBomb(rowIndex, colIndex) === 'Bomb') {
      useStore.setGameStatus('lose');
      handleLose()
      return;
    }
    useStore.setPlaceValue(rowIndex, colIndex);
    if (checkDanger(rowIndex, colIndex) === 0){
      const data = useStore.findAroundPlaces(rowIndex, colIndex)
      data.forEach(item => {
        useStore.setPlaceValue(item['row'], item['col'])
      })
    }
  }

  const handleRightClick = (rowIndex, colIndex) => {
    if (useStore.gameStatus === 'lose' || useStore.gameStatus === 'winner') return;
    if (flags.value === useStore.mines){
      useStore.deletePlaceFlag(rowIndex, colIndex)
      return
    }
    useStore.setPlaceFlag(rowIndex, colIndex)
  }
    

  const restartGame = () => {
    useStore.cleanStore();
    router.push('/');
}

  const checkBomb = (rowIndex, colIndex) =>
    useStore.cells[useStore.findIndex(rowIndex, colIndex)].bomb;

  const checkValue = (rowIndex, colIndex) =>
    useStore.cells[useStore.findIndex(rowIndex, colIndex)].value;

  const checkFlag = (rowIndex, colIndex) =>
    useStore.cells[useStore.findIndex(rowIndex, colIndex)].flag;

  const checkDanger = (rowIndex, colIndex) =>
    useStore.cells[useStore.findIndex(rowIndex, colIndex)].danger;
    

  const getGameDifficulty = () => {
    switch (useStore.difficulty) {
      case 'easy':
        return 'game-container-easy-medium'
      case 'medium':
        return 'game-container-easy-medium'
      case 'hard':
        return 'game-container-hard'
    }
  };

  const selectColor = (rowIndex, colIndex) => {
  if(checkBomb(rowIndex, colIndex)){
    return ''
  }
  switch (checkDanger(rowIndex, colIndex)) {
    case 1:
      return 'blue';
    case 2:
      return 'green';
    case 3:
      return 'red';
    case 4:
      return '#002137';
    case 5:
      return 'brown';
    case 6:
      return '#30d5c8';
    case 7:
      return 'black'
    case 8:
      return 'white'
    default: ''
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

.game-board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.row {
  display: flex;
  flex-direction: row;
}

.cell {
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.cell:hover {
  background-color: #d1d1d1;
}

.loser,
.winner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  font-weight: bold;
}

.loser {
  color: red;
}

.winner {
  color: green;
}

/* Цвета для клеток с числами */
.blue {
  color: blue;
}

.green {
  color: green;
}

.red {
  color: red;
}

.dark-blue {
  color: #002137;
}

.brown {
  color: brown;
}

.cyan {
  color: #30d5c8;
}

.black {
  color: black;
}

.white {
  color: white;
}

@media (max-width: 768px) {
  .cell {
    width: 30px;
    height: 30px;
  }
}
</style>