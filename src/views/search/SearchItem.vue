<template>
  <div class="context">
    <el-row>
      <el-col :span="isCollapse ? 0 : 3">
        <el-tree
          :data="data"
          show-checkbox
          @check-change="handleCheckChange"
          :props="props"
        >
        </el-tree>
      </el-col>
      <el-col :span="isCollapse ? 24 : 21">
        <el-button @click="toggleCollapse()">文献分类</el-button>
        <el-form ref="form" :model="form">
          <el-form-item
            v-for="(domain, index) in form.domains"
            :label="'条件' + (index + 1)"
            :key="domain.key"
            :prop="'domains[' + index + '].value'"
            style="margin-left: 50px"
          >
            <el-row style="width: 100%">
              <el-col :span="2">
                <el-select
                  v-model="domain.relation"
                  placeholder="请选择"
                  style="diplay: inline-block"
                >
                  <el-option
                    v-for="item in rela_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <!-- <el-col v-else :span="2"></el-col> -->
              <el-col :span="4">
                <el-select
                  v-model="domain.conType"
                  placeholder="请选择"
                  style="diplay: inline-block"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="14">
                <el-input
                  v-model="domain.condition"
                  placeholder="请输入内容"
                ></el-input>
              </el-col>
              <el-col :span="3" :offset="1">
                <el-button
                  type="primary"
                  size="small"
                  @click="deleteDomain(domain)"
                  >减</el-button
                >
              </el-col>
            </el-row>
          </el-form-item>


          <el-form-item style="margin-left: 50px" prop="isCore">
                <el-checkbox v-model="form.isCore">核心期刊</el-checkbox>
          </el-form-item>

          <el-form-item
            label="日期范围"
            style="margin-left: 50px"
            prop="date"
          >
          <el-row style="width: 100%" justify="center">
            <el-col :span="13">
              <el-date-picker
             :shortcuts="pickerOptions"
              v-model="form.date"
              type="monthrange"
              value-format="YYYY-MM-DD HH:mm:ss"
              range-separator="至"
              unlink-panels
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            </el-col>
          </el-row>

          </el-form-item>

          <el-form-item >
            <el-row type="flex" style="width: 100%" justify="center">
              <el-col :span="6">
                <el-button @click="addDomain()">新增</el-button>
              </el-col>

              
              <el-col :span="6">
                <el-button type="primary" @click="searchByFactor()"
                  >检索</el-button
                >
              </el-col>
              
              <el-col :span="6">
                <el-button @click="resetForm('form')">重置条件</el-button>
              </el-col>

            </el-row>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-progress :percentage="percen"></el-progress>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { search } from "@/api/search";
import { useRouter} from "vue-router";
import {useSearchResult} from "@/stores/searchResult"

export default {
data() {
return {
  pickerOptions: [
  {
    text: '近一年',
    value: () => {
      const end = new Date()
      const start = new Date(new Date().getFullYear(), 0)
      return [start, end]
    },
  },
  {
    text: '近三年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 3)
      return [start, end]
    },
  },
  {
    text: '近五年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 5)
      return [start, end]
    },
  },
  {
    text: '近十年',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setFullYear(start.getFullYear() - 10)
      return [start, end]
    },
  },
],

  form: {
    domains: [
      {
        key: Date.now(),
        relation: "1",
        conType: "",
        condition: "",
      },
    ],
    date: '',
    isCore: false,
    relation_default: "0",
  },

  isCollapse: true,
  activeName: "first",
  optionsValue: "",
  rela_options: [
    {
      value: "1",
      label: "AND",
    },
    {
      value: "2",
      label: "OR",
    },
    {
      value: "3",
      label: "NOT",
    },
  ],

  options: [
    {
      value: "1",
      label: "主题",
    },
    {
      value: "2",
      label: "摘要",
    },
    {
      value: "3",
      label: "关键词",
    },
    {
      value: "4",
      label: "作者",
    },
    {
      value: "5",
      label: "作者单位",
    },
    {
      value: "6",
      label: "篇名",
    },
    {
      value: "7",
      label: "篇关摘",
    },
  ],
  props: {
    label: "label",
    children: "children",
  },
  data: [
    {
      id: 1,
      label: "一级 1",
      children: [
        {
          id: 4,
          label: "二级 1-1",
          children: [
            {
              id: 9,
              label: "三级 1-1-1",
            },
            {
              id: 10,
              label: "三级 1-1-2",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      label: "一级 2",
      children: [
        {
          id: 5,
          label: "二级 2-1",
        },
        {
          id: 6,
          label: "二级 2-2",
        },
      ],
    },
    {
      id: 3,
      label: "一级 3",
      children: [
        {
          id: 7,
          label: "二级 3-1",
        },
        {
          id: 8,
          label: "二级 3-2",
        },
      ],
    },
  ],
  percen: 0,
  router:0,
  searchResult:null,
};
},
methods: {
resetForm(formName) {
  this.$refs[formName].resetFields();
  var len = this.form.domains.length;
  this.form.domains.splice(0, len, { conType: "", condition: "" });
  console.log("已执行");
},
searchByFactor() {
  //根据条件检索
  // for(var i = 0;i < this.form.domains.length; i++){
  // 	this.form.conType[i] = this.form.domains[i].conType
  // 	this.form.condition[i] = this.form.domains[i].condition
  // }
  search(
    this.form.domains,
    this.form.domains.length,
    this.form.date,
    this.form.isCore
  ).then((response) => {
    this.searchResult.setResult(response.data.paper);
    console.log("前端成功", this.form.domains);
    this.router.push({
      // name: 'jump',
      // params: {
      // 	id: "aaa"
      // }
      path: '/search/form'
    })
  });
},
deleteDomain(item) {
  var index = this.form.domains.indexOf(item);
  if (index !== 0) {
    this.form.domains.splice(index, 1);
  }
},
addDomain() {
  this.form.domains.push({
    relation: "1",
    key: Date.now(),
  });
  console.log(this.form.domains);
  // this.form.conType.push()
},
toggleCollapse() {
  this.isCollapse = !this.isCollapse;
},
addPercentage() {
  if (this.percen == 100) clearInterval(this.timer);
  else this.percen++;
},
handleCheckChange(data, checked, indeterminate) {
  console.log(data, checked, indeterminate);
},
handleClick(tab, event) {
  console.log(tab, event);
},
},
mounted() {
this.timer = setInterval(this.addPercentage, 100);
this.router = useRouter();
this.searchResult = useSearchResult();
// console.log(this.router)
},
beforeDestroy() {
clearInterval(this.timer);
},
};

</script>

<style scoped>
.context {
width: 100%;
/* height: 100%; */
padding: 10px 0;
}
</style>
