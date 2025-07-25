<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import {useTemplateRef, watch} from "vue";
import * as d3 from "d3";

const dataStore = useDataStore()

watch(() => dataStore.prediction, () => {
  update_vis()
})

watch(() => dataStore.stored_predictions, () => {
  update_vis()
})

const container = useTemplateRef('container')

interface PredictionSummary {
  label: string;
  value: number;
  highlight: boolean;
}

const update_vis = () => {
  // This function creates a bar in which all predictions are marked as a line, with the text below it, and can be selected

  d3.select(container.value).selectAll("*").remove()

  let svg = d3.create("svg")
      .attr("width", 600)
      .attr("height", 200)
      .attr("viewBox", [0, 0, 400, 200])

  // create a list of all predictions and their corresponding labels
  let predictions = [] as PredictionSummary[]
  if (dataStore.base_prediction.prediction != null) {
    predictions.push({
      label: "Base Group",
      value: dataStore.base_prediction.prediction,
      highlight: false
    })
  }
  if (dataStore.control_prediction.prediction != null) {
    predictions.push({
      label: "Control Prediction",
      value: dataStore.control_prediction.prediction,
      highlight: false
    })
  }
  if (dataStore.prediction.prediction != null) {
    predictions.push({
      label: "Current Prediction",
      value: dataStore.prediction.prediction ?? 0,
      highlight: true
    })
  }


  // create a scale for the x-axis
  let xScale = d3.scaleLinear()
      .domain([0, d3.max(predictions, d => d.value) * 1.3])
      .range([0, 400])

  // create the box where the predictions will be displayed
  svg.append("rect")
      .attr("width", 400)
      .attr("height", 50)
      .attr("fill", "#f0f0f0")
      .attr("stroke", "#ccc")
      .attr("rx", 10)
      .attr("ry", 10)

  // add the lines for each prediction
  svg.selectAll("line")
      .data(predictions)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.value))
      .attr("y1", 0)
      .attr("x2", d => xScale(d.value))
      .attr("y2", 50)
      .attr("stroke", d => d.highlight ? "#7ce1ac" : "#000000")
      .attr("stroke-width", 2)

  // add the labels for each prediction as text below the lines, rotatet at 45 degrees
  svg.selectAll("text")
      .data(predictions)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.value))
      .attr("y", 70)
      .attr("text-anchor", "end")
      .text(d => d.label)
      .style("font-size", "12px")
      .style("fill", "#333")
      .attr("transform", d => "rotate(-45, " + xScale(d.value) + ", 60)")




  d3.select(container.value).selectAll("*").remove()
  d3.select(container.value).node().append(svg.node())


}

</script>

<template>
<div ref="container"></div>
</template>

<style scoped>

</style>