<template>
    <header class="game-header">
        <div class="controls">
            <div  class="timer">Время: {{ timerPanel || '0:0:0' }}</div>
            <div class="flags-counter">Флажки:{{ useStore.mines - useStore.getFlags }}</div>
        </div>
        <div class="actions">
            <button class="btn restart-btn" @click="restartGame()">Перезапуск</button>
            <router-link to="/" class="btn settings-btn">Настройки</router-link>
        </div>
    </header>
</template>
<script setup>
import { useUserStore } from '../../store.js';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const useStore = useUserStore();

const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const restartGame = () => {
    useStore.setGameStatus('loser');
    useStore.cleanStore();
    router.push('/');
}

const timerPanel = computed(() => {
    if (useStore.timer) {
      hours.value = Math.floor(useStore.timer / 3600) || 0;
      minutes.value = Math.floor((useStore.timer % 3600) / 60) || 0;
      seconds.value = Math.floor(useStore.timer % 60) || 0;
    return `${hours.value}:${minutes.value}:${seconds.value}`
    } else console.log('timer is empty')
    
  })

</script>
<style scope>
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

</style>