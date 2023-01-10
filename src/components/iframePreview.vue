<style lang="scss" scoped>
@import "./preview.scss";
.iframe-preview {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10086;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  user-select: none;
  .iframe-preview-box {
    width: 100%;
    height: 100%;
    border: 0;
  }
  .close {
    position: absolute;
    right: 25px;
    top: 12px;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    i {
      font-size: 14px;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>

<template>
  <div class="iframe-preview">
    <iframe
      class="iframe-preview-box"
      :src="src"
      border="0"
      ref="iframeRef"></iframe>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{ src: string }>();

const iframeRef = ref<HTMLIFrameElement | null>(null);

onMounted(() => {
  iframeRef.value?.addEventListener("load", (event) => {
    let e = event as unknown as { path: HTMLIFrameElement[] };
    console.log("iframe load", e.path[0].contentDocument);
    let style = document.createElement("style");
    style.innerText = `
    body::-webkit-scrollbar {
      width: 3px;
      height: 3px;
    }
    body::-webkit-scrollbar-thumb {
      background-color: #dee3ea;
      border-radius: 3px;
    }
    body::-webkit-scrollbar-track {
      border-radius: 0;
      background: #fff;
    }
  `;
    (e.path[0].contentDocument as Document).body.appendChild(style);
  });
});
</script>
