<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import {onMounted, ref} from "vue";
import Data_input_items from "./data_input_items.vue";

let dataStore = useDataStore()

const input_spec = ref(null)

onMounted(() => {
  get_input_params()
  get_labels()
})

async function get_input_params() {
  let gResponse = null
  gResponse = await fetch(dataStore.address + "get_input_params");
  const response = await gResponse.json();
  console.log(response)
  input_spec.value = response

  dataStore.input_params = {}
  dataStore.input_interventions = {}

  if (input_spec.value == null) {
    return
  }

  input_spec.value.params.forEach((param: any) => {
    dataStore.input_params[param.id] = param.value
  })

  input_spec.value.interventions.forEach((intervention: any) => {
    dataStore.input_interventions[intervention.id] = intervention.value
  })
}

async function get_labels() {
  let gResponse = null
  gResponse = await fetch(dataStore.address + "get_labels");
  const response = await gResponse.json();
  console.log(response)
  dataStore.labels = response
}

</script>

<template>

  <div v-if="input_spec !== null">
    <div v-if="input_spec.params !== null" class="mt-5">
      <h2>Parameters</h2>
      <v-container>
        <v-row v-for="(param, index) in input_spec.params" :key="index">
            <data_input_items :param="param" :model="dataStore.input_params" class="pa-0" />
        </v-row>
      </v-container>


    </div>

    <!-- interventions -->
    <div v-if="input_spec.interventions !== null" class="mt-5">
      <h2>Interventions</h2>
      <v-container>
        <v-row v-for="(param, index) in input_spec.interventions" :key="index">
          <data_input_items :param="param" :model="dataStore.input_interventions" class="pa-0" />
        </v-row>
      </v-container>
    </div>


  </div>

</template>

<style scoped>

.v-col {
  padding: 0;
  padding-right: 10px;
  font-size: 16px;
}

</style>