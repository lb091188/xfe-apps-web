<script setup lang="ts">
import { RouterView } from "vue-router";
import { ElConfigProvider } from "element-plus";
</script>

<template>
  <el-config-provider size="small">
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
