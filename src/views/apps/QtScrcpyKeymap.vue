<template>
  <section class="qt-scrcpy-keymap-container">
    <div class="key-types">
      <div class="key-type-item">
        <div class="name">映射开关:</div>
        <kbd>~</kbd>
        <div class="tips">
          点击修改
          <br />
          点击切换映射开关
        </div>
      </div>
      <div class="key-type-item">
        <div
          class="name"
          :class="`${hasSetMouseMove ? '' : 'draggable'}`"
          :draggable="!hasSetMouseMove"
          @dragstart="insetMouseMoveData">
          鼠标移动映射
        </div>
        <div class="tips">
          <template v-if="!hasSetMouseMove">
            拖拽添加
            <br />
          </template>
          鼠标移动映射
        </div>
      </div>
      <div class="key-type-item">
        <div
          class="name draggable"
          draggable="true"
          @dragstart="insetKeyMapData($event, 'KMT_STEER_WHEEL')">
          方向
        </div>
        <div
          class="name draggable"
          draggable="true"
          @dragstart="insetKeyMapData($event, 'KMT_CLICK')">
          单击
        </div>
        <div
          class="name draggable"
          draggable="true"
          @dragstart="insetKeyMapData($event, 'KMT_CLICK_TWICE')">
          双击
        </div>
        <div
          class="name draggable"
          draggable="true"
          @dragstart="insetKeyMapData($event, 'KMT_CLICK_MULTI')">
          连击
        </div>
        <div
          class="name draggable"
          draggable="true"
          @dragstart="insetKeyMapData($event, 'KMT_DRAG')">
          拖拽
        </div>
        <div class="tips">
          拖拽添加
          <br />
          将键盘的按键映射为普通的手指点击
        </div>
      </div>
      <div class="key-type-item">
        <div class="name">
          选择截图
          <input
            type="file"
            class="choose-screenshot"
            accept="image/*"
            @change="fileChange" />
        </div>
        <div class="tips">
          点击选择
          <br />
          选择后可以根据截图来布局映射按键
        </div>
      </div>
      <div class="key-type-item">
        <div class="name save">保存</div>
        <div class="tips">
          点击选择
          <br />
          将配置保存为 keymap.json
        </div>
      </div>
    </div>
    <div
      class="screenshot-container"
      ref="screenshotContainerRef">
      <img
        :src="screenshot"
        ref="screenshotRef"
        @load="screenshotLoad" />
      <svg
        class="screenshot-map-keys"
        version="1.1"
        baseProfile="full"
        ondragover="return false"
        @drop="onDrop"
        :width="screenshotSize.width"
        :height="screenshotSize.height"
        :viewBox="viewBox"
        xmlns="https://www.w3.org/2000/svg"
        xmlns:xlink="https://www.w3.org/1999/xlink"
        xml:space="preserve">
        <template v-for="node in keyNodes">
          <circle
            v-if="node?.data.type === 'KMT_CLICK'"
            r="20"
            :cx="node?.x"
            :cy="node?.y"
            fill="rgba(0,0,0,0.3)"></circle>
          <circle
            v-if="node?.data.type === 'KMT_CLICK_TWICE'"
            r="20"
            :cx="node?.x"
            :cy="node?.y"
            fill="rgba(0,0,0,0.3)"
            stroke="rgba(0,0,0)"
            stroke-width="2"
            stroke-dasharray="5,5"></circle>
          <circle
            v-if="node?.data.type === 'KMT_CLICK_MULTI'"
            r="20"
            :cx="node?.x"
            :cy="node?.y"
            fill="rgba(0,0,0,0.3)"
            stroke="rgba(0,0,0)"
            stroke-width="2"></circle>
          <line
            v-if="node?.data.type === 'KMT_DRAG'"
            :x1="node?.x1"
            :y1="node?.y1"
            :x2="node?.x2"
            :y2="node?.y2"
            stroke="rgba(0,0,0)"
            stroke-width="8"
            stroke-linecap="round"></line>
          <g v-if="node?.data.type === 'KMT_STEER_WHEEL'">
            <circle
              r="20"
              :cx="node?.x"
              :cy="node?.y"
              fill="rgba(0,0,0,0.3)"
              stroke="rgba(0,0,0)"
              stroke-width="2"></circle>
          </g>
        </template>
      </svg>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, computed, reactive, onMounted } from "vue";
import type { KMT_CLICK, KMT_CLICK_MULTI, KMT_CLICK_TWICE, KMT_DRAG, KMT_STEER_WHEEL, KeyMap } from "@/util/QtScrcpyKeymap/types";

const screenshot = ref("");
const screenshotSize = reactive({
  x: 0,
  y: 0,
  width: 1920,
  height: 1080,
});
const viewBox = computed(() => {
  return `0 0 ${screenshotSize.width} ${screenshotSize.height}`;
});
const screenshotRef = ref();
const screenshotContainerRef = ref();
function fileChange(e) {
  let file = e.target.files[0];
  if (!file) {
    return;
  }

  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e: ProgressEvent) {
    // e.target.result 是包含文件内容的Base64编码的data URL
    // @ts-ignore
    let base64Data = e.target?.result;
    screenshot.value = base64Data;
  };
  reader.onerror = function (e: Event) {
    console.error("Error reading file", e);
  };
}
function screenshotLoad() {
  if (screenshotRef.value) {
    let { x, y, width, height } = screenshotRef.value.getBoundingClientRect();
    screenshotSize.x = x;
    screenshotSize.y = y;
    screenshotSize.width = width;
    screenshotSize.height = height;
  }
}

const hasSetMouseMove = computed(() => {
  return false;
});

const keyMapConfig = reactive<KeyMap>({
  switchKey: "Key_QuoteLeft",
  mouseMoveMap: {},
  keyMapNodes: [],
});

const keyNodes = computed(() => {
  return keyMapConfig.keyMapNodes.map((item) => {
    switch (item.type) {
      case "KMT_CLICK":
      case "KMT_CLICK_TWICE":
      case "KMT_CLICK_MULTI":
        return {
          data: item,
          x: item.pos.x,
          y: item.pos.y,
        };
      case "KMT_DRAG":
        return {
          data: item,
          x1: item.startPos.x,
          y1: item.startPos.y,
          x2: item.endPos.x,
          y2: item.endPos.y,
        };
      case "KMT_STEER_WHEEL":
        return {
          data: item,
          x: item.centerPos.x,
          y: item.centerPos.y,
        };

      default:
        break;
    }
  });
});

function insetMouseMoveData(e: DragEvent) {
  if (e.dataTransfer) {
    e.dataTransfer.setData("text/plain", "mousemove");
    e.dataTransfer.effectAllowed = "copy";
  }
}

function insetKeyMapData(e: DragEvent, type: string) {
  if (e.dataTransfer) {
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "copy";
  }
}

function onDrop(event) {
  const { pageX, pageY } = event;
  const { scrollTop, scrollLeft } = screenshotContainerRef.value;

  let x = pageX - screenshotSize.x + scrollLeft;
  let y = pageY - screenshotSize.y + scrollTop;
  const data = event.dataTransfer.getData("text/plain");
  console.log(data);
  switch (data) {
    case "KMT_CLICK":
      let kmtClick: KMT_CLICK = {
        comment: "",
        type: "KMT_CLICK",
        key: "",
        pos: {
          x,
          y,
        },
        switchMap: false,
      };
      keyMapConfig.keyMapNodes.push(kmtClick);
      break;
    case "KMT_CLICK_TWICE":
      let kmtClickTwice: KMT_CLICK_TWICE = {
        comment: "",
        type: "KMT_CLICK_TWICE",
        key: "",
        pos: {
          x,
          y,
        },
      };
      keyMapConfig.keyMapNodes.push(kmtClickTwice);
      break;
    case "KMT_CLICK_MULTI":
      let kmtClickMulit: KMT_CLICK_MULTI = {
        comment: "",
        type: "KMT_CLICK_MULTI",
        key: "",
        pos: {
          x,
          y,
        },
        delay: 10,
      };
      keyMapConfig.keyMapNodes.push(kmtClickMulit);
      break;
    case "KMT_DRAG":
      let kmtDrag: KMT_DRAG = {
        comment: "",
        type: "KMT_DRAG",
        key: "",
        startPos: {
          x,
          y,
        },
        endPos: {
          x: x + 20,
          y: y + 20,
        },
      };
      keyMapConfig.keyMapNodes.push(kmtDrag);
      break;
    case "KMT_STEER_WHEEL":
      let kmtSteerWheel: KMT_STEER_WHEEL = {
        comment: "",
        type: "KMT_STEER_WHEEL",
        centerPos: {
          x,
          y,
        },
        leftOffset: 0.2,
        rightOffset: 0.2,
        upOffset: 0.2,
        downOffset: 0.2,
        leftKey: "",
        rightKey: "",
        upKey: "",
        downKey: "",
      };
      keyMapConfig.keyMapNodes.push(kmtSteerWheel);
      break;
    case "mousemove":
      keyMapConfig.mouseMoveMap = {
        startPos: {
          x,
          y,
        },
        speedRatio: 10,
        speedRatioX: 3.25,
        speedRatioY: 1.25,
      };
      break;

    default:
      break;
  }
  event.preventDefault();
}

function save() {}

onMounted(() => {
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    console.log(e.code);
    e.preventDefault();
  });
});
</script>
<style lang="scss">
html,
body,
#app,
.qt-scrcpy-keymap-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.qt-scrcpy-keymap-container {
  display: flex;
  flex-direction: column;
  .key-types {
    display: flex;
    background-color: var(--el-bg-color);
    .key-type-item {
      padding: 5px;
      flex: 1;
      .name {
        position: relative;
        display: inline-block;
        border: 1px solid var(--el-border-color);
        border-radius: 6px;
        padding: 3px 8px;
        color: var(--el-text-color);
        background-color: var(--el-color-white);
        &.draggable {
          cursor: grab;
        }
        .choose-screenshot {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          opacity: 0;
          cursor: pointer;
        }
        &.save {
          cursor: pointer;
        }
      }
      .name + .name {
        margin-left: 5px;
      }
      kbd {
        vertical-align: middle;
        margin: 0 5px;
        padding: 0 16px;
        display: inline-block;
        border-radius: 6px;
        line-height: 20px;
        background-color: var(--el-fill-color-darker);
        box-shadow: 1px 1px 0 1px var(--el-text-color-secondary), 2px 2px 0 1px var(--el-text-color-secondary), 3px 3px 0 1px var(--el-text-color-secondary);
      }
      .tips {
        font-size: 0.5em;
        line-height: 20px;
        color: var(--el-text-color-secondary);
      }
    }
  }
  .screenshot-container {
    flex: 1;
    border: 1px solid var(--el-border-color);
    position: relative;
    overflow: auto;
    img {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
    }
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background-color: var(--el-bg-color-page);
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background-color: var(--el-text-color-secondary);
    }
  }
}
</style>
