<script setup lang="ts">
import * as d3 from "d3";
import {onMounted, ref, useTemplateRef, watch} from "vue";
import {useDataStore} from "../stores/data_store";
import {useDisplay} from 'vuetify'
import {type Rule} from "../interfaces.ts"

const dataStore = useDataStore()

const container = useTemplateRef('container')

const props = defineProps(['rules', 'tornado', 'type'])

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

  let rules = props.rules as Rule[]

  if (rules == null || rules.length === 0) {
    d3.select(container.value).selectAll("*").remove()
    return
  }

  if (props.tornado ?? true) {

    // define where to start
    if (props.type == "base") {
      rules[0].start_position = dataStore.base
    }
    else {
      rules[0].start_position = dataStore.stored_predictions['base'].value
    }

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

    // add a rule at the end that bundles all hidden rules and shows their combined influence
    let hidden_rules = rules.slice(COMPACT_RULE_NR, rules.length)
    rules = rules.slice(0, COMPACT_RULE_NR)

    if (hidden_rules.length > 0) {
      const hidden_weight = hidden_rules.reduce((acc, rule) => acc + +rule.weight, 0)
      const hidden_string = "other"
      rules.push({
        string: hidden_string,
        weight: hidden_weight.toFixed(2),
        start_position: rules[rules.length - 1].start_position + +rules[rules.length - 1].weight
      })
    }


  }

  const svg_width = xs.value ? 300 : 1100
  const padding_top = 30
  const padding_bottom = 20
  let svg_height = padding_top + 20 * rules.length

  let svg = d3.create("svg")
      .attr("width", svg_width + 20)
      .attr("height", svg_height)
      .attr("viewBox", [0, 0, svg_width, svg_height])

  // add a two-sided bar chart with one bar for each rule
  const max_weight = dataStore.max_weight * 3
  const x = d3.scaleLinear()
      .domain([0, 100])
      .range([0, svg_width])

  let y = padding_top
  const bar_height = 18
  const bar_padding = 5

  // add x axis on top
  svg.append("g")
      .attr("transform", `translate(0, ${padding_top})`)
      .call(d3.axisTop(x).ticks(20))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#888888")

  rules.forEach(d => {

    const rect_start = d.weight >= 0 ? x(d.start_position) : x(d.start_position + +d.weight)
    const rect_width = Math.abs(Math.abs(x(d.weight)) - x(0))
    const space_left = rect_start
    const space_right = svg_width - (rect_start + rect_width)

    // add the bars
    svg.append("rect")
        .attr("x", rect_start)
        .attr("y", y)
        .attr("width", rect_width)
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

    // determine the x position of the text, depending on if left or right of the bar is more space
    let x_text = rect_start - 5
    let text_anchor = "end"
    if (space_left < space_right) {
      x_text = rect_start + rect_width + 10
      text_anchor = "start"
    }


    let text = svg.append("text")
        .attr("class", "text_rule")
        .attr("x", x_text)
        .attr("y", y + bar_height / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", text_anchor)
        .style("font-size", "12px")

    spans.forEach((s, i) => {
      text.append("tspan")
          .attr("x", x(d.weight) > x_text? x_text - 10 : x_text -5 )
          .attr("dy", i === 0 ? "0.35em" : "1.2em")
          .text(s)
    })


    // add weight text on other sider of the bar
    // if the bar is on the left side, add the weight on the right side and vice versa
    let weight_x = rect_start + rect_width + 5
    let weight_anchor = "start"
    if (space_left < space_right) {
      weight_x = rect_start - 5
      weight_anchor = "end"
    }

    svg.append("text")
        .attr("class", "text_weight")
        .attr("x", weight_x)
        .attr("y", y + bar_height / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", weight_anchor)
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