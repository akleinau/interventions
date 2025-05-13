<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import {onMounted, ref} from "vue";

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

async function get_labels() {
  let gResponse = null
  gResponse = await fetch(dataStore.address + "get_labels");
  const response = await gResponse.json();
  console.log(response)
  dataStore.labels = response
}

let lbl = dataStore.label
let expln = dataStore.explanation

</script>

<template>

  <div v-if="input_spec !== null">
    <div v-if="input_spec.params !== null" class="mt-5">
      <h2>Parameters</h2>
      <v-container>
        <v-row v-for="(param, index) in input_spec.params" :key="index">

          <v-col cols="3">
            <div class="text-align-last align-end w-100 mt-2" style="text-align:right"> {{ lbl(param.label) }}</div>
          </v-col>

          <v-col cols="9">

             <!-- slider -->
            <div v-if="param.type == 'slider'" class="w-100">

              <v-slider v-model="dataStore.input_params[param.id]" :min="param.min" :max="param.max" :step="param.step"
                        thumb-label thumb-size="20"
                        density="compact" hide-details single-line color="grey-darken-1">
                <template v-slot:append>
                  <v-text-field v-model="dataStore.input_params[param.id]" density="compact" variant="plain"
                                style="width: 50px" type="number" hide-details single-line class="mb-2"
                  ></v-text-field>
                </template>
              </v-slider>
            </div>

            <!-- checkbox -->
            <div v-else-if="param.type == 'checkbox'">
              <v-checkbox v-model="dataStore.input_params[param.id]"
                          density="compact" hide-details single-line/>
            </div>

               <!-- select -->
            <div v-else-if="param.type == 'select'" class="d-flex mr-5 mt-2">
              <v-select v-model="dataStore.input_params[param.id]" :items="param.choices" :label="param.label"
                        density="compact" hide-details single-line class="mb-2" variant="outlined">
                <template v-slot:item="{ props: itemProps, item }" >
                  <v-hover v-slot="{ isHovering, props }">
                    <div v-bind="props">
                    <v-list-item v-bind="itemProps" title="">
                      <div style="width:600px">
                        <span class="mr-2">{{ lbl(item.value) }}  </span>
                        <span class="text-grey" style="font-size:12px; width:50px"
                              v-show="isHovering">{{ expln(item.value) }}</span>
                      </div>
                    </v-list-item>
                      </div>
                  </v-hover>
                </template>
              </v-select>
            </div>

            <!-- multiselect -->
            <div v-else-if="param.type == 'multiselect'" class="d-flex mr-5 w-100">
              <v-select v-model="dataStore.input_params[param.id]" :items="param.choices" :label="param.label"
                        active-class="bg-yellow"
                        density="compact" hide-details single-line multiple class="mb-2" variant="underlined">
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index < 5" :text="lbl(item.value)" class="mb-1"></v-chip>
                  <span v-if="index === 5" class="text-grey text-caption align-self-center">
                  (+{{ dataStore.input_params[param.id].length - 5 }} others)
                </span>
                </template>
                <template v-slot:item="{ props: itemProps, item }" >
                  <v-hover v-slot="{ isHovering, props }">
                    <div v-bind="props">
                    <v-list-item v-bind="itemProps" title="">
                      <div style="width:600px">
                        <span class="mr-2">{{ lbl(item.value) }}  </span>
                        <span class="text-grey" style="font-size:12px; width:50px"
                              v-show="isHovering">{{ expln(item.value) }}</span>
                      </div>
                    </v-list-item>
                      </div>
                  </v-hover>
                </template>
              </v-select>
            </div>

          </v-col>
        </v-row>
      </v-container>


    </div>

    <!-- interventions -->
    <div v-if="input_spec.interventions !== null" class="mt-5">
      <h2>Interventions</h2>
      <v-container>
        <v-row v-for="(param, index) in input_spec.interventions" :key="index">

          <v-col cols="3">
            <div class="text-align-last align-end w-100 mt-2" style="text-align:right"> {{ lbl(param.label) }}</div>
          </v-col>

          <v-col cols="9">

            <!-- slider -->
            <div v-if="param.type == 'slider'" class="w-100">

              <v-slider v-model="dataStore.input_params[param.id]" :min="param.min" :max="param.max" :step="param.step"
                        thumb-label thumb-size="20"
                        density="compact" hide-details single-line color="grey-darken-1">
                <template v-slot:append>
                  <v-text-field v-model="dataStore.input_params[param.id]" density="compact" variant="plain"
                                style="width: 50px" type="number" hide-details single-line class="mb-2"
                  ></v-text-field>
                </template>
              </v-slider>
            </div>

            <!-- checkbox -->
            <div v-else-if="param.type == 'checkbox'">
              <v-checkbox v-model="dataStore.input_params[param.id]"
                          density="compact" hide-details single-line/>
            </div>

                    <!-- select -->
            <div v-else-if="param.type == 'select'" class="d-flex mr-5 mt-2">
              <v-select v-model="dataStore.input_params[param.id]" :items="param.choices" :label="param.label"
                        density="compact" hide-details single-line class="mb-2" variant="outlined">
                <template v-slot:item="{ props: itemProps, item }" >
                  <v-hover v-slot="{ isHovering, props }">
                    <div v-bind="props">
                    <v-list-item v-bind="itemProps" title="">
                      <div style="width:600px">
                        <span class="mr-2">{{ lbl(item.value) }}  </span>
                        <span class="text-grey" style="font-size:12px; width:50px"
                              v-show="isHovering">{{ expln(item.value) }}</span>
                      </div>
                    </v-list-item>
                      </div>
                  </v-hover>
                </template>
              </v-select>
            </div>

            <!-- multiselect -->
            <div v-else-if="param.type == 'multiselect'" class="d-flex mr-5 w-100">
              <v-select v-model="dataStore.input_params[param.id]" :items="param.choices" :label="param.label"
                        active-class="bg-yellow"
                        density="compact" hide-details single-line multiple class="mb-2" variant="underlined">
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index < 5" :text="lbl(item.value)" class="mb-1"></v-chip>
                  <span v-if="index === 5" class="text-grey text-caption align-self-center">
                  (+{{ dataStore.input_params[param.id].length - 5 }} others)
                </span>
                </template>
                <template v-slot:item="{ props: itemProps, item }" >
                  <v-hover v-slot="{ isHovering, props }">
                    <div v-bind="props">
                    <v-list-item v-bind="itemProps" title="">
                      <div style="width:600px">
                        <span class="mr-2">{{ lbl(item.value) }}  </span>
                        <span class="text-grey" style="font-size:12px; width:50px"
                              v-show="isHovering">{{ expln(item.value) }}</span>
                      </div>
                    </v-list-item>
                      </div>
                  </v-hover>
                </template>
              </v-select>
            </div>

          </v-col>

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