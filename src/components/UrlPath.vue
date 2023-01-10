<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item
      v-for="p in pathArr"
      :to="{ path: p.path }">
      {{ p.name }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "@vue/reactivity";

const props = defineProps<{ path: string }>();

const pathArr = computed(() => {
  let pathArr = props.path
    .split("/")
    .filter((item) => !!item)
    .map((item, index, arr) => {
      return {
        name: item,
        path: `/dir/${arr.slice(0, index + 1).join("/")}`,
      };
    });

  pathArr = [
    {
      name: "根",
      path: "/dir/",
    },
  ].concat(pathArr);

  return pathArr;
});
</script>
