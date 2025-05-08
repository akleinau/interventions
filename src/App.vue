<script setup lang="ts">

import Data_loading from "./components/data_loading.vue";
import Prediction from "./components/prediction.vue";


</script>

<template>

  <div class="d-flex flex-column w-100">

    <v-card class="w-100">

      <v-card-title>
        <h2>Input</h2>
      </v-card-title>

      <v-card-text>

        <data_loading/>

      </v-card-text>

    </v-card>

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

</style>
