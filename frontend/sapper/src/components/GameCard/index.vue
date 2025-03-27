<template>
  <div :class="getGameDifficulty()">
    <HeaderCard />
    <main>
      <div class="game-board-container">
        <div v-if="useStore.gameStatus !== 'gaming'" class="end-game">{{useStore.gameStatus}}</div>
        <div v-for="(row, rowIndex) in Array(useStore.rows).fill(0)" 
            :key="rowIndex" 
            class="row">
          <div
            v-for="(cell, colIndex) in Array(useStore.columns).fill(0)"
            :key="colIndex"
            class="cell"
            @click="() => {openCage(rowIndex, colIndex),  checkWinner()}"
            @contextmenu.prevent="handleRightClick(rowIndex, colIndex)"
          >
            <div :style="{color: selectColor(rowIndex, colIndex)}">
              {{ showCageValue(rowIndex, colIndex) }}
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { useUserStore } from '../../store.js';
  import HeaderCard from '../HeaderCard/index.vue';

  const useStore = useUserStore();
    
  const showCageValue = (rowIndex, colIndex) => {
    if (checkValue(rowIndex, colIndex).bomb && checkValue(rowIndex, colIndex).value) return checkValue(rowIndex, colIndex).bomb
    return (checkValue(rowIndex, colIndex).flag) || (checkValue(rowIndex, colIndex).danger)
  }

  const handleLose = () => {
    useStore.bombIndexesState?.forEach(item => {
    useStore.openBombs(item)
    })
  }

  const checkWinner = () => {
    if (useStore.getOpenedCages >= (useStore.cells.length - useStore.mines)) {
      useStore.setGameStatus('winner');
    };
    return
  }
  const openCage = (rowIndex, colIndex) => {
    if (useStore.getOpenedCages === 0) {useStore.setBombs(rowIndex, colIndex)}
    if (useStore.gameStatus === 'loser' || useStore.gameStatus === 'winner') return;
    useStore.setPlaceValue(rowIndex, colIndex)
    if (checkValue(rowIndex, colIndex).bomb) {
      useStore.setGameStatus('loser');
      handleLose()
      return;
    }
    if (checkValue(rowIndex, colIndex).danger === 0){
      const data = useStore.findAroundPlaces(rowIndex, colIndex)
      data.forEach(item => {
        useStore.setPlaceValue(item['row'], item['col'])
      })
    }
  }

  const handleRightClick = (rowIndex, colIndex) => {
    if (useStore.gameStatus === 'loser' || useStore.gameStatus === 'winner') return;
    if (useStore.getFlags === useStore.mines && !checkValue(rowIndex, colIndex).flag){
      return
    }
    useStore.setPlaceFlag(rowIndex, colIndex)
  }
    
  const checkValue = (rowIndex, colIndex) =>
      useStore.cells[useStore.findIndex(rowIndex, colIndex)];
    
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
    if(checkValue(rowIndex, colIndex).bomb){
      return ''
    }
    switch (checkValue(rowIndex, colIndex).danger) {
      case 1:
        return 'blue';
      case 2:
        return 'green';
      case 3:
        return 'red';
      case 4:
        return 'darkblue';
      case 5:
        return 'brown';
      case 6:
        return 'cyan';
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

.end-game {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  font-weight: bold;
  color: red;
}

@media (max-width: 768px) {
  .cell {
    width: 30px;
    height: 30px;
  }
}
</style>