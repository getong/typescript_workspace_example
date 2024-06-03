import './assets/main.css';
import { createApp, defineComponent, h, ref } from 'vue';

const App = defineComponent({
    name: 'App',
    setup() {
        const name = ref<string>("");

        return { name };
    },

    render() {
        return h('div', [
            h('label', { for: 'name' }, 'Write your name:'),
            h('input', {
                id: 'name',
                placeholder: 'Enter your name',
                value: this.name,
                onInput: (event: Event) => this.name = (event.target as HTMLInputElement).value
            }),
            h('p', `Hello, ${this.name}`)
        ]);
    }
});

createApp(App).mount('#app');
