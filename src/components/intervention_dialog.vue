<script setup lang="ts">

import Data_input_items from "./data_input_items.vue";

import {useDataStore} from "../stores/data_store";

const dataStore = useDataStore()

</script>

<template>
  <v-dialog max-width="900px">

    <template v-slot:activator="{props: activatorProps}">
      <v-btn v-bind="activatorProps">Add Intervention</v-btn>
    </template>

    <template v-slot:default="{ isActive}">
      <v-card class="pa-5">
        <v-card-title> Add Intervention </v-card-title>
        <v-card-text>
           <!-- interventions -->
          <div v-if="dataStore.input_spec.interventions !== null" class="mt-5">
            <h2>Interventions</h2>
            <v-container>
              <v-row v-for="(param, index) in dataStore.input_spec.interventions" :key="index">
                <data_input_items :param="param" :model="dataStore.input_interventions" class="pa-0"/>
              </v-row>
            </v-container>
          </div>
        </v-card-text>

        <v-btn class="ma-2 ma-auto" @click="dataStore.predict(); isActive.value = false" :disabled="!isActive" color="blue">
          Add Intervention
        </v-btn>

      </v-card>

    </template>

    </v-dialog>
</template>

<style scoped>

</style>