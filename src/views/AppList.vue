<template>
  <view class="xfe-apps-web-list-container">
    <div
      class="xfe-apps-web-list-item"
      v-for="app in apps"
      @click="goto(app)">
      {{ app.name }}
    </div>
  </view>
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
<style lang="scss"></style>
