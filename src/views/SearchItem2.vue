<template>
  <div style="text-align: center">
    <el-form ref="formRef" :model="dynamicValidateForm" class="demo-dynamic">
      <el-form-item prop="date">
        <el-date-picker
          v-model="dynamicValidateForm.dateRange"
          type="monthrange"
          change="changeMonth"
          value-format="YYYY:MM"
          unlink-panels
          range-separator="至"
          start-placeholder="起始日期"
          end-placeholder="终止日期"
          :shortcuts="shortcuts"
        />
      </el-form-item>

      <el-form-item
        v-for="(domain, index) in dynamicValidateForm.domains"
        :key="domain.key"
        :prop="'domains.' + index + '.value'"
        :rules="{
          required: true,
          message: 'domain can not be null',
          trigger: 'blur',
        }"
        
      >
        <el-row :gutter="8" class="row-bg" justify="space-around">
          <el-col :span="4">
            <el-select
              v-model="domain.condition"
              class="m-2"
              placeholder="条件"
            >
              <el-option
                v-for="item in conOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="domain.type" class="m-2" placeholder="主题">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-input v-model="domain.value" />
          </el-col>
          <el-col :span="4">
            <el-button class="mt-2" @click.prevent="removeDomain(domain)"
              >Delete</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)"
          >Submit</el-button
        >
        <el-button @click="addDomain">New domain</el-button>
        <el-button @click="resetForm(formRef)">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>


</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import type { FormInstance } from "element-plus";
// const dateRange = ref("");

const formRef = ref<FormInstance>();

const dynamicValidateForm = reactive<{
  domains: DomainItem[];
  dateRange: string;
}>({
  domains: [
    {
      key: 1,
      value: "",
      type: "",
      condition: "AND",
    },
  ],
  dateRange: "",
});



const conOptions = [
  {
    value: "AND",
    label: "AND",
  },
  {
    value: "OR",
    label: "OR",
  },
  {
    value: "NOT",
    label: "NOT",
  },
];
const typeOptions = [
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
];

interface DomainItem {
  key: number;
  value: string;
  type: string;
  condition: string;
}

const removeDomain = (item: DomainItem) => {
  const index = dynamicValidateForm.domains.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.domains.splice(index, 1);
  }
};

const addDomain = () => {
  dynamicValidateForm.domains.push({
    key: Date.now(),
    value: "",
    type: "",
    condition: "AND",
  });
};

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log("submit!");
      console.log(dynamicValidateForm);
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const shortcuts = [
  {
    text: "This month",
    value: [new Date(), new Date()],
  },
  {
    text: "This year",
    value: () => {
      const end = new Date();
      const start = new Date(new Date().getFullYear(), 0);
      return [start, end];
    },
  },
  {
    text: "Last 6 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 6);
      return [start, end];
    },
  },
];

function changeMonth() {
  console.log(dynamicValidateForm.dateRange);
}
</script>
<style scoped>
/* .demo-date-picker {
  display: flex;
  width: 100%;
  padding: 0;
  flex-wrap: wrap;
} */
.demo-date-picker .block {
  padding: 30px 0;
  text-align: center;
  border-right: solid 1px var(--el-border-color);
  flex: 1;
}
.demo-date-picker .block:last-child {
  border-right: none;
}
.demo-date-picker .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.el-row {
  display: flex;
  flex-wrap: wrap;
}
</style>
