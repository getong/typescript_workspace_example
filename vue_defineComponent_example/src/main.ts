import './assets/main.css'

import { createApp, h, defineComponent } from 'vue';
import { createPinia } from 'pinia'

// import App from './App.vue'
import router from './router'

type Data = {
    title: string;
}

const App = defineComponent({
    name: 'App',
    data(): Data {
        return {
            title: 'My first Vue component'
        }
    },
    created() {
        console.log(this.title);
    },
    render() {
        return h('div', this.title);
    }
});

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
