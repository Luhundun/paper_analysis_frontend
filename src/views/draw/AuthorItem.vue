<script setup>
import { ref,reactive } from "vue";
import * as echarts from "echarts";
import { onMounted } from "vue";
import { getAuthorPic } from "@/api/draw";

function drawPic(params){

    var myChart = echarts.init(document.getElementById("main"));
    myChart.showLoading();
    getAuthorPic(params).then((res) => {
      res=res.data;
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
            name:"关键字"
          }
        }
      },
      // legend: [
      //   {
      //     data: categories.map(function (a) {
      //       return a.name;
      //     }),
      //     type: "scroll",
      //   },
      // ],
      series: [
      {
        type: 'graph',
        layout: 'force',
        animation: false,
        roam:true,
        label: {
            show: true,
            position: "inside",
            formatter: "{b}",
            fontSize:10,
            fontWeight:'bolder'
          },
          labelLayout: {
            hideOverlap: false,
            draggable: true,
          },
        draggable: true,
        data: nodes,
        categories: categories,
        force: {
          initLayout:true,
          edgeLength: 30,
          repulsion: 60,
          gravity: 0.4,
          
        },
        edges: links,
        scaleLimit: {
            min: 1.5,
            max: 200,
          },
          emphasis: {
            focus: 'adjacency',
              label: {
                position: 'inside',
                show: true
              }
          },
      }
      ],
    });
});
}


const formInline = reactive({
    limit: 1,
    minValue:2,
    related:'',
    labelSize:6,
    nodeSize:7,
})

const onSubmit = () => {
    drawPic(formInline)
    console.log('submit!')
}

</script>

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
      <!-- <el-select v-model="formInline.region" placeholder="Activity zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select> -->
      <el-input-number v-model="formInline.minValue" min=1></el-input-number>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">生成</el-button>
    </el-form-item>

    <el-form-item label="结点大小">
        <el-slider v-model="formInline.nodeSize" :step="1" :min="5" :max="20"   vertical
      height="20px"> </el-slider>
      </el-form-item>

      <el-form-item label="标签大小">
        <el-slider v-model="formInline.labelSize" :step="1" :min="0" :max="20"   vertical
      height="20px"> </el-slider>
      </el-form-item>

  </el-form>
  </div>

  <div ref="myChart" id="main"></div>
</template>

<style scoped>
#main {
  height: 100%;
  width: 100%;
}
</style>
