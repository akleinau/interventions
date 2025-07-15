<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import TwoSidedBar from "../plots/two-sided-bar.vue";

const dataStore = useDataStore()




</script>

<template>


  <div v-if="dataStore.prediction">

    <div v-if="dataStore.base_prediction.base != null && false" class="mb-3">
      (Feature influences shown compared to the models base of {{ dataStore.prediction.base.toFixed(2) }} %)
    </div>

    <!-- prediction test -->
    <div v-if="dataStore.prediction.prediction != null">
      <h2 class="mb-2"> (Prediction) Intervention group percentage abstinent: {{ dataStore.prediction.prediction.toFixed(2) }} % </h2>
      <two-sided-bar :rules="dataStore.prediction.rules.filter((a:any) => a.new)" />
    </div>

    <!-- prediction control -->
    <div v-if="dataStore.base_prediction.prediction != null" class="mt-5">
      <h2 class="mb-2"> (Prediction) Control group percentage abstinent: {{ dataStore.control_prediction.prediction.toFixed(2) }} % </h2>
      <two-sided-bar :rules="dataStore.control_prediction.rules" />
    </div>

    <!-- prediction control -->
    <div v-if="false && dataStore.base_prediction.prediction != null" class="mt-5">
      <h2 class="mb-2"> (Prediction) Control group percentage abstinent: {{ dataStore.control_prediction.prediction.toFixed(2) }} % </h2>
      <two-sided-bar :rules="dataStore.control_prediction.rules.filter((a:any) => a.new)" />
    </div>

    <!-- prediction base -->
    <div v-if=" false && dataStore.base_prediction.prediction != null" class="mt-5">
      <h2 class="mb-2"> (Prediction) Base group percentage abstinent: {{ dataStore.base_prediction.prediction.toFixed(2) }} % </h2>
      <two-sided-bar :rules="dataStore.base_prediction.rules" />
    </div>




  </div>

</template>

<style scoped>

</style>