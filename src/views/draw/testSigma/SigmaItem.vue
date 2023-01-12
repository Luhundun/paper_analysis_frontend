<template>

  <div style="text-align:center">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="领域">
        <!-- <el-input v-model="formInline.user" placeholder="Approved by" /> -->
        <el-select v-model="formInline.related" placeholder="选择论文">
          <el-option label="可解释性" value="1" />
          <el-option label="数据增强" value="2" />
          <el-option label="发动机装配" value="3" />
          <el-option label="低成本发动机" value="4" />
        </el-select>
      </el-form-item>

      <el-form-item label="连接条件">
        <el-input-number v-model="formInline.limit" ></el-input-number>
      </el-form-item>

      <el-form-item label="最小出现次数">
        <el-input-number v-model="formInline.minValue" min=1></el-input-number>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">生成</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div id="sigma-container"></div>
  <div id="buttons">
    <button id="random">
      <span><img src="public/sigma/GiPerspectiveDiceSixFaces.svg" />重新布局</span>
    </button>
    <button id="forceatlas2">
        <span>
          <img id="forceatlas2-start-label" src="public/sigma/BiPlay.svg" />
          <img id="forceatlas2-stop-label" style="display: none" src="public/sigma/BiPause.svg" />
          力导图布局
        </span>
    </button>
    <button id="circular">
      <span><img src="public/sigma/BiLoaderCircle.svg" />环形布局</span>
    </button>
    <input type="search" id="search-input" list="suggestions" placeholder="检索..." />
    <datalist id="suggestions"></datalist>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive } from "vue";
import * as echarts from "echarts";
import { onMounted } from "vue";
import { getInsPic } from "@/api/draw";



import Graph from "graphology";
import Sigma from "sigma";
import { circular } from "graphology-layout";
import { Attributes } from "graphology-types";
import { Coordinates, EdgeDisplayData, NodeDisplayData,PlainObject, } from "sigma/types";
import { animateNodes } from "sigma/utils/animate";
import data from "./data.json";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import forceAtlas2 from "graphology-layout-forceatlas2";
interface State {
  hoveredNode?: string;
  searchQuery: string;
  // State derived from query:
  selectedNode?: string;
  suggestions?: Set<string>;
  // State derived from hovered node:
  hoveredNeighbors?: Set<string>;
}
const state: State = { searchQuery: "" };
// Initialize the graph object with data
const graph = new Graph();
graph.import(data);


/** FA2 LAYOUT **/
/* This example shows how to use the force atlas 2 layout in a web worker */

// Graphology provides a easy to use implementation of Force Atlas 2 in a web worker
const sensibleSettings = forceAtlas2.inferSettings(graph);
const fa2Layout = new FA2Layout(graph, {
  settings: sensibleSettings,
});

// A button to trigger the layout start/stop actions

// A variable is used to toggle state between start and stop
let cancelCurrentAnimation: (() => void) | null = null;

// correlate start/stop actions with state management
function stopFA2() {
  fa2Layout.stop();
  FA2StartLabel.style.display = "flex";
  FA2StopLabel.style.display = "none";
}
function startFA2() {
  if (cancelCurrentAnimation) cancelCurrentAnimation();
  fa2Layout.start();
  FA2StartLabel.style.display = "none";
  FA2StopLabel.style.display = "flex";
}

// the main toggle function
function toggleFA2Layout() {
  if (fa2Layout.isRunning()) {
    stopFA2();
  } else {
    startFA2();
  }
}

/** RANDOM LAYOUT **/
/* Layout can be handled manually by setting nodes x and y attributes */
/* This random layout has been coded to show how to manipulate positions directly in the graph instance */
/* Alternatively a random layout algo exists in graphology: https://github.com/graphology/graphology-layout#random  */
function randomLayout() {
  // stop fa2 if running
  if (fa2Layout.isRunning()) stopFA2();
  if (cancelCurrentAnimation) cancelCurrentAnimation();

  // to keep positions scale uniform between layouts, we first calculate positions extents
  const xExtents = { min: 0, max: 0 };
  const yExtents = { min: 0, max: 0 };
  graph.forEachNode((node, attributes) => {
    xExtents.min = Math.min(attributes.x, xExtents.min);
    xExtents.max = Math.max(attributes.x, xExtents.max);
    yExtents.min = Math.min(attributes.y, yExtents.min);
    yExtents.max = Math.max(attributes.y, yExtents.max);
  });
  const randomPositions:PlainObject<PlainObject<number>> = {};
  graph.forEachNode((node) => {
    // create random positions respecting position extents
    randomPositions[node] = {
      x: Math.random() * (xExtents.max - xExtents.min),
      y: Math.random() * (yExtents.max - yExtents.min),
    };
  });
  // use sigma animation to update new positions
  cancelCurrentAnimation = animateNodes(graph, randomPositions, { duration: 2000 });
}

// bind method to the random button

/** CIRCULAR LAYOUT **/
/* This example shows how to use an existing deterministic graphology layout */
function circularLayout() {
  // stop fa2 if running
  if (fa2Layout.isRunning()) stopFA2();
  if (cancelCurrentAnimation) cancelCurrentAnimation();

  //since we want to use animations we need to process positions before applying them through animateNodes
  const circularPositions = circular(graph, { scale: 100 });
  //In other context, it's possible to apply the position directly we : circular.assign(graph, {scale:100})
  cancelCurrentAnimation = animateNodes(graph, circularPositions, { duration: 2000, easing: "linear" });
}



/** instantiate sigma into the container **/
// eslint-disable-next-line @typescript-eslint/no-unused-vars


onMounted(() => {
  // Retrieve some useful DOM elements:
  const container = document.getElementById("sigma-container") as HTMLElement;
  const renderer = new Sigma(graph, container);
  const FA2Button = document.getElementById("forceatlas2") as HTMLElement;
  const FA2StopLabel = document.getElementById("forceatlas2-stop-label") as HTMLElement;
  const FA2StartLabel = document.getElementById("forceatlas2-start-label") as HTMLElement;
  const randomButton = document.getElementById("random") as HTMLElement;
  const circularButton = document.getElementById("circular") as HTMLElement;
  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  const searchSuggestions = document.getElementById(
      "suggestions"
  ) as HTMLDataListElement;

  function setSearchQuery(query: string) {
    state.searchQuery = query;
    if (searchInput.value !== query) searchInput.value = query;
    if (query) {
      const lcQuery = query.toLowerCase();
      const suggestions = graph
          .nodes()
          .map((n) => ({
            id: n,
            label: graph.getNodeAttribute(n, "label") as string
          }))
          .filter(({ label }) => label.toLowerCase().includes(lcQuery));
      // If we have a single perfect match, them we remove the suggestions, and
      // we consider the user has selected a node through the datalist
      // autocomplete:
      if (suggestions.length === 1 && suggestions[0].label === query) {
        state.selectedNode = suggestions[0].id;
        state.suggestions = undefined;

        // Move the camera to center it on the selected node:
        const nodePosition = renderer.getNodeDisplayData(
            state.selectedNode
        ) as Coordinates;
        renderer.getCamera().animate(nodePosition, {
          duration: 500
        });
      }
      // Else, we display the suggestions list:
      else {
        state.selectedNode = undefined;
        state.suggestions = new Set(suggestions.map(({ id }) => id));
      }
    }
    // If the query is empty, then we reset the selectedNode / suggestions state:
    else {
      state.selectedNode = undefined;
      state.suggestions = undefined;
    }

    // Refresh rendering:
    renderer.refresh();
  }

  function setHoveredNode(node?: string) {
    if (node) {
      state.hoveredNode = node;
      state.hoveredNeighbors = new Set(graph.neighbors(node));
    } else {
      state.hoveredNode = undefined;
      state.hoveredNeighbors = undefined;
    }
    // Refresh rendering:
    renderer.refresh();
  }
  searchInput.addEventListener("input", () => {
    setSearchQuery(searchInput.value || "");
  });
  searchInput.addEventListener("blur", () => {
    setSearchQuery("");
  });

// Bind graph interactions:
  renderer.on("enterNode", ({ node }) => {
    setHoveredNode(node);
  });
  renderer.on("leaveNode", () => {
    setHoveredNode(undefined);
  });

  FA2Button.addEventListener("click", toggleFA2Layout);
  randomButton.addEventListener("click", randomLayout);
  circularButton.addEventListener("click", circularLayout);
  // Render nodes accordingly to the internal state:
// 1. If a node is selected, it is highlighted
// 2. If there is query, all non-matching nodes are greyed
// 3. If there is a hovered node, all non-neighbor nodes are greyed
  renderer.setSetting("nodeReducer", (node, data) => {
    const res: Partial<NodeDisplayData> = { ...data };

    if (
        state.hoveredNeighbors &&
        !state.hoveredNeighbors.has(node) &&
        state.hoveredNode !== node
    ) {
      res.label = "";
      res.color = "#f6f6f6";
    }

    if (state.selectedNode === node) {
      res.highlighted = true;
    } else if (state.suggestions && !state.suggestions.has(node)) {
      res.label = "";
      res.color = "#f6f6f6";
    }

    return res;
  });

// Render edges accordingly to the internal state:
// 1. If a node is hovered, the edge is hidden if it is not connected to the
//    node
// 2. If there is a query, the edge is only visible if it connects two
//    suggestions
  renderer.setSetting("edgeReducer", (edge, data) => {
    const res: Partial<EdgeDisplayData> = { ...data };

    if (state.hoveredNode && !graph.hasExtremity(edge, state.hoveredNode)) {
      res.hidden = true;
    }

    if (
        state.suggestions &&
        (!state.suggestions.has(graph.source(edge)) ||
            !state.suggestions.has(graph.target(edge)))
    ) {
      res.hidden = true;
    }

    return res;
  });

  // Feed the datalist autocomplete values:
  searchSuggestions.innerHTML = graph
      .nodes()
      .map(
          (node) =>
              `<option value="${graph.getNodeAttribute(node, "label")}"></option>`
      )
      .join("\n");


});

// const defaultBeginYear = new Date().setFullYear(2017)

// var beginYearModel = new Date(2017, 9, 1);
// var endYearModel= new Date(2022, 9, 1);
const formInline = reactive({
    limit: 1,
    minValue:2,
    related:'',
})

const onSubmit = () => {
    // drawPic(formInline)
    console.log('submit!')
}

</script>


<style scoped>
#sigma-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#buttons {
  position: fixed;
  right: 1em;
  top: 6.8em;
  display: flex;
}

/*#buttons.button {*/
/*  margin-right: 1em;*/
/*  display: inline-block;*/
/*  text-align: center;*/
/*  background: white;*/
/*  outline: none;*/
/*  border: 1px solid dimgrey;*/
/*  border-radius: 2px;*/
/*  cursor: pointer;*/
/*}*/
/*#buttons.button.img {*/
/*  height: 2em;*/
/*}*/
/*#buttons > button > span {*/
/*  height: 100%;*/
/*  display: flex;*/
/*  align-items: center;*/
/*}*/
/*#buttons > button:last-child {*/
/*  margin-right: 0;*/
/*}*/
</style>