<script setup lang="ts">

import All_predictions_summary_bar from "../plots/all_predictions_summary_bar.vue";
import {useDataStore} from "../stores/data_store";
import {ref} from "vue";

const dataStore = useDataStore()
const saveDialog = ref(false)
const predictionName = ref("")

const savePrediction = () => {
  if (predictionName.value.trim()) {
    const success = dataStore.save_prediction(predictionName.value.trim())
    if (success) {
      predictionName.value = ""
      saveDialog.value = false
    }
  }
}
</script>

<template>
  <div>
    <all_predictions_summary_bar />

    <div class="d-flex justify-center mt-3">
      <v-dialog v-model="saveDialog" max-width="500px">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" color="success" variant="outlined" prepend-icon="mdi-content-save">
            Save Current Prediction
          </v-btn>
        </template>

        <v-card>
          <v-card-title>Save Current Prediction</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="predictionName"
              label="Prediction Name"
              placeholder="Enter a name for this prediction"
              autofocus
              @keyup.enter="savePrediction"
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn @click="saveDialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="savePrediction" :disabled="!predictionName.trim()">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<style scoped>

</style>