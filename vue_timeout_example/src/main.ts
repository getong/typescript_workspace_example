import './assets/main.css'

import { createApp, h, defineComponent } from 'vue';
import { createPinia } from 'pinia'

// import App from './App.vue'
import router from './router'

type Data = {
    counter: number;
}

const App = defineComponent({
    name: 'App',
    data(): Data {
        return {
            counter: 0
        }
    },
    created() {
        const interval = setInterval(() => {
            this.counter++
        }, 1000);
        setTimeout(() => {
            clearInterval(interval)
        }, 5000)
    },
    render() {
        return h('div', "Counter: " + this.counter);
    }
});

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
