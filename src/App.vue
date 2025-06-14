<script setup lang="ts">

import Data_loading from "./components/data_loading.vue";
import Prediction from "./components/prediction.vue";
import {useDataStore} from "./stores/data_store";

const dataStore = useDataStore()


</script>

<template>

  <div class="d-flex flex-column fullwidth mr-sm-2 ml-sm-2">

    <v-card class="mt-3 w-100">

       <div class="d-flex mb-3 pa-2 justify-space-between align-center bg-grey-lighten-3">
         <div>
           <v-btn variant="text" class="text-grey-darken-4" href="https://www.humanbehaviourchange.org/contact" >Contact</v-btn>
         </div>
         <div v-if="false" class="d-flex justify-end align-center">
            or add your own model:
            <div style="width:400px">
              <v-text-field label="API Address" class="ml-2" style="background: #f8f8f8"
                           single-line density="compact" variant="outlined" hide-details  />
            </div>
         </div>
        </div>

      <v-card-title class=" ml-sm-5 mr-sm-5">
        <div class="d-flex w-100 justify-space-between align-center flex-wrap">
          <div class="d-flex flex-wrap align-cneter text-wrap"><h2 > Smoke Cessation Prediction</h2></div>
          <img src="./assets/cessation_logo.png" alt="logo" class="logo ma-auto ma-sm-0" style="width:300px"/>
        </div>
        <v-divider class="mt-3" thickness="5" />
      </v-card-title>

      <v-card-text class="ml-sm-15 mr-sm-15 mb-3 " style="margin:auto">

        <data_loading/>

      </v-card-text>

    </v-card>

    <div>
        <v-btn class="mb-3 mt-5" @click="dataStore.predict()" > Predict </v-btn>
    </div>

    <v-card class="mt-3 w-100"  v-if="Object.keys(dataStore.prediction).length !== 0">

      <v-card-title>
        <h2>Prediction</h2>
      </v-card-title>

      <v-card-text>

        <prediction/>

      </v-card-text>

    </v-card>

  </div>

</template>

<style scoped>

</style>
