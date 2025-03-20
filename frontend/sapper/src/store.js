import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => {
    const savedUser = localStorage.getItem('user');
    return savedUser
    ? JSON.parse(savedUser)
    : 
     {
      difficulty: '',
      cells: [],
      columns: 0,
      rows: 0,
      mines: 0,
      openedCages: [],
      gameStatus: '',
      leaderBoard: [],
      nickName:''
    };
  },

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('user', JSON.stringify(this.$state));
    },
    setNickName(value){
      this.nickName = value
      this.saveToLocalStorage()
    },
    setOpenedcages(value){
      this.openedCages.push(value)
      this.saveToLocalStorage()
    },
    setGameStatus(value){
      this.gameStatus = value
      this.saveToLocalStorage()
    },
    setDifficulty(boxes, difficul){
      this.initCells(boxes)
      this.difficulty = difficul
      switch(difficul){
        case 'easy':
          this.columns = 8
          this.rows = 8
          this.mines = 10
          break;
        case 'medium':
          this.columns = 16
          this.rows = 16
          this.mines = 40
          break;
        case 'hard':
          this.columns = 32
          this.rows = 16
          this.mines = 100
          break
      }
      this.saveToLocalStorage()

      
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
      this.saveToLocalStorage()
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
      this.saveToLocalStorage()

    },
    
    checkDangerPlace(rowIndex, colIndex){
      this.cells[this.findIndex(rowIndex, colIndex)].value = '0'
      this.chekDanger(rowIndex, colIndex)
      this.saveToLocalStorage()

    },
    setTime(hour, minute, second){
      const time = (hour.value * 86400 + minute.value * 60 + second.value)
      this.leaderBoard = []
      if (time > 0){
        this.leaderBoard = [...this.leaderBoard, { time: `${time}`, nick: `${this.nickName}` }];
        this.leaderBoard = this.leaderBoard.filter(item => item !== undefined);
        }
      this.saveToLocalStorage()
 
      
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
      localStorage.removeItem('userState'); // Удаляем данные из localStorage
    },
  },
});