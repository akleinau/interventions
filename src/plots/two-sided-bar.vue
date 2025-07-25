<script setup lang="ts">
import * as d3 from "d3";
import {onMounted, ref, useTemplateRef, watch} from "vue";
import {useDataStore} from "../stores/data_store";
import {useDisplay} from 'vuetify'

const dataStore = useDataStore()

const container = useTemplateRef('container')

const props = defineProps(['rules', 'tornado'])

const isExtended = ref(false)

const isExtendable = ref(false)

onMounted(() => {
  update_vis()
})

watch(() => dataStore.prediction, () => {
  update_vis()
},)

watch(() => isExtended.value, () => {
  update_vis()
},)

watch(() => props.rules, () => {
  update_vis()
},)

const {xs} = useDisplay()


const update_vis = () => {

  let rules = props.rules

  if (rules == null || rules.length === 0) {
    d3.select(container.value).selectAll("*").remove()
    return
  }

  if (props.tornado ?? true) {
    rules[0].start_position = dataStore.base_prediction.prediction
    for (let i = 1; i < rules.length; i++) {
      // for tornado, add additive weight info
      rules[i].start_position = rules[i - 1].start_position + +rules[i - 1].weight
    }
  } else {
    // for two-sided bar, add absolute weight info
    rules.forEach(d => {
      d.start_position = 0
    })
  }

  const COMPACT_RULE_NR = 10

  isExtendable.value = rules.length > COMPACT_RULE_NR
  isExtended.value = isExtendable.value && isExtended.value

  // only select up to 5 most important rules
  if (isExtendable.value && !isExtended.value) {
    rules = rules.slice(0, COMPACT_RULE_NR)
  }

  const svg_width = xs.value ? 300 : 1100
  const padding_top = 0
  const padding_bottom = 20
  let svg_height = padding_top + 20 * rules.length

  let svg = d3.create("svg")
      .attr("width", svg_width + 20)
      .attr("height", svg_height)
      .attr("viewBox", [0, 0, svg_width, svg_height])

  // add a two-sided bar chart with one bar for each rule
  const max_weight = dataStore.max_weight * 3
  const x = d3.scaleLinear()
      .domain([-100, 100])
      .range([0, svg_width])

  let y = 0
  const bar_height = 18
  const bar_padding = 5

  rules.forEach(d => {

    // add the bars
    svg.append("rect")
        .attr("x", d.weight >= 0 ? x(d.start_position) : x(d.start_position + +d.weight))
        .attr("y", y)
        .attr("width", Math.abs(Math.abs(x(d.weight)) - x(0)))
        .attr("height", bar_height)
        .attr("fill", d.weight > 0 ? "#647fd0" : "#da5e5e")

    // add the text
    // first split the string when it is too long
    const words_string = d.string.split(" ")
    const split_string_max_length = xs.value ? 25 : 70
    let spans = []
    let split_string = ""
    for (let i = 0; i < words_string.length; i++) {
      if (split_string.length + words_string[i].length > split_string_max_length) {
        spans.push(split_string)
        split_string = words_string[i] + " "
      } else {
        split_string += words_string[i] + " "
      }
    }
    spans.push(split_string)

    let text = svg.append("text")
        .attr("class", "text_rule")
        .attr("x", x(d.weight) > x(0) ? x(0) - 5 : x(0) + 5)
        .attr("y", y + bar_height / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", x(d.weight) > x(0) ? "end" : "start")
        .style("font-size", "12px")

    spans.forEach((s, i) => {
      text.append("tspan")
          .attr("x", x(d.weight) > x(0) ? x(0) - 5 : x(0) + 5)
          .attr("dy", i === 0 ? "0.35em" : "1.2em")
          .text(s)
    })


    // add weight text on other sider of the bar
    svg.append("text")
        .attr("class", "text_weight")
        .attr("x", x(d.weight) > x(0) ? x(d.weight) + 5 : x(d.weight) - 5)
        .attr("y", y + bar_height / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", x(d.weight) > x(0) ? "start" : "end")
        .style("fill", "#888888")
        .style("font-size", "11px")
        .text(d.weight < 0 ? d.weight : "+" + d.weight)

    let prev_y = y
    y += bar_height + bar_padding + (spans.length - 1) * 14

    // add line going down to next bar
    svg.append("line")
        .attr("x1", x(d.start_position + +d.weight))
        .attr("y1", prev_y)
        .attr("x2", x(d.start_position + +d.weight))
        .attr("y2", y + bar_height)
        .style("stroke", "#525252")
        .style("stroke-width", 2)


  })

  // adapt the height of the svg
  svg_height = y + padding_top + padding_bottom
  svg.attr("height", svg_height)
  svg.attr("viewBox", [0, 0, svg_width, svg_height])


  // add vertical middle line
  svg.append("line")
      .attr("x1", x(0))
      .attr("y1", 0)
      .attr("x2", x(0))
      .attr("y2", svg_height - padding_bottom)
      .attr("stroke", "#525252")
      .attr("stroke-width", 2)

  // if compact, make the line droppel out
  if (isExtendable.value && !isExtended.value) {
    svg.append("line")
        .attr("x1", x(0))
        .attr("y1", svg_height - padding_bottom)
        .attr("x2", x(0))
        .attr("y2", svg_height)
        .attr("stroke", "#525252")
        .attr("stroke-width", 2)
        .style("opacity", 0.7)
        .style("stroke-dasharray", "2, 2")
  }


  d3.select(container.value).selectAll("*").remove()
  d3.select(container.value).node().append(svg.node())

}

</script>

<template>
  <div class="justify-center overflow-x-auto overflow-y-hidden">
    <div ref="container"></div>
    <v-btn icon density="compact" @click="isExtended = !isExtended" variant="outlined" class="ml-2" size="40"
           color="grey" v-if="isExtendable">
      <v-icon size="40">{{ isExtended ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
    </v-btn>
  </div>
</template>

<style scoped>

</style>