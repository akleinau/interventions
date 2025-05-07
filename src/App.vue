<script setup lang="ts">
 const address = "http://127.0.0.1:5000/"

 async function get_input_params() {
   let gResponse = null
   gResponse = await fetch(address + "get_input_params");
   const response = await gResponse.json();
    console.log(response)

 }


</script>

<template>
  <div>
    Hello World!
  </div>

  <v-btn @click="get_input_params">Get Input Params</v-btn>

</template>

<style scoped>

</style>
