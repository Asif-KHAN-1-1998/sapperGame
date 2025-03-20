<script setup>
import { useUserStore } from './store.js';

const useStore = useUserStore();
</script>

<template>
  <header class="app-header">
    <nav class="navigation">
      <router-link to="/" class="nav-link">Настройки</router-link>
      <router-link v-if="useStore.gameStatus" to="/game" class="nav-link">Игра</router-link>
      <router-link to="/leadership" class="nav-link">Таблица лидеров</router-link>
    </nav>
    <p class="route-info"><strong>Текущий путь:</strong> {{ $route.fullPath }}</p>
  </header>
  <main class="app-main">
    <h1>{{ useStore.name }}</h1>
    <RouterView />
  </main>
</template>

<style scoped>
/* Общие стили */
.app-header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.nav-link:hover {
  background-color: #42b983;
  transform: scale(1.05);
}

.nav-link.router-link-active {
  background-color: #42b983;
  font-weight: bold;
}

.route-info {
  font-size: 0.9rem;
  color: #ecf0f1;
  margin-top: 0.5rem;
}

/* Основной контент */
.app-main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.app-main h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1.5rem;
}

/* Адаптивность */
@media (min-width: 768px) {
  .navigation {
    gap: 1.5rem;
  }

  .nav-link {
    font-size: 1.1rem;
    padding: 0.6rem 1.2rem;
  }

  .route-info {
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .route-info {
    margin-top: 0;
  }

  .app-main {
    padding: 3rem;
  }
}
</style>