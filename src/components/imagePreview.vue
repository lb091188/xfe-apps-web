<style lang="scss" scoped>
@import "./preview.scss";
.image-preview {
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
  background-color: rgb(0, 0, 0);
  box-sizing: border-box;
  user-select: none;
  .image-preview-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      position: relative;
    }
  }
}
</style>

<template>
  <div
    class="image-preview"
    @mousewheel="zoomImage($event)">
    <div
      class="image-preview-box"
      :style="boxStyle">
      <img
        :style="imgStyle"
        v-show="!imageLoading"
        @load="imageLoader"
        @mousedown="addDragHandler($event)"
        ref="img"
        :src="src" />
      <div
        class="loading"
        v-show="imageLoading">
        图片正在加载中……
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { rafThrottle } from "@/util";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

function on(element: HTMLElement | Document, event: string, handler) {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
}

function off(element: HTMLElement | Document, event: string, handler) {
  if (element && event) {
    element.removeEventListener(event, handler, false);
  }
}

const props = defineProps<{ src: string }>();

const imageLoading = ref(false);
const ownIndex = ref(1);
const zoomCount = ref(10);
const offsetX = ref(0);
const offsetY = ref(0);
const cursor = ref("auto");
const maxHeight = ref(600);
const maxWidth = ref(1000);
const imgHeight = ref(600);
const imgWidth = ref(1000);
const img = ref<HTMLImageElement | null>(null);

const zoom = computed(() => {
  if (zoomCount.value < 2) {
    return 2 / 10;
  } else {
    return zoomCount.value / 10;
  }
});

const imgStyle = computed(() => {
  return {
    transform: `scale(${zoom.value})`,
    left: `${offsetX.value}px`,
    top: `${offsetY.value}px`,
    cursor: cursor.value,
    height: `${imgHeight.value}px`,
    width: `${imgWidth.value}px`,
  };
});
const boxStyle = computed(() => {
  return {
    height: `${maxHeight}px`,
    width: `${maxWidth}px`,
  };
});

onMounted(() => {
  getBoxSize();
  window.addEventListener("resize", getBoxSize);
  window.document.addEventListener("keydown", keyPressHandler);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keydown", keyPressHandler);
  window.removeEventListener("resize", getBoxSize);
});
function getBoxSize() {
  maxHeight.value = document.body.offsetHeight - 0;
  maxWidth.value = document.body.offsetWidth - 0;
}
function imageLoader() {
  imageLoading.value = false;
  let imgHeight = (img?.value as HTMLImageElement).naturalHeight;
  let imgWidth = (img?.value as HTMLImageElement).naturalWidth;
  let scale = imgHeight / imgWidth;
  if (imgHeight > imgWidth) {
    imgWidth = maxHeight.value / scale;
    imgHeight = maxHeight.value;
  } else {
    let scaleHeight = maxWidth.value * scale;
    if (scaleHeight > maxHeight.value) {
      imgHeight = maxHeight.value;
      imgWidth = maxHeight.value / scale;
    } else {
      imgHeight = scaleHeight;
      imgWidth = maxWidth.value;
    }
  }
}
function zoomImage(e) {
  if (e.deltaY > 0 && zoomCount.value > 2) {
    zoomCount.value--;
  } else if (e.deltaY < 0 && zoomCount.value < 50) {
    zoomCount.value++;
  }
}
function addDragHandler(e) {
  e.preventDefault();
  const startX = e.screenX - offsetX.value;
  const startY = e.screenY - offsetY.value;
  const _dragHandler = rafThrottle((evt) => {
    offsetX.value = evt.screenX - startX;
    offsetY.value = evt.screenY - startY;
  });
  cursor.value = "grab";
  on(document, "mousemove", _dragHandler);
  on(document, "mouseup", (ev) => {
    off(document, "mousemove", _dragHandler);
    cursor.value = "auto";
  });
}
function keyPressHandler(e) {
  let key = e.keyCode || e.which;
  switch (key) {
    // ←
    case 37:
      // prev();
      break;
    // →
    case 39:
      // next();
      break;
    // Esc
    case 27:
      close();
      break;

    default:
      break;
  }
}
function reset() {
  offsetX.value = 0;
  offsetY.value = 0;
  zoomCount.value = 10;
}
</script>
