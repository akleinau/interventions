<script setup lang="ts">

import Data_loading from "./components/data_loading.vue";
import Prediction from "./components/prediction.vue";
import {useDataStore} from "./stores/data_store";

const dataStore = useDataStore()


</script>

<template>

  <div class="d-flex flex-column fullwidth">

    <v-card style="background:#e2efff">

    </v-card>

    <v-card class="mt-3 w-100">

      <v-card-title>
                <div class="d-flex w-100 justify-space-between align-center">
          <h2> Smoke Cassation Tool #2 </h2>
          <img src="./assets/cessation_logo.png" alt="logo" class="logo" style="width:300px"/>
        </div>
        <v-divider class="mt-3" thickness="5" />
      </v-card-title>

      <v-card-text class="w-75 mb-3" style="margin:auto">

        <data_loading/>

      </v-card-text>

    </v-card>

    <div>
        <v-btn class="mb-3 mt-5" @click="dataStore.predict()" > Predict </v-btn>
    </div>

    <v-card class="mt-3 w-100">

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

  .fullwidth {
    width: 1200px;
  }

</style>
