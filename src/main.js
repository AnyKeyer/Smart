import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './assets/styles/main.css'

// Views
import UploadView from './views/UploadView.vue'
import FilterView from './views/FilterView.vue'
import AnalysisView from './views/AnalysisView.vue'
import ResultsView from './views/ResultsView.vue'

// Routes
const routes = [
  { path: '/', component: UploadView },
  { path: '/filter', component: FilterView },
  { path: '/analysis', component: AnalysisView },
  { path: '/results', component: ResultsView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Create app
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')