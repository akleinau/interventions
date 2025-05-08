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

  response.ctrlrules_cleaned = response.ctrlrls.map((rule: any) => {
    return { "terms": rule[0].map((a: any) => a[0]), "weight": rule[1].toFixed(2),
      "string": rule[0].map((a: any) => a[0]).join(" & ") + " : " + rule[1].toFixed(2)}
  })

  response.testrules_cleaned = response.testrls.map((rule: any) => {
    let string = rule[0].map((a: any) => a[0]).join(" & ") + " : " + rule[1].toFixed(2)

    // check if string is already in control
    let is_in_control_rules = response.ctrlrules_cleaned.some((r: any) => r.string === string)
    return { "terms": rule[0].map((a: any) => a[0]), "weight": rule[1].toFixed(2), "new": !is_in_control_rules,
      "string": string}
  })

  console.log(response)
  dataStore.prediction = response
}


</script>

<template>
  <v-btn class="mt-5" @click="predict" variant="outlined"> Predict </v-btn>

  <div v-if="dataStore.prediction != null">

    <!-- prediction test -->
    <div v-if="dataStore.prediction.testprediction != null">
      <h2> Test Prediction</h2>
      <p>{{ dataStore.prediction.testprediction }}</p>
    </div>

    <!-- rules test -->
    <div v-if="dataStore.prediction.testrls != null">
      <h2> Test Rules</h2>
      <div v-for="(rule, index) in dataStore.prediction.testrules_cleaned.filter((a:any) => a.new)" :key="index">
        <p>{{ rule.string }}</p>
      </div>
    </div>

    <!-- prediction control -->
    <div v-if="dataStore.prediction.ctrlprediction != null">
      <h2> Control Prediction</h2>
      <p>{{ dataStore.prediction.ctrlprediction }}</p>
    </div>

    <!-- rules control -->
    <div v-if="dataStore.prediction.ctrlrulestrs != null">
      <h2> Control Rules</h2>
      <div v-for="(rule, index) in dataStore.prediction.ctrlrules_cleaned" :key="index">
        <p>{{ rule.string }}</p>
      </div>
    </div>


  </div>

</template>

<style scoped>

</style>