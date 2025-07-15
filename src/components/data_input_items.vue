<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import {onMounted, ref} from "vue";

let dataStore = useDataStore()

let lbl = dataStore.label
let expln = dataStore.explanation

const props = defineProps(['param', 'model'])

</script>

<template>
  <v-col cols="5" sm="3" class="pa-0">
    <div class="text-right mt-2 pa-0 pr-3" > {{ lbl(props.param.label) }}</div>
  </v-col>

  <v-col  class="pa-0 ma-auto ">

    <!-- slider -->
    <div v-if="param.type == 'slider'" class="w-100 pa-0">

      <v-slider v-model="model[param.id]" :min="param.min" :max="param.max" :step="param.step"
                thumb-label thumb-size="20" class="pa-0"
                density="compact" hide-details single-line color="grey-darken-1">
        <template v-slot:append>
          <v-text-field v-model="model[param.id]" density="compact" variant="plain"
                        style="width: 50px" type="number" hide-details single-line class="mb-2"
          ></v-text-field>
        </template>
      </v-slider>
    </div>

    <!-- checkbox -->
    <div v-else-if="param.type == 'checkbox'">
      <v-checkbox v-model="model[param.id]"
                  density="compact" hide-details single-line/>
    </div>

    <!-- select -->
    <div v-else-if="param.type == 'select'" class="d-flex mr-5 mt-2">
      <v-select v-model="model[param.id]" :items="param.choices" :label="param.label"
                density="compact" hide-details single-line class="mb-2" variant="outlined">
        <template v-slot:item="{ props: itemProps, item }">
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
      <v-select v-model="model[param.id]" :items="param.choices" :label="param.label"
                active-class="bg-yellow"
                density="compact" hide-details single-line multiple class="mb-2" variant="underlined">
        <template v-slot:selection="{ item, index }">
          <v-chip v-if="index < 5" :text="lbl(item.value)" class="mb-1"></v-chip>
          <span v-if="index === 5" class="text-grey text-caption align-self-center">
                  (+{{ model[props.param.id].length - 5 }} others)
                </span>
        </template>
        <template v-slot:item="{ props: itemProps, item }">
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
</template>

<style scoped>

</style>