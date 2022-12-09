<script setup>
import { ref, reactive } from "vue";
import * as echarts from "echarts";
import { onMounted } from "vue";
import { getSequenceBySearch } from "@/api/search";
import { useSearchResult } from "@/stores/searchResult";

function drawSeqPic(beginYear,endYear,minValue,paper) {
  var myChart = echarts.init(document.getElementById("sequence"));
  myChart.showLoading();
  getSequenceBySearch(beginYear,endYear,minValue,paper).then((res) => {
    res = res.data;
    let nodes = res.nodes;
    let links = res.links;
    let categories = res.categories;
    myChart.hideLoading();
    myChart.setOption({
      tooltip: {},
      toolbox: {
        show:true,
        feature:{
          saveAsImage: {
            name:"关键字.png"
          }
        }
      },
      legend: [
        {
          data: categories.map(function (a) {
            return a.name;
          }),
          type: "scroll",
        },
      ],
      grid: {
        left: "10%",
        right: "10%",
      },
      xAxis: [
        {
          type: "category",
          data: categories.map(function (a) {
            return a.name;
          }),
          splitArea: {
            show: true,
            areaStyle: {
              color: [
                "rgba(65, 105, 225, 0.1)",
                "rgba(0, 255, 0, 0.1)",
                "rgba(255, 128, 0, 0.1)",
                "rgba(250, 128, 114, 0.1)",
                "rgba(176, 224, 230, 0.1)",
                "rgba(34, 139, 34, 0.1)",
              ],
            },
          },
          splitLine: {
            show: true,
            interval: 0,
          },
        },
      ],
      yAxis: [
        {
          show: false,
        },
      ],
      series: [
        {
          name: "时序图",
          type: "graph",
          layout: "none",
          data: nodes,
          links: links,
          categories: categories,
          roam: false,
          // center: ['50%', '50%'],
          label: {
            show: true,
            position: "right",
            formatter: "{b}",
          },
          labelLayout: {
            hideOverlap: true,
            draggable: true,
          },
          scaleLimit: {
            min: 0.4,
            max: 2,
          },
          lineStyle: {
            color: "source",
            curveness: 0.3,
          },
          legendHoverLink: true,
          edgeLabel: {
            formatter: "{b}:次数{@value}",
          },
          autoCurveness: true,
          emphasis: {
            focus: 'adjacency',
              label: {
                position: 'inside',
                show: true
              }
          }
        },
      ],
    });
  });
}

// const defaultBeginYear = new Date().setFullYear(2017)

// var beginYearModel = new Date(2017, 9, 1);
// var endYearModel= new Date(2022, 9, 1);
const formInline = reactive({
  beginYear: 2017,
  endYear: 2022,
  minValue: 2,
  paper:useSearchResult().getNoAbs,
});

onMounted(() => {

  // console.log(formInline.paper)
});

const onSubmit = () => {
  console.log("paper",formInline.paper)
  setTimeout(() => {
    drawSeqPic(formInline.beginYear,formInline.endYear,formInline.minValue,formInline.paper);
  }, 100);

  // getSequencePic(formInline).then(res =>{
  //   console.log("test");
  //   console.log(res);
  // })
  console.log("submit!");
};
</script>

<template>
  <div style="text-align: center">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="起始年份">
        <!-- <el-select v-model="formInline.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select> -->
        <el-input-number v-model="formInline.beginYear"></el-input-number>
      </el-form-item>
      <el-form-item label="终止年份">
        <!-- <el-select v-model="formInline.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select> -->
        <el-input-number v-model="formInline.endYear"></el-input-number>
      </el-form-item>
      <el-form-item label="最小出现次数">
        <el-input-number
          v-model="formInline.minValue"
          min=1
        ></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">生成</el-button>
      </el-form-item>
    </el-form>
  </div>

  <div style="text-align: center">
    <div ref="myChart" id="sequence"></div>
  </div>
</template>

<style scoped>
#sequence {
  height: 1000px;
  width: 100%;
}
</style>
