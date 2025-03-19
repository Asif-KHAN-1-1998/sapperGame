<template>
  <div class="leaderboard">
    <h1>{{ message }}</h1>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Имя игрока</th>
          <th>Время (сек)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in leaderboard" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ player.name }}</td>
          <td>{{ player.time }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../../store.js';

const message = ref('Таблица лидеров');

// Пример данных для таблицы лидеров
const leaderboard = ref([
  { name: 'Игрок 1', time: 120 },
  { name: 'Игрок 2', time: 150 },
  { name: 'Игрок 3', time: 180 },
  { name: 'Игрок 4', time: 200 },
  { name: 'Игрок 5', time: 220 },
]);
</script>

<style scoped>
.leaderboard {
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

table {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  border-collapse: collapse;
  background-color: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

thead {
  background-color: #4caf50;
  color: white;
}

th,
td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

tbody tr:nth-child(even) {
  background-color: #f1f1f1;
}

tbody tr:hover {
  background-color: #e0e0e0;
}
</style>