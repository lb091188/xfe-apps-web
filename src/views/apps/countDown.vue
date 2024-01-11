<template>
  <section class="count-down-container">
    <div class="count-down-animation-bg">
      <TransitionGroup name="el-zoom-in-center">
        <div
          class="count-down-animation-item"
          v-for="i in timeLen"
          :key="i"></div>
      </TransitionGroup>
    </div>
    <div
      class="count-down-time-choose"
      v-if="!isCountDown">
      <div
        v-for="time in timesList"
        @click="startCountDown(time)"
        class="count-down-time-choose-item">
        {{ time.name }}
      </div>
    </div>
    <div
      v-else
      class="count-down-time-view"
      @click="stopCountDown">
      {{ timeStr }}
    </div>
  </section>
</template>
<script setup lang="ts">
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import zhCN from "dayjs/locale/zh-cn";
import { ref, reactive, computed } from "vue";

dayjs.locale(zhCN);
dayjs.extend(duration);

const timeLen = ref(0);
const timeStr = computed(() => {
  if (timeLen.value % 2 === 0) {
    return dayjs.duration(timeLen.value, "second").format("HH:mm:ss");
  } else {
    return dayjs.duration(timeLen.value, "second").format("HH.mm.ss");
  }
});
const timeCol = ref(0);
const timeRow = ref(0);

const timesList = reactive([
  { name: "5 分钟", value: 300 },
  { name: "10 分钟", value: 600 },
  { name: "20 分钟", value: 1200 },
  { name: "30 分钟", value: 1800 },
  { name: "60 分钟", value: 3600 },
  { name: "120 分钟", value: 7200 },
]);

let timer: number | null = null;
// @ts-ignore
let wakeLockInstance: WakeLockSentinel | null = null;
const isCountDown = ref(false);
function startCountDown(time) {
  let val = time.value;
  timeLen.value = val;
  timeRow.value = timeCol.value = Math.floor(Math.sqrt(val));
  isCountDown.value = true;
  // @ts-ignore
  navigator.wakeLock.request("screen").then((lock) => {
    wakeLockInstance = lock;
  });
  timer = setInterval(() => {
    if (timeLen.value > 0) {
      timeLen.value--;
    } else {
      clearInterval(timer as number);
      wakeLockInstance?.release();
      timer = null;
      isCountDown.value = false;
      wakeLockInstance = null;
    }
  }, 990);
}

function stopCountDown() {
  clearInterval(timer as number);
  wakeLockInstance?.release();
  timer = null;
  isCountDown.value = false;
  wakeLockInstance = null;
  timeLen.value = 0;
  timeCol.value = 0;
  timeRow.value = 0;
}
</script>
<style lang="scss">
html,
body,
#app,
.count-down-container {
  --time-col: v-bind(timeCol);
  --time-row: v-bind(timeRow);
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.count-down-container {
  .count-down-animation-bg,
  .count-down-time-choose,
  .count-down-time-view {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
  }
  .count-down-animation-bg {
    z-index: 1;
    justify-content: flex-start;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    background-image: radial-gradient(var(--el-color-primary-light-7), var(--el-color-primary-light-9), var(--el-color-primary-light-7));
    .count-down-animation-item {
      width: calc(100vw / var(--time-col) - 8px);
      height: calc(100vh / var(--time-row) - 8px);
      box-sizing: border-box;
      margin: 3px;
      background-color: var(--el-color-primary-light-3);
    }
  }
  .count-down-time-choose {
    z-index: 10;
    justify-content: center;
    align-items: center;
    align-content: space-evenly;
    flex-wrap: wrap;
    .count-down-time-choose-item {
      width: 40vw;
      height: 32vh;
      font-size: 5vw;
      color: var(--el-color-white);
      cursor: pointer;
      background-color: var(--el-color-primary);
      display: flex;
      justify-content: center;
      align-items: center;
      &:nth-child(2n) {
        margin-left: 1vw;
      }
    }
  }
  .count-down-time-view {
    z-index: 20;
    justify-content: center;
    align-items: center;
    font-size: 10vw;
    color: var(--el-color-white);
  }
}
</style>
