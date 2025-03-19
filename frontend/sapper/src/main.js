import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import GameCard from './components/GameCard/index.vue'
import LeadershipCard from './components/LeadershipCard/index.vue'
import SettingsCard from './components/SettingsCard/index.vue'


const routes = [
  {path: '/', component: SettingsCard},
  {path: '/game', component: GameCard},
  {path: '/leadership', component: LeadershipCard},
]
const router = createRouter({
  history: createMemoryHistory(),
  routes
})
const app = createApp(App)
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app')


