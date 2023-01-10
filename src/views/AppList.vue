<template>
  <div class="xfe-apps-web-list-container">
    <div
      class="xfe-apps-web-list-item"
      v-for="app in apps"
      @click="goto(app)">
      {{ app.name }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";

const router = useRouter();
const apps = ref([
  {
    name: "前端开发脚本构建工具",
    path: "/app/create-fe-bat-code",
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
  padding: 15px 20px;
  box-sizing: border-box;
}
.xfe-apps-web-list-item {
  line-height: 60px;
  background-color: var(--el-bg-color);
  padding: 10px 15px;
  font-size: 24px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
}
</style>
