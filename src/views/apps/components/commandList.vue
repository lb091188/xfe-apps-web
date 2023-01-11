<template>
  <el-tag
    size="default"
    class="command-tag"
    type="info"
    v-for="(v, index) in modelValue"
    :key="v"
    closable
    @close="delTag(index)">
    {{ v }}
  </el-tag>
  <el-select
    class="command-tag"
    placeholder="选择或者输入新的指令"
    filterable
    allow-create
    v-model="newVal">
    <el-option
      value="npm start"
      label="npm start">
      npm start
    </el-option>
    <el-option
      value="npm run dev"
      label="npm run dev">
      npm run dev
    </el-option>
    <el-option
      value="npm run serve"
      label="npm run serve">
      npm run serve
    </el-option>
    <el-option
      value="npm run build"
      label="npm run build">
      npm run build
    </el-option>
    <el-option
      value="npm run build-only"
      label="npm run build-only">
      npm run build-only
    </el-option>
    <el-option
      value="npm run test"
      label="npm run test">
      npm run test
    </el-option>
  </el-select>
  <el-button @click="addValue">添加</el-button>
</template>
<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref } from "vue";
const props = defineProps<{
  modelValue: string[];
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string[]);
}>();

const newVal = ref("");

function delTag(index) {
  let val = props.modelValue;
  val.splice(index, 1);
  emits("update:modelValue", val);
}
function addValue() {
  let val = props.modelValue;
  if (!val.includes(newVal.value)) {
    val.push(newVal.value);
    emits("update:modelValue", val);
    newVal.value = "";
  } else {
    ElMessage.error("不能重复添加同一个命令！");
  }
}
</script>
<style lang="scss">
.command-tag {
  margin-right: 10px;
}
</style>
