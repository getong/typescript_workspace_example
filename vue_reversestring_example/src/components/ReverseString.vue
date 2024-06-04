<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ReversedMessage',
  data() {
    return {
      message: '',
    };
  },
  methods: {
    reverseMessage(): string {
      return this.message.split('').reverse().join('')
    }
  },
});
</script>

<template>
  <h2 class="heading">I am {{ reverseMessage() }}</h2>
  <input v-model="message" type="text" placeholder="Enter your message" />
</template>