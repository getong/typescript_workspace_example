<template>
  <div>
    <div>The course checklist: {{ list.join(', ') }}</div>
    <div>
      <label for="chapter1">
        <input v-model="list" type="checkbox" value="chapter01" id="chapter1" />
        Chapter 1
      </label>
      <label for="chapter2">
        <input v-model="list" type="checkbox" value="chapter02" id="chapter2" />
        Chapter 2
      </label>
      <label for="chapter3">
        <input v-model="list" type="checkbox" value="chapter03" id="chapter3" />
        Chapter 3
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const list = ref < string[] > ([]);
    return { list };
  },
});
</script>

<style scoped>
/* Add any component-specific styles here */
</style>