<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import TwoSidedBar from "../plots/two-sided-bar.vue";

const dataStore = useDataStore()




</script>

<template>


  <div v-if="dataStore.prediction">

    <div v-if="dataStore.prediction.base != null" class="mb-3">
      (Feature influences shown compared to the models base of {{ dataStore.prediction.base.toFixed(2) }} %)
    </div>

    <!-- prediction test -->
    <div v-if="dataStore.prediction.testfit != null">
      <h2 class="mb-2"> (Prediction) Intervention group percentage abstinent: {{ dataStore.prediction.testfit.toFixed(2) }} % </h2>
      <two-sided-bar :isTestGroup="true" />
    </div>

    <!-- prediction control -->
    <div v-if="dataStore.prediction.ctrlfit != null" class="mt-5">
      <h2 class="mb-2"> (Prediction) Control group percentage abstinent: {{ dataStore.prediction.ctrlfit.toFixed(2) }} % </h2>
      <two-sided-bar :isTestGroup="false" />
    </div>




  </div>

</template>

<style scoped>

</style>