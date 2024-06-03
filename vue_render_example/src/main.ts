import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// import App from './App.vue'
import router from './router'

const App = {
    render() {
        return "This is the app's entrance"
    }
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
