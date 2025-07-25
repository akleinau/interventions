<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import TwoSidedBar from "../plots/two-sided-bar.vue";
import Intervention_Dialog from "./intervention_dialog.vue";
import All_predictions_summary from "./all_predictions_summary.vue";

const dataStore = useDataStore()




</script>

<template>


  <div v-if="dataStore.prediction">

    <div v-if="dataStore.base_prediction.base != null" class="mb-3">
      (Feature influences shown compared to the models base of {{ dataStore.prediction.base.toFixed(2) }} %)
    </div>

    <!-- prediction base -->
    <div v-if="dataStore.base_prediction.prediction != null" class="mt-5">
      <h2 class="mb-2"> (Prediction) Base group percentage abstinent: {{ dataStore.base_prediction.prediction.toFixed(2) }} % </h2>
      <two-sided-bar :rules="dataStore.base_prediction.rules" />
    </div>


    <!-- prediction test -->
    <div v-if="dataStore.prediction.prediction != null">
      <h2 class="mb-2"> (Prediction) Intervention group percentage abstinent: {{ dataStore.prediction.prediction.toFixed(2) }} % </h2>
      <two-sided-bar :rules="dataStore.prediction.rules.filter((a:any) => a.new)" />
    </div>

    <Intervention_Dialog v-if="dataStore.prediction.prediction != null" :intervention="dataStore.prediction.intervention" />

    <!-- prediction control -->
    <div v-if="dataStore.base_prediction.prediction != null" class="mt-5">
      <h2 class="mb-2"> (Prediction) Control group percentage abstinent: {{ dataStore.control_prediction.prediction.toFixed(2) }} % </h2>
      <two-sided-bar :rules="dataStore.control_prediction.rules.filter((a:any) => a.new)" />
    </div>

    <all_predictions_summary class="mt-5" />





  </div>

</template>

<style scoped>

</style>