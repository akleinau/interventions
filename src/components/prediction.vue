<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import TwoSidedBar from "../plots/two-sided-bar.vue";

const dataStore = useDataStore()




</script>

<template>


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