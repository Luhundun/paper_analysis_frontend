<template>
  <!-- <SearchItem></SearchItem> -->
  <div class="box">
    <ActionBar @reset="resetParams" @refresh="refreshTable">
      <template #left>
        <el-button
            @click="generateSequence(1)"
            type="primary"
        >生成时序图
        </el-button>
        <el-button
            @click="generateAuthor(1)"
            type="primary"
        >生成作者图
        </el-button>
        <el-button
            @click="openForm(null,'添加')"
            type="primary"
        >生成机构图
        </el-button>
        <el-button
            @click="openForm(null,'添加')"
            type="primary"
        >生成关键字图
        </el-button>
      </template>
      <!-- <template #right>
        <el-input
          v-model="searchParams.title"
          placeholder="请输入标题"
          clearable
        />
      </template> -->
    </ActionBar>
    <el-table
      :data="thisTableData"
      style="width: 100%"
      max-height="calc(100vh - 225px)"
      ref="table"
      @sort-change="onsortByYear"
    >
      <Columns :fields="tableFields" />
      <el-table-column fixed="right" width="80">
        <template #header>
          <div
            style="display: flex; justify-content: center; align-items: center"
          >
            <div style="margin-right: 10px">操作</div>
            <SetColumn v-model:fields="tableFields" />
          </div>
        </template>
        <template #default="scope">
          <el-button
            type="primary"
            @click.prevent="openForm(scope.row, '编辑')"
          >
            详情
          </el-button>
          <!-- <el-button type="danger" @click.prevent="deleteRow(scope.row)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
      <div class="demonstration"></div>
      <el-pagination
        v-model:current-page="currentPage4"
        v-model:page-size="pageSize4"
        :page-sizes="[10, 20, 50, 100]"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="sum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- <Pagination ref="paginationRef" :params="searchParams" :reqFunc="search" @pageData="setTableData" /> -->
    <FormEdit
      ref="editRef"
      :formDesc="formDesc"
      :rules="rules"
      @submit="submitForm"
    />
  </div>

  <el-dialog
    v-model="sequenceDialogVisible"
    title="生成时序图"
    width="80%"
    fullscreen
  >
    <SequenceItem></SequenceItem>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="sequenceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="sequenceDialogVisible = false">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog
    v-model="authorDialogVisible"
    title="生成作者图"
    width="80%"
    fullscreen
  >
    <AuthorItem></AuthorItem>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="authorDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="authorDialogVisible = false">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>


</template>

<script setup lang="ts">
import useTableField from "./tableField";
import useTableData from "./tableData";
import useExtraAction from "./extraAction";
import useFromEdit from "./formEdit";
import SequenceItem from "./SequenceItem.vue"
import AuthorItem from "./AuthorItem.vue"
// import SearchItem from "./SearchItem.vue"
import { useSearchResult } from "@/stores/searchResult";
import { search } from "@/api/search";

import { ref, onMounted } from "vue";
import tableField from "./tableField";
import { column } from "element-plus/es/components/table-v2/src/common";


const searchResult = useSearchResult();
let resultPaper=ref([]);
const {
  searchParams,
  tableData,
  paginationRef,
  getListFunc,
  setTableData,
  refreshTable,
  resetParams,
} = useTableData();
const { tableFields } = useTableField();
const { openForm, rules, formDesc, submitForm, editRef } =
  useFromEdit(refreshTable);
const { deleteRow } = useExtraAction(refreshTable);

const table = ref(null)
const thisTableData = ref([]);
const currentPage1 = ref(5);
const currentPage2 = ref(5);
const currentPage3 = ref(5);
const currentPage4 = ref(1);
const pageSize2 = ref(100);
const pageSize3 = ref(100);
const pageSize4 = ref(20);
const sum = ref(0);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);

//每页最大容量变化
const handleSizeChange = (val: number) => {
  // console.log(`${val} items per page`);
  console.log(`${pageSize4.value} items per page`);
  getThisTableData(currentPage4.value,pageSize4.value)
  table.value.setScrollTop(0);

};
//更改页面
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  getThisTableData(currentPage4.value,pageSize4.value)
  table.value.setScrollTop(0);
};
//获取表格数据
const getThisTableData = (page:number,size:number):void=>{
  thisTableData.value = resultPaper.value.slice((page-1)*size,page*size)
}
//年份排序
const onsortByYear = (column:any)=>{
  console.log(column.order)
  searchResult.sortByYear(column.order);
  currentPage4.value=1;
  getThisTableData(1,pageSize4.value)
  table.value.setScrollTop(0);
}

const sequenceDialogVisible = ref(false)
const generateSequence = (val: number) => {
  console.log(`生成时序图`);
  sequenceDialogVisible.value = true;
  searchResult.setNoAbs()
};

const authorDialogVisible = ref(false)
const generateAuthor = (val: number) => {
  console.log(`生成时序图`);
  authorDialogVisible.value = true;
  searchResult.setNoAbs()
};



onMounted(() => {
  resultPaper.value=searchResult.getData;
  sum.value=resultPaper.value.length;
  getThisTableData(1,pageSize4.value)
});

// const moniRequest = ():void =>{
//   return searchResult.getData;
// }
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  padding: 10px 0;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
