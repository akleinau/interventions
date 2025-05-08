<script setup lang="ts">

import {useDataStore} from "../stores/data_store";

const dataStore = useDataStore()

const predict = async () => {
  console.log(dataStore.input_params)
  let gResponse = null
  gResponse = await fetch(dataStore.address + "predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"input": dataStore.input_params})
  });
  let response = await gResponse.json();

  // add numerical predictions
  response.ctrlprediction = response.ctrlrls.reduce((acc: number, curr: any) => {
    return acc + curr[1]
  }, 0)

  response.testprediction = response.testrls.reduce((acc: number, curr: any) => {
    return acc + curr[1]
  }, 0)

  console.log(response)
  dataStore.prediction = response
}


</script>

<template>
  <v-btn class="mt-5" @click="predict"> Predict </v-btn>

  <div v-if="dataStore.prediction != null">

    <!-- prediction control -->
    <div v-if="dataStore.prediction.ctrlprediction != null">
      <h2> Control Prediction</h2>
      <p>{{ dataStore.prediction.ctrlprediction }}</p>
    </div>

    <!-- rules control -->
    <div v-if="dataStore.prediction.ctrlrulestrs != null">
      <h2> Control Rules</h2>
      <div v-for="(rule, index) in dataStore.prediction.ctrlrulestrs" :key="index">
        <p>{{ rule }}</p>
      </div>
    </div>


  </div>

</template>

<style scoped>

</style>