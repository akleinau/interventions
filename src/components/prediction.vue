<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import TwoSidedBar from "../plots/two-sided-bar.vue";

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
      "string": rule[0].map((a: any) => a[0]).join(" & ")}
  })

  response.testrules_cleaned = response.testrls.map((rule: any) => {
    let string = rule[0].map((a: any) => a[0]).join(" & ")

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
  <v-btn class="mb-5" @click="predict" variant="outlined"> Predict </v-btn>

  <div v-if="dataStore.prediction">

    <!-- prediction test -->
    <div v-if="dataStore.prediction.testprediction != null">
      <h2 class="mb-2"> Test Prediction: {{ dataStore.prediction.testprediction.toFixed(2) }}</h2>
      <two-sided-bar :isTestGroup="true"  v-if="dataStore.prediction.testrls != null" />
    </div>

    <!-- prediction control -->
    <div v-if="dataStore.prediction.ctrlprediction != null" class="mt-5">
      <h2 class="mb-2"> Control Prediction: {{ dataStore.prediction.ctrlprediction.toFixed(2) }}</h2>
      <two-sided-bar :isTestGroup="false" v-if="dataStore.prediction.ctrlrulestrs != null" />
    </div>




  </div>

</template>

<style scoped>

</style>