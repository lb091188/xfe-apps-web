<template>
  <router-view></router-view>
</template>
<style lang="scss">
.apps-container {
  .el-page-header__header {
    padding: 16px 15px;
    background-color: var(--el-bg-color);
    .header-title {
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .el-page-header.is-contentful .el-page-header__main {
    margin-top: 0;
  }
}
</style>
