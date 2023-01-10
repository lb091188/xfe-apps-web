<style lang="scss" scoped>
@import "./preview.scss";
.video-preview {
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
  background-color: rgba(0, 0, 0, 1);
  box-sizing: border-box;
  user-select: none;
  .video-preview-box {
    width: 100%;
    height: 100%;
    border: 0;
  }
  .close {
    position: absolute;
    right: 25px;
    top: 12px;
    width: $buttonSize;
    height: $buttonSize;
    line-height: $buttonSize;
    text-align: center;
    background-color: $buttonBg;
    border-radius: 50%;
    i {
      font-size: $buttonIconSize;
      color: $buttonColor;
      cursor: pointer;
    }
  }
}
</style>

<template>
  <div class="video-preview">
    <video
      class="video-preview-box"
      :src="src"
      controls></video>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ src: string }>();
</script>
