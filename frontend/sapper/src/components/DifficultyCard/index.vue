<template>
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
</template>
<script setup>
import { useUserStore } from '../../store.js';
const useStore = useUserStore();

</script>
<style scoped>
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
</style>