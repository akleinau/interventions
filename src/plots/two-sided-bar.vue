<script setup lang="ts">
import * as d3 from "d3";
import {onMounted, useTemplateRef, watch} from "vue";
import {useDataStore} from "../stores/data_store";

const dataStore = useDataStore()

const container = useTemplateRef('container')

const props = defineProps(['isTestGroup'])

onMounted(() => {
  update_vis()
})

watch(() => dataStore.prediction, () => {
  update_vis()
},  )



const update_vis = () => {

  const rules = props.isTestGroup ? dataStore.prediction.testrules_cleaned.filter((a:any) => a.new) : dataStore.prediction.ctrlrules_cleaned

  const svg_width = 1100
  const svg_height = 20 + 20 * rules.length

  let svg = d3.create("svg")
      .attr("width", svg_width + 20)
      .attr("height", svg_height)
      .attr("viewBox", [0, 0, svg_width, svg_height])

  // add a two-sided bar chart with one bar for each rule
  const max_weight = 10
  const x = d3.scaleLinear()
      .domain([-max_weight, max_weight])
      .range([0, svg_width])
  const y = d3.scaleBand()
      .domain(rules.map((d: any) => d.string))
      .range([0, svg_height])
      .padding(0.1)

  // add the bars
  svg.selectAll("rect")
      .data(rules)
      .enter()
      .append("rect")
      .attr("x", d => x(d.weight) > x(0) ? x(0) : x(d.weight))
      .attr("y", (d: any) => y(d.string))
      .attr("width", d => Math.abs(Math.abs(x(d.weight)) - x(0)))
      .attr("height", y.bandwidth())
      .attr("fill", d => d.weight > 0 ? "#da5e5e" : "#647fd0")

  // add the text
  svg.selectAll("text_rule")
      .data(rules)
      .enter()
      .append("text")
      .attr("class","text_rule")
      .attr("x", d => x(d.weight) > x(0) ?  x(0) - 5 :  x(0) + 5)
      .attr("y", (d: any) => y(d.string) + y.bandwidth()/2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => x(d.weight) > x(0) ? "end" : "start")
      .style("font-size", "11px")
      .text((d: any) => d.string)

  // add weight text on other sider of the bar
  svg.selectAll("text_weight")
      .data(rules)
      .enter()
      .append("text")
      .attr("class", "text_weight")
      .attr("x", d => x(d.weight) > x(0) ?  x(d.weight) + 5 :  x(d.weight) - 5)
      .attr("y", (d: any) => y(d.string) + y.bandwidth()/2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => x(d.weight) > x(0) ? "start" : "end")
      .style("fill", "#888888")
      .style("font-size", "11px")
      .text((d: any) => d.weight)

  // add vertical middle line
  svg.append("line")
      .attr("x1", x(0))
      .attr("y1", 0)
      .attr("x2", x(0))
      .attr("y2", svg_height)
      .attr("stroke", "#000000")
      .attr("stroke-width", 1)


  d3.select(container.value).selectAll("*").remove()
  d3.select(container.value).node().append(svg.node())

}

</script>

<template>
  <div class="d-flex justify-center ml-15">
    <div ref="container"></div>
  </div>
</template>

<style scoped>

</style>