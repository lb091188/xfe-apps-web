<script setup lang="ts">
import { RouterView } from "vue-router";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
</script>

<template>
  <el-config-provider
    size="small"
    :locale="zhCn">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>
</template>

<style lang="scss">
body {
  margin: 0;
  overflow: auto;
  background-color: var(--el-bg-color-page);
  .el-affix,
  .el-affix--fixed {
    width: 100% !important;
  }
  &::-webkit-scrollbar {
    width: 3px;
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 0;
    background: transparent;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: #dee3ea;
    }
  }
}
</style>
