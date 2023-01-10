<style lang="scss" scoped>
.pdf-container {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow-x: hidden;
  overflow-y: auto;
}
.pdf-actions {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 10px 5px;
  box-sizing: border-box;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 5px 0 #ccc;
  display: flex;
  align-items: center;
  .pages {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #666;
  }
  .el-button + .el-button {
    margin-left: 5px;
  }
  .el-progress {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
  }
}

.pdf-loading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  .percentage-label {
    font-size: 12px;
  }
}
</style>

<template>
  <div
    class="pdf-container"
    ref="pdfContainer">
    <canvas
      :style="canvalBoxStyle"
      ref="canvas"
      width="500"
      height="500"></canvas>
  </div>
  <div
    ref="actionsContainer"
    class="pdf-actions">
    <el-progress
      v-show="!pdfLoading && pdfLoadingPercentage < 100"
      :stroke-width="1"
      :show-text="false"
      :percentage="pdfLoadingPercentage"></el-progress>
    <el-button
      :icon="Memo"
      size="default"
      type="info"
      @click="drawer = true"
      plain></el-button>
    <div class="pages">{{ currentPage }}/{{ numPages }}</div>
    <el-button
      @click="zoomChange(1)"
      :icon="ZoomIn"
      size="default"
      type="info"
      plain></el-button>
    <el-button
      @click="zoomChange(-1)"
      :icon="ZoomOut"
      size="default"
      :disabled="zoom <= minZoom"
      type="info"
      plain></el-button>
    <el-button
      @click="renderPage(-1)"
      :icon="DArrowLeft"
      size="default"
      type="primary"
      :disabled="currentPage <= 1"
      plain></el-button>
    <el-button
      @click="renderPage(1)"
      :icon="DArrowRight"
      size="default"
      :disabled="currentPage >= numPages"
      type="primary"
      plain></el-button>
  </div>
  <el-drawer
    v-model="drawer"
    direction="ltr"
    size="100%"
    title="目录">
    <el-tree
      :data="outLine"
      @node-click="outLineClick" />
  </el-drawer>
  <div
    class="pdf-loading"
    v-show="pdfLoading">
    <el-progress
      type="dashboard"
      :percentage="pdfLoadingPercentage">
      <template #default="{ percentage }">
        <p class="percentage-value">{{ percentage }}%</p>
        <p class="percentage-label">文档加载中</p>
      </template>
    </el-progress>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from "pdfjs-dist/legacy/build/pdf";
import pdfjsWork from "pdfjs-dist/legacy/build/pdf.worker.entry";
import { DArrowRight, DArrowLeft, Memo, ZoomIn, ZoomOut } from "@element-plus/icons-vue";
import { rafThrottle } from "@/util";

const pdfLoading = ref(false);
const pdfLoadingPercentage = ref(0);

const drawer = ref(false);

const props = defineProps<{ src: string }>();
const pdfContainer = ref<HTMLDivElement | null>(null);
const actionsContainer = ref<HTMLDivElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

let context: CanvasRenderingContext2D | null | undefined = null;
let scale = 5;
let viewPortWidth = 0;
const zoom = ref(0);
const minZoom = ref(1);
const zoomStep = ref(0.1);
const currentPage = ref(1);
const numPages = ref(0);
let pdf: PDFDocumentProxy | null = null;

interface OutLineInfo {
  label: string;
  ref: { num: number; gen: number };
  children: OutLineInfo[];
}

const outLine = ref<OutLineInfo[]>([]);
function outLineClick(data) {
  if (!data.children || data.children.length === 0) {
    drawer.value = false;
    pdf?.getPageIndex(data.ref).then((res) => {
      renderPage(res - currentPage.value + 1);
    });
  }
}

const canvalBoxStyle = computed(() => {
  return {
    zoom: zoom.value,
  };
});

function zoomChange(count) {
  zoom.value += count * zoomStep.value;
  if (zoom.value < minZoom.value) {
    zoom.value = minZoom.value;
    return false;
  }
}

function renderPage(changeCount) {
  currentPage.value += changeCount;
  if (currentPage.value < 1) {
    currentPage.value = 1;
    return false;
  }
  if (currentPage.value > numPages.value) {
    currentPage.value = numPages.value;
    return false;
  }
  pdf?.getPage(currentPage.value).then(function (page) {
    var viewport = page.getViewport({ scale });
    (canvas.value as HTMLCanvasElement).width = viewport.width;
    (canvas.value as HTMLCanvasElement).height = viewport.height;
    if (zoom.value === 0) {
      let baseZoom = viewPortWidth / viewport.width;
      zoom.value = minZoom.value = baseZoom;
      zoomStep.value = baseZoom / 20;
    }
    var renderContext = {
      canvasContext: context as CanvasRenderingContext2D,
      viewport: viewport,
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(() => {
      (pdfContainer.value as HTMLDivElement).scrollTop = 0;
      (pdfContainer.value as HTMLDivElement).scrollLeft = 0;
      document.body.scrollTop = 0;
      pdfLoading.value = false;
    });
  });
}

function initRead() {
  viewPortWidth = document.body.scrollWidth;
  context = canvas.value?.getContext("2d");
  GlobalWorkerOptions.workerSrc = pdfjsWork as string;
}

function getPdfFile() {
  let localCurrentPage = localStorage.getItem(props.src);
  currentPage.value = localCurrentPage ? parseInt(localCurrentPage) : 1;
  pdfLoading.value = true;
  let task = getDocument(props.src);
  task.onProgress = rafThrottle((res) => {
    let { loaded, total } = res;
    pdfLoadingPercentage.value = parseFloat(((loaded / total) * 100).toFixed(0));
  });
  task.promise.then((_pdf) => {
    pdf = _pdf;
    numPages.value = pdf.numPages;
    pdf.getOutline().then((res) => {
      function getChild(item) {
        let newItem = {
          label: item.title,
          ref: item.dest[0],
          children: item.items.map(getChild),
        };
        return newItem;
      }
      outLine.value = res.map(getChild);
    });
    renderPage(0);
  });
}

watch(
  () => props.src,
  (src) => {
    getPdfFile();
  }
);

watch(currentPage, (current) => {
  localStorage.setItem(props.src, current.toString());
});

onMounted(() => {
  initRead();
  getPdfFile();
});
</script>
