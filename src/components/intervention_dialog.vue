<script setup lang="ts">

import Data_input_items from "./data_input_items.vue";

import {useDataStore} from "../stores/data_store";
import {computed} from "vue";

const dataStore = useDataStore()

const topInterventionsCount = 5;

// Helper function to find matching column in a row by removing parentheses
const findMatchingColumn = (row: any, featurename: string): string | undefined => {
  return Object.keys(row).find(col => {
    const cleanedCol = col.replace(/\s*\(\d+\)\s*$/, '').trim();
    return cleanedCol === featurename;
  });
};

// Helper function to check if a value is 1
const isValueOne = (value: any): boolean => {
  return value === 1 || value === '1';
};

// Helper function to get all intervention-related labels
const getInterventionLabels = (): string[] => {
  if (!dataStore.labels) return [];
  return Object.keys(dataStore.labels).filter(
    key => ['intervention', 'pharmacological', 'delivery', 'source'].includes(dataStore.labels[key].group)
  );
};

// Helper function to get currently selected features
const getSelectedFeatures = (): string[] => {
  const selectedFeatures: string[] = [];
  
  if (dataStore.input_interventions.intervention && Array.isArray(dataStore.input_interventions.intervention)) {
    selectedFeatures.push(...dataStore.input_interventions.intervention);
  }
  
  if (dataStore.input_interventions.delivery && Array.isArray(dataStore.input_interventions.delivery)) {
    selectedFeatures.push(...dataStore.input_interventions.delivery);
  }
  
  if (dataStore.input_interventions.source && Array.isArray(dataStore.input_interventions.source)) {
    selectedFeatures.push(...dataStore.input_interventions.source);
  }
  
  if (dataStore.input_interventions.pharmacological) {
    selectedFeatures.push(dataStore.input_interventions.pharmacological);
  }
  
  return selectedFeatures;
};

// Helper function to calculate item counts in given rows
const calculateItemCounts = (rows: any[], excludeFeatures: string[] = []) => {
  const counts: { [key: string]: { count: number, total: number, percentage: number, label: string, group: string } } = {};
  const interventionLabels = getInterventionLabels();

  interventionLabels.forEach(labelKey => {
    const featurename = dataStore.labels[labelKey].featurename;
    
    if (excludeFeatures.includes(featurename)) {
      return;
    }

    let count = 0;
    const total = rows.length;

    rows.forEach((row: any) => {
      const matchingColumn = findMatchingColumn(row, featurename);
      if (matchingColumn && isValueOne(row[matchingColumn])) {
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
};

// Calculate how often each intervention-related item appears in the dataset
const interventionCounts = computed(() => {
  if (!dataStore.dataset || dataStore.dataset.length === 0 || !dataStore.labels) {
    return {};
  }
  return calculateItemCounts(dataStore.dataset);
});

// Get the top most used interventions
const topInterventions = computed(() => {
  const selectedFeatures = getSelectedFeatures();
  
  const countsArray = Object.entries(interventionCounts.value)
    .filter(([key, data]) => !selectedFeatures.includes(dataStore.labels[key]?.featurename))
    .map(([key, data]) => ({
      key: key,
      ...data
    }));

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
      dataStore.input_interventions.pharmacological = featurename;
    } else {
      if (!dataStore.input_interventions[group]) {
        dataStore.input_interventions[group] = [];
      }
      
      if (!dataStore.input_interventions[group].includes(featurename)) {
        dataStore.input_interventions[group].push(featurename);
      }
    }
    
    dataStore.predict();
  }
};

// Calculate recommendations based on items often used with currently selected items
const combinationRecommendations = computed(() => {
  if (!dataStore.dataset || dataStore.dataset.length === 0 || !dataStore.labels || !dataStore.input_interventions) {
    return [];
  }

  const selectedFeatures = getSelectedFeatures();

  if (selectedFeatures.length === 0) {
    return [];
  }

  // Filter dataset to rows that contain ALL selected items
  const filteredRows = dataStore.dataset.filter((row: any) => {
    return selectedFeatures.every(feature => {
      const matchingColumn = findMatchingColumn(row, feature);
      return matchingColumn && isValueOne(row[matchingColumn]);
    });
  });

  if (filteredRows.length === 0) {
    return [];
  }

  // Calculate counts for items in filtered rows, excluding already selected items
  const counts = calculateItemCounts(filteredRows, selectedFeatures);

  // Convert to array and sort by count
  const countsArray = Object.entries(counts).map(([key, data]) => ({
    key: key,
    ...data
  }));

  return countsArray
    .sort((a, b) => b.count - a.count)
    .slice(0, topInterventionsCount);
});

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
            <h3 class="mb-3">Often Used</h3>
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

          <!-- Combination Recommendations -->
          <div v-if="combinationRecommendations.length > 0" class="mb-5">
            <h3 class="mb-3">Often Used in Combination</h3>
            <div class="d-flex flex-wrap ga-2">
              <v-chip
                v-for="item in combinationRecommendations"
                :key="item.key"
                @click="selectIntervention(item.key); isActive.value = false"
                color="secondary"
                variant="outlined"
                label
                class="cursor-pointer"
              >
                {{ item.label }}
                <v-tooltip activator="parent" location="top">
                  Used in {{ item.count }} of {{ item.total }} matching cases ({{ item.percentage.toFixed(1) }}%)
                </v-tooltip>
              </v-chip>
            </div>
          </div>

           <!-- interventions -->
          <div v-if="dataStore.input_spec.interventions !== null" class="mt-5">
            <h2>All Interventions</h2>
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