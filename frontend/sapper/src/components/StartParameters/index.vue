<template>
    <div class="input-container">
        <p class="selected-level">Выбранный уровень: {{ useStore.difficulty}}</p>
        <input placeholder="username..." class="input-username" v-model="username">
        <div v-if="useStore.usernameError == true" class="error-message">Заполните поле username</div>
        <router-link v-if="useStore.gameStatus === 'gaming'" to="/game" class="start-game-btn">Вернуться в игру</router-link>
        <button v-else @click="() => {handleClick()}" class="start-game-btn"> Начать игру</button>
    </div>
</template>
<script setup>
  import { useUserStore } from '../../store.js';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  const username = ref('');
  const useStore = useUserStore();
  const router = useRouter();

  let timerId;
  let delay = 1000;
  let timeCounter = ref(0);
  
    

  const startGame = () => {
    useStore.setNickName(username.value || useStore.nickName);
    if (!username.value && !useStore.nickName) {
      useStore.setUsernameError(true);
      throw new Error('Имя пользователя не указано');
    }
    if(!useStore.difficulty){
        useStore.setDifficulty('easy')
      }
    useStore.setUsernameError(false)
    useStore.setGameStatus('gaming');
    router.push('/game');

  };

  const gameTimer = () => {
    const request = () => {
      if (useStore.gameStatus === 'winner') {
        useStore.setLeaderBoard(timeCounter.value, hours.value, minutes.value, seconds.value);
        resetTimer()
        return;
      } else if (!useStore.gameStatus || useStore.gameStatus === 'loser') {
        resetTimer()
        return;
      }
      timeCounter.value++;
      useStore.setTimer(timeCounter.value)
      timerId = setTimeout(request, delay);
    };
    timerId = setTimeout(request, delay);
  };

  const resetTimer = () => {
    clearTimeout(timerId); 
    timeCounter.value = 0; 
  };

  const handleClick = () => {
      startGame();
      gameTimer();
  }
      
</script>
<style scoped>
  .selected-level {
    margin-top: 20px;
    font-size: 18px;
    color: #555;
  }

  .input-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .input-username {
    margin-top: 10px;
    padding: 10px;
    font-size: 18px;
    color: #555;
    text-align: center;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .error-message {
    color: red;
    margin-top: 1rem;
  }

  .start-game-btn {
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