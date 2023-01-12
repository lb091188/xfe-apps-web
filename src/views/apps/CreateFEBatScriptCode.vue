<template>
  <section class="apps-container">
    <el-page-header @back="onBack">
      <template #content>
        <h3 class="header-title">bat脚本构建工具</h3>
        <div class="header-alerts">
          <el-carousel
            height="30px"
            direction="vertical"
            :autoplay="true">
            <el-carousel-item>
              <el-alert
                title="编辑项目列表，构建能够运行在Windows的bat脚本文件。"
                type="info" />
            </el-carousel-item>
            <el-carousel-item>
              <el-alert
                title="理论上所有cmd支持的脚本都能够通过这个命令构建，遇到问题及时反馈"
                type="warning" />
            </el-carousel-item>
            <el-carousel-item>
              <el-alert
                title="你可以将bat脚本放置在指定目录中，并将指定目录添加到环境变量中"
                type="warning" />
            </el-carousel-item>
            <el-carousel-item>
              <el-alert
                title="项目地址是文件管理器中复制的包含盘符的绝对地址，会自动处理将盘符与绝对地址拆开"
                type="error" />
            </el-carousel-item>
          </el-carousel>
        </div>
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
      </template>
      <div class="bat-script-code-container">
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
                placeholder="请输入项目名称"
                @input="saveCode"
                v-model="row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="所在盘符"
            width="80">
            <template #default="{ row }">
              <el-input
                size="default"
                readonly
                :model-value="row.drive"
                placeholder="自动获取"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="项目地址"
            min-width="200">
            <template #default="{ row }">
              <el-input
                size="default"
                placeholder="项目绝对路径（例：D:\a\b)"
                v-model="row.path"
                @input="pathChange($event, row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="命令"
            min-width="600">
            <template #default="{ row }">
              <commandList
                v-model="row.command"
                @input="saveCode"></commandList>
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
                复制行
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
import { ElMessage, ElNotification } from "element-plus";
hljs.registerLanguage("bash", bash);

const router = useRouter();
function onBack() {
  router.back();
}

const drives = ["A:", "B:", "C:", "D:", "E:", "F:", "G:", "H:", "I:", "J:", "K:", "L:", "M:", "N:", "O:", "P:", "Q:", "R:", "S:", "T:", "U:", "V:", "W:", "X:", "Y:", "Z:"];
const height = ref(0);

const projectList = ref([] as any[]);

let timer: number | null = null;
function saveCode() {
  if (timer !== null) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    console.log("save code now !");
    if (projectList.value && projectList.value.length) {
      localStorage.projectList = JSON.stringify(projectList.value);
    }
  }, 3000);
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
      batSetp += `echo ${project.command.length + 1}、返回项目列表\n`;
      batSetp += `set /p num=请选择：\ncls\n`;
      project.command.forEach((cmd, k) => {
        batSetp += `if %num% == ${k + 1} (call ${cmd})\n`;
      });
      batSetp += `if %num%== ${project.command.length + 1} (goto choose)\ngoto choose\n`;
    });
    return `${batChoose}${batRun}\n${batSetp}`;
  } else {
    return "";
  }
}

function pathChange(val, row) {
  let index = val.indexOf(":");
  if (index > -1) {
    let valArr = val.split(":");
    row.drive = valArr[0] + ":";
    row.path = valArr[1];
  }
  saveCode();
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
  ElNotification({
    title: "代码复制成功！",
    dangerouslyUseHTMLString: true,
    message: "<p>项目列表编辑完成之后</p><ol><li>打开记事本</li><li>复制代码</li><li>在记事本粘贴</li><li>保存</li></ol><h3>保存的时候文件后缀名改成 .bat 编码 UTF-8 改成 ASNI</h3>",
  });
}

function copyCurrent(row, index) {
  let newRow = {
    ...row,
    command: [...row.command],
  };
  projectList.value.splice(index + 1, 1, newRow);
  saveCode();
}

function delCurrent(row, index) {
  projectList.value.splice(index, 1);
  saveCode();
}

function addProject() {
  projectList.value.push({
    name: "",
    drive: "",
    path: "",
    command: [],
  });
  saveCode();
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
    .el-page-header__left,
    .el-page-header__content,
    .header-alerts {
      flex: 1;
    }

    .el-page-header__content {
      display: flex;
      .header-alerts {
        height: 30px;
        overflow: hidden;
        margin-left: 10px;
        .el-alert {
          padding: 3px 12px;
          .el-alert__title {
            vertical-align: middle;
          }
          .el-alert__close-btn {
            top: 10px;
          }
        }
      }
    }
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
  .el-alert {
    margin-bottom: 7px;
  }
  .el-table {
    width: 100%;
  }
  .bat-script-code-actions {
    padding: 10px;
  }
}
@media screen and (max-width: 720px) {
  .create-bat-code {
    .header-alerts {
      display: none;
    }
  }
}
</style>
