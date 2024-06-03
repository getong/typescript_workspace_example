<template>
  <div>
    <label for="name">
      Write your name:
      <input
        v-model.lazy="name"
        placeholder="Enter your name"
        id="name"
      />
    </label>
    <p>Your name is: {{ name }}</p>
  </div>
</template>

<script>
 export default {
   data() {
     return {
       name: '',
     };
   },
 };
</script>

<style scoped>
 /* Add any component-specific styles here */
 label {
   display: flex;
   flex-direction: column;
   margin-bottom: 10px;
 }

 input {
   margin-top: 5px;
   padding: 5px;
 }
</style>
