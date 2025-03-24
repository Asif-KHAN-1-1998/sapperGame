<template>
  <div class="settings">
    <h1 v-if="useStore.nickName">{{ useStore.nickName }}, выберите уровень сложности </h1>
    <h1 v-else> Выберите уровень сложности </h1>
    <div class="difficulty-options">
      <button @click="useStore.setDifficulty('easy')" class="btn easy">
        Простой (8x8, 10 мин)
      </button>
      <button @click="useStore.setDifficulty('medium')" class="btn medium">
        Средний (16x16, 40 мин)
      </button>
      <button @click="useStore.setDifficulty('hard')" class="btn hard">
        Сложный (32x16, 100 мин)
      </button>
    </div>
    <div style="display: flex; flex-direction: column;">
      <p class="selected-level">Выбранный уровень: {{ useStore.difficulty }}</p>
      <input placeholder="username..." style="text-align: center;" class="input-username" v-model="username">
      <div style="color:red; margin-top: 1rem;" v-if="useStore.usernameError == true">Заполните поле username</div>
      <router-link v-if="useStore.gameStatus === 'gaming'" to="/game" class="start-game-btn">Вернуться в игру</router-link>
      <button v-else @click="() => {startGame(); gameTimer();}" class="start-game-btn"> Начать игру</button>

    </div>
  </div>
</template>

<script setup>
  import { useUserStore } from '../../store.js';
  import { ref} from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const useStore = useUserStore();
  const username = ref('');

  let timerId;
  let delay = 1000;
  let timeCounter = ref(0);
  let hours = ref(0)
  let minutes = ref(0)
  let seconds = ref(0)

  const startGame = () => {
    if (!username.value && !useStore.nickName) {
      useStore.setUsernameError(true);
      throw new Error('Имя пользователя не указано');
    }
    if(!useStore.difficulty){
        useStore.setDifficulty('easy')
      }
    useStore.setUsernameError(false)
    useStore.setNickName(username.value || useStore.nickName);
    useStore.setGameStatus('gaming');
    router.push('/game');
 
};

const gameTimer = () => {
  const request = () => {
    hours.value = Math.floor(timeCounter.value / 3600);
    minutes.value = Math.floor((timeCounter.value % 3600) / 60);
    seconds.value = Math.floor(timeCounter.value % 60);
    useStore.setTimer(`${hours.value}:${minutes.value}:${seconds.value}`);
    if (useStore.gameStatus === 'winner') {
      useStore.setLeaderBoard(timeCounter.value, hours.value, minutes.value, seconds.value);
      resetTimer()
      return;
    } else if (!useStore.gameStatus || useStore.gameStatus === 'lose') {
      resetTimer()
      return;
    }
    timeCounter.value++;
    timerId = setTimeout(request, delay);
  };
  timerId = setTimeout(request, delay);
};


const resetTimer = () => {
  clearTimeout(timerId); 
  timeCounter.value = 0; 
  hours.value = 0; 
  minutes.value = 0;
  seconds.value = 0;
  useStore.setTimer('0:0:0');
};
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
  background-color: #4caf50;
}

.medium {
  background-color: #ff9800;
}

.hard {
  background-color: #f44336;
}

.selected-level {
  margin-top: 20px;
  font-size: 18px;
  color: #555;
}
.input-username {
  font-size: 18px;
  color: #555;
}

.start-game-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  text-decoration: none;
  border-radius: 5px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.start-game-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>