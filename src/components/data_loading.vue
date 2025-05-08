<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import {ref} from "vue";

let dataStore = useDataStore()

const input_spec = ref(null)

async function get_input_params() {
  let gResponse = null
  gResponse = await fetch(dataStore.address + "get_input_params");
  const response = await gResponse.json();
  console.log(response)
  input_spec.value = response

  dataStore.input_params = {}

  if (input_spec.value == null) {
    return
  }

  input_spec.value.params.forEach((param: any) => {
    dataStore.input_params[param.id] = param.value
  })

  input_spec.value.interventions.forEach((intervention: any) => {
    dataStore.input_params[intervention.id] = intervention.value
  })
}

</script>

<template>

  <v-btn @click="get_input_params" variant="outlined">Load</v-btn>

  <div v-if="input_spec !== null">
    <div v-if="input_spec.params !== null" class="mt-5">
      <h2>Parameters</h2>
      <div v-for="(param, index) in input_spec.params" :key="index">

        <!-- slider -->
        <div v-if="param.type == 'slider'" class="d-flex">
          {{ param.label }}: {{ dataStore.input_params[param.id] }}
          <v-slider v-model="dataStore.input_params[param.id]" :min="param.min" :max="param.max" :step="param.step"
                    density="compact" hide-details single-line style="min-width:200px"/>
        </div>

        <!-- checkbox -->
        <div v-else-if="param.type == 'checkbox'">
          <v-checkbox v-model="dataStore.input_params[param.id]" :label="param.label"
                      density="compact" hide-details single-line/>
        </div>

        <!-- select -->
        <div v-else-if="param.type == 'select'" class="d-flex">
          <div class="mt-2 mr-2"> {{ param.label }} </div>
          <v-select v-model="dataStore.input_params[param.id]" :items="param.choices" :label="param.label"
                    density="compact" hide-details single-line class="mb-2"/>
        </div>

        <!-- multiselect -->
        <div v-else-if="param.type == 'multiselect'" class="d-flex">
          <div class="mt-2 mr-2"> {{ param.label }} </div>
          <v-select v-model="dataStore.input_params[param.id]" :items="param.choices" :label="param.label"
                    density="compact" hide-details single-line multiple class="mb-2"/>
        </div>

      </div>
    </div>

    <!-- interventions -->
    <div v-if="input_spec.interventions !== null" class="mt-5">
      <h2>Test Parameters</h2>
      <div v-for="(param, index) in input_spec.interventions" :key="index">

             <!-- slider -->
        <div v-if="param.type == 'slider'" class="d-flex">
          {{ param.label }}: {{ dataStore.input_params[param.id] }}
          <v-slider v-model="dataStore.input_params[param.id]" :min="param.min" :max="param.max" :step="param.step"
                    density="compact" hide-details single-line style="min-width:200px"/>
        </div>

        <!-- checkbox -->
        <div v-else-if="param.type == 'checkbox'">
          <v-checkbox v-model="dataStore.input_params[param.id]" :label="param.label"
                      density="compact" hide-details single-line/>
        </div>

        <!-- select -->
        <div v-else-if="param.type == 'select'" class="d-flex">
          <div class="mt-2 mr-2"> {{ param.label }} </div>
          <v-select v-model="dataStore.input_params[param.id]" :items="param.choices" :label="param.label"
                    density="compact" hide-details single-line class="mb-2"/>
        </div>

        <!-- multiselect -->
        <div v-else-if="param.type == 'multiselect'" class="d-flex">
          <div class="mt-2 mr-2"> {{ param.label }} </div>
          <v-select v-model="dataStore.input_params[param.id]" :items="param.choices" :label="param.label"
                    density="compact" hide-details single-line multiple class="mb-2"/>
        </div>

      </div>
    </div>


  </div>

</template>

<style scoped>

</style>