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
      <button @click="startGame()" class="start-game-btn"> Начать игру</button>

    </div>
  </div>
</template>

<script setup>
  import { useUserStore } from '../../store.js';
  import { onMounted, ref, computed } from 'vue';
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
 
  onMounted(() => {
    if(!useStore.difficulty){
      useStore.setDifficulty('easy')
    }
    if (useStore.gameStatus === 'lose' || useStore.gameStatus === 'win') {
      useStore.cleanStore();
      useStore.setDifficulty('easy')
    }
  })

  const startGame = () => {
  // Проверяем, что username или nickName не пустые
  if (!username.value && !useStore.nickName) {
    useStore.setUsernameError(true);
    throw new Error('Имя пользователя не указано');
  }
  useStore.setUsernameError(false)
  useStore.setNickName(username.value || useStore.nickName);
  useStore.setGameStatus('gaming');
  router.push('/game');
  gameTimer();
};

const gameTimer = () => {
  const request = () => {
  hours.value = Math.floor(timeCounter.value / 3600);
  minutes.value = Math.floor((timeCounter.value % 3600) / 60);
  seconds.value = Math.floor(timeCounter.value % 60);
  useStore.setTimer(`${hours.value}:${ minutes.value }:${ seconds.value }`)
  if (useStore.gameStatus === 'winner') {
      useStore.setLeaderBoard(timeCounter, hours, minutes, seconds);
      clearTimeout(timerId)
      return
      } else if (!useStore.gameStatus || useStore.gameStatus === 'lose') {
        clearTimeout(timerId) 
        return
      };
  timeCounter.value++;
  timerId = setTimeout(request, delay);
  }
  timerId = setTimeout(request, delay);
  
}
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