<script setup lang="ts">

import Data_input_items from "./data_input_items.vue";

import {useDataStore} from "../stores/data_store";
import {computed} from "vue";

const dataStore = useDataStore()

const topInterventionsCount = 5;

// Calculate how often each intervention-related item appears in the dataset
const interventionCounts = computed(() => {
  if (!dataStore.dataset || dataStore.dataset.length === 0 || !dataStore.labels) {
    return {};
  }

  const counts: { [key: string]: { count: number, total: number, percentage: number, label: string, group: string } } = {};

  // Find which labels are interventions, pharmacological, delivery, or source
  const interventionLabels = Object.keys(dataStore.labels).filter(
    key => ['intervention', 'pharmacological', 'delivery', 'source'].includes(dataStore.labels[key].group)
  );

  // For each intervention, use its featurename to find the column in the dataset
  interventionLabels.forEach(labelKey => {
    const featurename = dataStore.labels[labelKey].featurename;
    let count = 0;
    const total = dataStore.dataset.length;

    dataStore.dataset.forEach((row: any) => {
      // Find the matching column by removing parentheses and numbers from dataset column names
      const matchingColumn = Object.keys(row).find(col => {
        // Remove text in parentheses (e.g., " (1)", " (2)") from the column name
        const cleanedCol = col.replace(/\s*\(\d+\)\s*$/, '').trim();
        return cleanedCol === featurename;
      });

      // Check if the value is 1 (accounting for string "1" or number 1)
      if (matchingColumn && (row[matchingColumn] === 1 || row[matchingColumn] === '1')) {
        count++;
      }
    });

    const percentage = total > 0 ? (count / total) * 100 : 0;

    counts[labelKey] = {
      count: count,
      total: total,
      percentage: percentage,
      label: dataStore.labels[labelKey]?.label || labelKey,
      group: dataStore.labels[labelKey]?.group || 'unknown'
    };
  });

  return counts;
});

// Get the top most used interventions
const topInterventions = computed(() => {
  const countsArray = Object.entries(interventionCounts.value).map(([key, data]) => ({
    key: key,
    ...data
  }));

  // Sort by count in descending order and take the top N
  return countsArray
    .sort((a, b) => b.count - a.count)
    .slice(0, topInterventionsCount);
});

// Function to select a top intervention-related item
const selectIntervention = (interventionKey: string) => {
  const featurename = dataStore.labels[interventionKey]?.featurename;
  const group = dataStore.labels[interventionKey]?.group;
  
  if (featurename && group) {
    if (group === 'pharmacological') {
      // For pharmacological, set as a single string value (not an array)
      dataStore.input_interventions.pharmacological = featurename;
    } else {
      // For other groups, add to array
      if (!dataStore.input_interventions[group]) {
        dataStore.input_interventions[group] = [];
      }
      
      if (!dataStore.input_interventions[group].includes(featurename)) {
        dataStore.input_interventions[group].push(featurename);
      }
    }
    
    // Trigger prediction immediately
    dataStore.predict();
  }
};

</script>

<template>
  <v-dialog max-width="900px">

    <template v-slot:activator="{props: activatorProps}">
      <v-btn v-bind="activatorProps">Add/ Remove Intervention</v-btn>
    </template>

    <template v-slot:default="{ isActive}">
      <v-card class="pa-5">
        <v-card-title> Add Intervention </v-card-title>
        <v-card-text>
          
          <!-- Quick Recommendations -->
          <div v-if="topInterventions.length > 0" class="mb-5">
            <h3 class="mb-3">Quick Recommendations (Top {{ topInterventionsCount }} Most Used)</h3>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="intervention in topInterventions"
                :key="intervention.key"
                @click="selectIntervention(intervention.key); isActive.value = false"
                color="primary"
                variant="outlined"
                label
                class="cursor-pointer"
              >
                {{ intervention.label }}
                <v-tooltip activator="parent" location="top">
                  Used in {{ intervention.count }} of {{ intervention.total }} cases ({{ intervention.percentage.toFixed(1) }}%)
                </v-tooltip>
              </v-chip>
            </div>
          </div>

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
          Add/ Remove Intervention
        </v-btn>

      </v-card>

    </template>

    </v-dialog>
</template>

<style scoped>

</style>