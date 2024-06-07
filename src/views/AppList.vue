<template>
  <div class="xfe-apps-web-list-container">
    <div
      class="xfe-apps-web-list-item"
      v-for="app in apps"
      @click="goto(app)">
      <h3>{{ app.name }}</h3>
      <p>{{ app.description }}</p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

const router = useRouter();
const apps = ref([
  {
    name: "bat脚本构建工具",
    description: "通过GUI工具，通过设置项目的名字、本机磁盘位置、路径、勾选要运行的任务，设置好数据后来构建能运行于Windows的脚本",
    path: "/app/create-fe-bat-code",
  },
  {
    name: "日期计算工具",
    description: "计算时间日期之间的间隔，可以计算两个时间指定单位的间隔，例如两个时间相差多少天，指定时间加减指定单位的间隔得到的时间",
    path: "/app/time-calculation",
  },
  {
    name: "幼小衔接-数与量",
    description: "用数字和点展示数与量",
    path: "/app/num-pad",
  },
  {
    name: "可视化倒计时钟",
    description: "用可视化的方式表示时间的流失，助理形成时间观念",
    path: "/app/count-down",
  },
  {
    name: "QtScrcpy 按键映射辅助",
    description: "根据手机截图用可视化的方式来辅助创建 QtScrcpy 的 keymap.json 文件",
    path: "/app/qt-scrcpy-keymap",
  },
]);
function goto(app) {
  router.push(app.path);
}

onMounted(() => {});
</script>
<style lang="scss">
.xfe-apps-web-list-container {
  width: 100%;
  padding: 10px 15px;
  box-sizing: border-box;
  .xfe-apps-web-list-item {
    background-color: var(--el-bg-color);
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    line-height: 25px;
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
    h3 {
      margin: 0;
      font-size: 18px;
      color: var(--el-text-color-primary);
    }
    p {
      margin: 0;
      font-size: 12px;
      color: var(--el-text-color-regular);
    }
  }
}
</style>
