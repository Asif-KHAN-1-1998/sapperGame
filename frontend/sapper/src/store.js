import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => {
    const savedUser = localStorage.getItem('user');
    return savedUser
    ? JSON.parse(savedUser)
    : {
      difficulty: '',
      cells: {},
      columns: '',
      rows:'',
      mines: '',
      gameStatus:''
    };
  },
  actions: {
    saveToLocalStorage() {
      localStorage.setItem('user', JSON.stringify(this.$state));
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

    setDifficulty(boxes, difficulty){
      this.difficulty = difficulty
      this.initCellsValue(boxes)
      switch(difficulty){
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
      this.setBombs()
      this.saveToLocalStorage();
    },

    initCellsValue(item){
      this.cells = Array(item).fill(null).map(() => ({ value: '', bomb: '', flag: '', danger: ''}))
      this.saveToLocalStorage();
    },

    findIndex(rowIndex, colIndex){
      this.saveToLocalStorage();
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
      console.log(filteredDangerPlace)
      filteredDangerPlace.forEach(item => {
        const data = this.findIndex(item['row'], item['col']);
        if(this.cells[data]?.bomb){
          console.log( this.cells.indexOf(this.cells[data]))
          counter++;
        }
        })
      const cage = this.findIndex(rowIndex, colIndex)
      this.cells[cage].danger = counter
      this.saveToLocalStorage();
    },
    
    setDangerPlace(rowIndex, colIndex){
      this.cells[this.findIndex(rowIndex, colIndex)].value = '0'
      this.chekDanger(rowIndex, colIndex)
      this.saveToLocalStorage();
    },
    cleanStore(){
      this.difficulty = '';
      this.gameStatus = '';
    }
  },
});