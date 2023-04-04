<template>
  <div class="num-pad-container">
    <div class="num-pad-condition">
      <el-radio-group v-model="maxNum">
        <el-radio-button
          size="large"
          :label="10">
          10以内
        </el-radio-button>
        <el-radio-button
          size="large"
          :label="20">
          20以内
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="num">
      {{ num }}
    </div>
    <div class="points">
      <template v-if="num < 10">
        <TransitionGroup
          name="list"
          class="point-col"
          appear
          tag="div">
          <div
            class="point"
            v-for="n in num"></div>
        </TransitionGroup>
      </template>
      <template v-else>
        <TransitionGroup
          name="list"
          class="point-col"
          appear
          tag="div">
          <div
            class="point"
            v-for="n in 10"></div>
        </TransitionGroup>
        <TransitionGroup
          name="list"
          class="point-col"
          appear
          tag="div">
          <div
            class="point"
            v-for="n in num - 10"></div>
        </TransitionGroup>
      </template>
    </div>
    <div class="num-pad-action">
      <el-button
        size="large"
        @click="minus">
        - 减
      </el-button>
      <el-button
        size="large"
        @click="add">
        + 加
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const num = ref(0);
const maxNum = ref(10);

function add() {
  if (num.value < maxNum.value - 1) {
    num.value++;
  }
}

function minus() {
  if (num.value > 0) {
    num.value--;
  }
}
</script>
<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.num-pad-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .num-pad-condition {
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }
  .num {
    font-size: 200px;
    text-align: center;
  }
  .points {
    flex: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    .point-col {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      padding: 0 30px;
      height: 200px;
      width: 100%;
      .point {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        background-color: var(--el-color-primary);
        margin-right: 10px;
      }
    }
  }
  .num-pad-action {
    padding: 10px 0;
    text-align: center;
  }
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute;
}
</style>
