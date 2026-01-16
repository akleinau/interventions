<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import TwoSidedBar from "../plots/two-sided-bar.vue";
import Intervention_Dialog from "./intervention_dialog.vue";
import All_predictions_summary from "./all_predictions_summary.vue";

const dataStore = useDataStore()




</script>

<template>


  <div v-if="dataStore.prediction">

    <div v-if="dataStore.base !== null" class="mb-3">
      (Feature influences shown compared to the models base of {{ dataStore.base.toFixed(2) }} %)
    </div>

    <!-- prediction base -->
    <div v-if="dataStore.stored_predictions['base'].value != null" class="mt-5 position-relative">
      <h2 class="headline-in-figure"> Base group abstinent: {{ dataStore.stored_predictions['base'].value.toFixed(2) }} % </h2>
      <two-sided-bar :rules="dataStore.stored_predictions['base'].rules" type="base" />
    </div>


    <!-- prediction test -->
    <div v-if="dataStore.prediction.value != null" class="position-relative" style="top:-5px">
      <two-sided-bar :rules="dataStore.prediction.rules.filter((a:any) => a.new)" type="intervention" />

      <h2 class="headline-in-figure bg-white text-purple-darken-1" v-if="dataStore.prediction.name == 'control'">
        Control group abstinent: {{ dataStore.prediction.value.toFixed(2) }} %
      </h2>
      <h2 class="headline-in-figure bg-white text-purple-darken-1" v-else>
        Intervention group abstinent: {{ dataStore.prediction.value.toFixed(2) }} %
      </h2>
      <div class="footer-in-figure">
      <Intervention_Dialog v-if="dataStore.prediction.value != null" :intervention="dataStore.prediction.intervention"
       class="footer-in-figure"/>
      </div>

    </div>

    <all_predictions_summary class="position-relative" style="top:-10px"/>





  </div>

</template>

<style scoped>

.headline-in-figure{
  position: absolute;
  top: 0;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
}

.footer-in-figure{
  position: absolute;
  bottom: 20px;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
}

</style>