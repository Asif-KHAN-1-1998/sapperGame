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
      timer: 0,
      leaderBoard: [],
      usernameError:null,
      bombIndexesState: []
    };
  },
  getters:{ 
    getOpenedCages(){
      return this.cells.filter(item => item.value === '0').length
    },
    getFlags(){
      return this.cells.filter(cell => cell.flag === '🚩').length
    }
  },

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('user', JSON.stringify(this.$state));
    },

    setUsernameError(value){
      this.usernameError = value
    },

    setTimer(value){
      this.timer = value
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
      this.cells = Array(boxes).fill(null).map(() => ({ value: '', bomb: '', flag: '', danger: '', zero: ''}))
    },
    setBombs(rowIndex, colIndex) {
      const max = this.rows * this.columns;
      const excludeIndex = rowIndex * this.columns + colIndex;
      const bombIndexes = new Set();
      while (bombIndexes.size < this.mines) {
        const randomIndex = Math.floor(Math.random() * max);
        if (randomIndex !== excludeIndex) {
          bombIndexes.add(randomIndex);
        }
      }
      this.bombIndexesState = [...bombIndexes]
      bombIndexes.forEach(index => {
        this.cells[index].bomb = '💣';
      });
    },

    findIndex(rowIndex, colIndex){
      return(rowIndex * this.columns + colIndex)
    },
    
    findAroundPlaces(rowIndex, colIndex){
      let cagesList = []
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
        cagesList.push(item)
        })
      return cagesList


    },
    setDanger(rowIndex, colIndex){
      let counter = 0
      const data = this.findAroundPlaces(rowIndex, colIndex)
      data.forEach(item => {
        const cagesList = this.findIndex(item['row'], item['col']);
        if(this.cells[cagesList]?.bomb){
          counter++;
          this.cells[cagesList].zero = 'true'
        }})
      const cage = this.findIndex(rowIndex, colIndex)
      this.cells[cage].danger = counter
    },

    
    setPlaceValue(rowIndex, colIndex){
      this.cells[this.findIndex(rowIndex, colIndex)].value = '0'
      this.setDanger(rowIndex, colIndex)
    },

    openBombs(index){
      this.cells[index].value = '0'
    },
    setPlaceFlag(rowIndex, colIndex){
      switch (this.cells[this.findIndex(rowIndex, colIndex)].flag){
        case '':
          this.cells[this.findIndex(rowIndex, colIndex)].flag = '🚩';
          break
        case '🚩':
          this.cells[this.findIndex(rowIndex, colIndex)].flag = '❓';
          break
        case '❓':
          this.cells[this.findIndex(rowIndex, colIndex)].flag = '';
          break
      }
    },
    deletePlaceFlag(rowIndex, colIndex){
      this.cells[this.findIndex(rowIndex, colIndex)].flag = ''
    },

    setLeaderBoard(value){
      this.leaderBoard = [...this.leaderBoard, { time: `${value}`, nick: `${this.nickName}`, publicTime: `not` }].sort((a, b) => a.time - b.time);
      this.leaderBoard = [...this.leaderBoard].slice(0, 10)
      this.saveToLocalStorage() 
    },
    cleanStore() {
      const savedNickName = this.nickName;
      const savedLeaderBoard = this.leaderBoard;
    
      this.difficulty = '';
      this.cells = [];
      this.columns = 0;
      this.rows = 0;
      this.mines = 0;
      this.gameStatus = '';
      this.openedCages = [];
      this.timer = 0
    
      this.nickName = savedNickName;
      this.leaderBoard = '';
    
      this.saveToLocalStorage();
    }
  },
});