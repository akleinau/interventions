<script setup lang="ts">

import {useDataStore} from "../stores/data_store";
import {onMounted, useTemplateRef, watch} from "vue";
import * as d3 from "d3";

const dataStore = useDataStore()

onMounted(() => {
  update_vis()
})

watch(() => dataStore.prediction, () => {
  update_vis()
})

watch(() => dataStore.stored_predictions, () => {
  update_vis()
})

const container = useTemplateRef('container')

interface PredictionSummary {
  name: string;
  label: string;
  value: number;
  highlight: boolean;
}

const update_vis = () => {
  // This function creates a bar in which all predictions are marked as a line, with the text below it, and can be selected

  d3.select(container.value).selectAll("*").remove()

  const padding_top = 20

  let svg = d3.create("svg")
      .attr("width", 600)
      .attr("height", 200)
      .attr("viewBox", [0, 0, 400, 200])

  // create a list of all predictions and their corresponding labels
  let predictions = [] as PredictionSummary[]
  if (Object.keys(dataStore.stored_predictions).length > 0) {
    Object.entries(dataStore.stored_predictions).forEach(([key, pred], _) => {
      predictions.push({
        name: key,
        label: key,
        value: pred.value,
        highlight: key === dataStore.prediction.name
      })
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
      .attr("transform", "translate(0, " + padding_top + ")")

  // add the lines for each prediction
  svg.selectAll("line")
      .data(predictions)
      .enter()
      .append("line")
      .attr("x1", d => xScale(d.value))
      .attr("y1", 0)
      .attr("x2", d => xScale(d.value))
      .attr("y2", d => d.highlight ? 70 : 50)
      .attr("stroke", d => d.highlight ? "#6e09be" : "#000000")
      .attr("stroke-width",d => d.highlight ? 3  :  2)
      .attr("transform", "translate(0, " + padding_top + ")")
      .on("click", (_, d) => {
        // when a line is clicked, set the prediction to the value of the line
        if (d.name !== null) {
          dataStore.set_prediction(d.name)
        }
      })

  // add the labels for each prediction as text below the lines, rotatet at 45 degrees
  svg.selectAll("text")
      .data(predictions)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.value))
      .attr("y",d => d.highlight ? 90 : 70)
      .attr("text-anchor", "end")
      .text(d => d.label)
      .style("font-size", "12px")
      .style("fill", "#333")
      .style("font-weight", d => d.highlight ? "bold" : "normal")
      .attr("transform", d => "rotate(-45, " + (xScale(d.value) + padding_top) + ", 80)")

  // add the axis
  svg.append("g")
      .attr("transform", "translate(0, "+ padding_top + ")")
      .call(d3.axisTop(xScale).ticks(10))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#888888")




  d3.select(container.value).selectAll("*").remove()
  d3.select(container.value).node().append(svg.node())


}

</script>

<template>
<div ref="container"></div>
</template>

<style scoped>

</style>