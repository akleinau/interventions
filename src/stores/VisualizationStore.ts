import { defineStore } from "pinia";
import * as d3 from "d3";

export const useVisualizationStore = defineStore("visualizationStore", {
  state: () => ({
    svgWidth: 1100, // Default SVG width
    padding : { top: 20, right: 20, bottom: 30, left: 40 }
  }),
  actions: {
    /**
     * Returns the X-axis scale based on the given domain maximum.
          * @returns A D3 linear scale for the X-axis.
     */
    getXScale( ) {
      return d3.scaleLinear()
        .domain([0, 50 ])
        .range([ this.padding.left, this.svgWidth - this.padding.right ]);
    },

    /**
     * Returns the current SVG width.
     * @returns The SVG width.
     */
    getSVGWidth() {
      return this.svgWidth;
    },
      
       /**
     * Sets the SVG width to a new value.
     * @param xs - A boolean indicating whether to set a smaller width.
     */
    setSVGWidth(xs : number) {
      this.svgWidth = xs ?300 : 1100 
    },
      
  },
});