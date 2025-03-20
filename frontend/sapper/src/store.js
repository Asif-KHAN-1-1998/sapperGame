import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => {
    const savedUser = localStorage.getItem('user');
    return savedUser
    ? JSON.parse(savedUser)
    : 
     {
      nickName:'',
      gameStatus: '',
      difficulty: '',
      cells: [],
      columns: 0,
      rows: 0,
      mines: 0,
      openedCages: [],
      leaderBoard: [],
      
      
    };
  },

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('user', JSON.stringify(this.$state));
    },
    setNickName(value){
      this.nickName = value
    },
    setOpenedcages(value){
      this.openedCages.push(value)
    },
    setGameStatus(value){
      this.gameStatus = value
    },
    setDifficulty(difficul){
      const difficultyLevels = [
        { name: 'easy', boxes: 64, columns: 8, rows: 8, mines: 10 },
        { name: 'medium', boxes: 256, columns: 16, rows: 16, mines: 40 },
        { name: 'hard', boxes: 512, columns: 32, rows: 16, mines: 100 },
      ]
      const level = difficultyLevels.find((lvl) => lvl.name === difficul);
      if (!level) {
        console.error(`Неизвестный уровень сложности: ${difficul}`);
        return;
      }
      this.columns = level.columns;
      this.rows = level.rows;
      this.mines = level.mines;
      this.initCells(level.boxes);
      this.difficulty = difficul;;
       
    },
    initCells(boxes){
      this.cells = Array(boxes).fill(null).map(() => ({ value: '', bomb: '', flag: '', danger: ''}))
    },
    setBombs(){
      const max = this.rows * this.columns
      const uniqueIndex = new Set();
      for (let i=0; i < this.mines; i++){
        while(uniqueIndex.size < this.mines){
          const randomIndex = Math.floor(Math.random() * max);
          uniqueIndex.add(randomIndex);
        }
        uniqueIndex.forEach(item => {
          this.cells[item].bomb = 'BOMB'
        })
      }
    },

    findIndex(rowIndex, colIndex){
      return(rowIndex * this.columns + colIndex)
    },

    chekDanger(rowIndex, colIndex){
      let counter = 0
      const dangerPlace = [
        { row: (rowIndex + 1), col: (colIndex - 1) },
        { row: (rowIndex + 1), col: (colIndex) },
        { row: (rowIndex + 1), col: colIndex + 1 },
        { row: (rowIndex), col: (colIndex - 1) },
        { row: (rowIndex), col: colIndex + 1 },
        { row: (rowIndex - 1), col: (colIndex - 1) },
        { row: (rowIndex - 1), col: (colIndex) },
        { row: (rowIndex - 1), col: colIndex + 1 }
      ];
      const filteredDangerPlace = dangerPlace.filter(item => item.row >= 0 && item.row < this.rows && item.col >= 0 && item.col < this.columns);
      filteredDangerPlace.forEach(item => {
        const data = this.findIndex(item['row'], item['col']);
        if(this.cells[data]?.bomb){
          counter++;
        }
        })
      const cage = this.findIndex(rowIndex, colIndex)
      this.cells[cage].danger = counter

    },
    
    setDangerPlace(rowIndex, colIndex){
      this.cells[this.findIndex(rowIndex, colIndex)].value = '0'
      this.chekDanger(rowIndex, colIndex)
    },
    setTime(hour, minute, second){
      const time = (hour.value * 86400 + minute.value * 60 + second.value)
      if (time > 0){
        console.log(typeof(this.leaderBoard))
        this.leaderBoard = [this.leaderBoard, { time: `${time}`, nick: `${this.nickName}` }];
        this.leaderBoard = this.leaderBoard.filter(item => item !== undefined);
        this.saveToLocalStorage
        }  
    },
    cleanStore() {
      // Очищаем состояние хранилища
      this.difficulty = '';
      this.cells = [];
      this.columns = 0;
      this.rows = 0;
      this.mines = 0;
      this.gameStatus = '';

      // Очищаем localStorage
      localStorage.removeItem('user'); // Удаляем данные из localStorage
    },
  },
});