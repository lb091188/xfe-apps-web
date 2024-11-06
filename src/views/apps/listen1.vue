<template>
  <div class="listen-container">
    <div
      class="viewer"
      ref="viewerRef">
      <div class="question">
        <div>{{ questionNumber }}</div>
        <div>有几个“{{ question }}”呢？</div>
      </div>
      <div
        class="answer"
        v-show="showAnswer">
        {{ answer }}
        个
        {{ question }}
      </div>
    </div>
    <div class="actions">
      <el-input-number
        v-model="length"
        controls-position="right"
        size="large"></el-input-number>
      <el-button
        size="large"
        type="warning"
        @click="reset">
        重置
      </el-button>
      <el-button
        size="large"
        plain
        type="danger"
        v-show="!showAnswer"
        @click="toShowAnswer">
        查看答案
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
const questionNumber = ref();
const question = ref<number>();
const showAnswer = ref(false);
const answer = ref();
const length = ref(4);

const viewerRef = ref();
const fontSize = ref("12px");

function randomSetItem(setItem: Set<number>): number {
  const setArr = Array.from(setItem);
  const randomIndex = Math.floor(Math.random() * setArr.length);
  return setArr[randomIndex];
}

function generateQuestion() {
  const random = Math.random();
  const randomNum = random * Number(`1e${length.value}`);
  let number = randomNum.toFixed(0);
  const numLength = number.toString().length;
  if (numLength < length.value) {
    for (let i = 0; i < length.value - numLength; i++) {
      number = "0" + `${number}`;
    }
  }
  console.log(number, randomNum);

  let numSet = new Set<number>();
  let numArr = number.split("").map((num) => parseInt(num));
  numArr.forEach((num) => {
    numSet.add(num);
  });
  question.value = randomSetItem(numSet);
  questionNumber.value = number;
  answer.value = numArr.filter((num) => num === question.value).length;
}

function toShowAnswer() {
  showAnswer.value = true;
}

function reset() {
  showAnswer.value = false;
  generateQuestion();
}
onMounted(() => {
  generateQuestion();
  if (viewerRef.value) {
    let { width, height } = viewerRef.value.getBoundingClientRect();
    fontSize.value = `${Math.floor(Math.max(width, height) / 20)}px`;
  }
});
</script>
<style lang="scss">
html,
body,
#app,
.listen-container {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
.listen-container {
  --font-size: v-bind(fontSize);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .viewer {
    flex: 1;
    display: flex;
    overflow: hidden;
    font-size: var(--font-size);
    .question,
    .answer {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .question {
      font-size: 1em;
    }
  }
  .actions {
    height: 50px;
    background-color: var(--el-color-white);
    box-shadow: var(--el-boxshadow);
    display: flex;
    justify-content: center;
    align-items: center;
    .el-input-number {
      margin-right: 15px;
    }
  }
}

@media screen and (orientation: portrait) {
  .listen-container {
    .viewer {
      flex-direction: column;
    }
  }
}
</style>
