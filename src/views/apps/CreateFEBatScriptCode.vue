<template>
  <section class="apps-container">
    <el-page-header @back="onBack">
      <template #content>
        <h3 class="header-title">前端开发脚本构建工具</h3>
      </template>
      <template #extra>
        <el-button
          type="primary"
          size="default"
          plain
          :icon="Plus"
          @click="addProject">
          添加项目
        </el-button>
        <el-button
          type="primary"
          size="default"
          :icon="DocumentCopy"
          @click="codeCopy">
          复制代码
        </el-button>
        <el-button
          type="success"
          size="default"
          :icon="DocumentCopy"
          @click="saveCode">
          保存列表
        </el-button>
      </template>
      <div class="bat-script-code-container">
        <p class="bat-script-code-tips">编辑项目列表，构建能够运行在Windows的bat脚本文件。项目列表编辑完成之后，打开记事本 =》 复制代码 =》 在记事本粘贴 =》保存。保存的时候文件后缀名改成 .bat 编码 UTF-8 改成 ASNI</p>
        <el-table
          :data="projectList"
          :height="height"
          stripe
          border>
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"></el-table-column>
          <el-table-column
            label="项目名称"
            min-width="200">
            <template #default="{ row }">
              <el-input
                size="default"
                placeholder="请输入项目名称（例如，Element Plus)"
                v-model="row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="所在盘符"
            width="120">
            <template #default="{ row }">
              <el-select
                size="default"
                style="width: 100%"
                v-model="row.drive"
                placeholder="请选择项目所在盘符"
                filterable>
                <el-option
                  v-for="d in drives"
                  :key="d"
                  :label="d"
                  :value="d">
                  {{ d }}
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            label="相对地址"
            min-width="200">
            <template #default="{ row }">
              <el-input
                size="default"
                placeholder="项目所在目录（例如，\aDir\bProject）"
                v-model="row.path"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="命令"
            min-width="600">
            <template #default="{ row }">
              <commandList v-model="row.command"></commandList>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            fixed="right">
            <template #default="{ row, $index }">
              <el-button
                type="primary"
                plain
                :icon="DocumentCopy"
                @click="copyCurrent(row, $index)">
                复制
              </el-button>
              <el-button
                type="danger"
                plain
                :icon="Delete"
                @click="delCurrent(row, $index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-page-header>
  </section>
</template>
<script setup lang="ts">
import { DocumentCopy, Plus, Delete } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ref, onMounted, watch, onUnmounted, nextTick } from "vue";
import commandList from "./components/commandList.vue";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import "highlight.js/styles/github-dark.css";
import { ElMessage } from "element-plus";
hljs.registerLanguage("bash", bash);

const router = useRouter();
function onBack() {
  router.back();
}

const drives = ["A:", "B:", "C:", "D:", "E:", "F:", "G:", "H:", "I:", "J:", "K:", "L:", "M:", "N:", "O:", "P:", "Q:", "R:", "S:", "T:", "U:", "V:", "W:", "X:", "Y:", "Z:"];
const height = ref(0);

const projectList = ref([] as any[]);

function saveCode() {
  if (projectList.value && projectList.value.length) {
    localStorage.projectList = JSON.stringify(projectList.value);
  }
}

function createBatCode(pjList) {
  if (pjList && pjList.length) {
    let batChoose = `@echo off\n:choose\ncls\necho =========================\necho     输入如下对应序号进行选择\necho =========================\n`;
    let batRun = `set /p num=请选择：\n`;
    let batSetp = "";
    pjList.forEach((project, index) => {
      batChoose += `echo ${index + 1}、${project.name}\n`;
      batRun += `if %num% == ${index + 1} (goto step${index})\n`;
      batSetp += `\n:step${index}\ncls\n${project.drive}\ncd ${project.path}\necho 输入对应数字选择要运行的命令：\n`;
      project.command.forEach((cmd, j) => {
        batSetp += `echo ${j + 1}、${cmd}\n`;
      });
      batSetp += `set /p num=请选择：\n`;
      project.command.forEach((cmd, k) => {
        batSetp += `if %num% == ${k + 1} (call ${cmd})\n`;
      });
    });
    return `${batChoose}${batRun}\n${batSetp}`;
  } else {
    return "";
  }
}

function codeCopy() {
  let batCode = createBatCode(projectList.value);
  if (!batCode) {
    ElMessage.error("代码生成失败！");
    return false;
  }
  let inputDom = document.createElement("textarea");
  inputDom.setAttribute("readonly", "readonly");
  inputDom.value = batCode;
  document.body.appendChild(inputDom);
  inputDom.select();
  document.execCommand("Copy");
  inputDom.style.display = "none";
  inputDom.remove();
  ElMessage({
    type: "success",
    message: "代码复制成功！",
  });
}

function copyCurrent(row, index) {
  let newRow = {
    ...row,
    command: [...row.command],
  };
  projectList.value.splice(index + 1, 1, newRow);
}

function delCurrent(row, index) {
  projectList.value.splice(index, 1);
}

function addProject() {
  projectList.value.push({
    name: "",
    drive: "",
    path: "",
    command: [],
  });
}
function getHeight() {
  height.value = document.body.clientHeight - 116;
}

onMounted(() => {
  document.documentElement.className = "create-bat-code";
  nextTick(() => {
    let protList = localStorage.projectList;
    if (protList) {
      projectList.value = JSON.parse(protList);
    }
    getHeight();
  });
  window.addEventListener("resize", getHeight);
});

onUnmounted(() => {
  window.removeEventListener("resize", getHeight);
  document.documentElement.className = "";
});
</script>
<style lang="scss">
.create-bat-code {
  height: 100%;
  overflow: hidden;
  body,
  #app,
  .apps-container,
  .el-page-header {
    height: 100%;
    overflow: hidden;
  }
  .el-page-header {
    display: flex;
    flex-direction: column;
    .el-page-header__main {
      flex: 1;
      .bat-script-code-container {
        height: 100%;
        box-sizing: border-box;
      }
    }
  }
}
.bat-script-code-container {
  padding: 7px 12px;
  .bat-script-code-tips {
    font-size: 12px;
    color: var(--el-text-color-secondary);
  }
  .el-table {
    width: 100%;
  }
  .bat-script-code-actions {
    padding: 10px;
  }
}
@media screen and (max-width: 720px) {
  .bat-script-code-container {
    flex-direction: column;
    .bat-script-code-left,
    .bat-script-code-right {
      flex: auto;
    }
  }
}
</style>
