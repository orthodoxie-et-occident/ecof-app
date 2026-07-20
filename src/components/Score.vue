<template>
  <div ref="container" class="chant-score" v-html="svg"></div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue"
import { getVerovioToolkit } from "@/composables/useVerovio"

const props = defineProps({
  mei: { type: String, required: true },
  scale: { type: Number, default: 45 },
})

const svg = ref("")
const container = ref(null)
let resizeObserver = null
let vrvToolkit = null
let currentMei = null

function pxToVerovioUnits(px) {
  return Math.round(px * (100 / props.scale) * 1.2)
}

async function render() {
  if (!container.value || !currentMei) return

  const width = container.value.clientWidth
  if (width === 0) return

  vrvToolkit = vrvToolkit || (await getVerovioToolkit())

  vrvToolkit.setOptions({
    scale: props.scale,
    adjustPageHeight: true,
    breaks: "auto",
    pageWidth: pxToVerovioUnits(width),
    pageMarginLeft: 0,
    pageMarginRight: 0,
  })

  vrvToolkit.loadData(currentMei)
  const pageCount = vrvToolkit.getPageCount()
  let out = ""
  for (let i = 1; i <= pageCount; i++) {
    out += vrvToolkit.renderToSVG(i)
  }
  svg.value = out
}

onMounted(async () => {
  currentMei = props.mei
  await render()

  resizeObserver = new ResizeObserver(() => render())
  resizeObserver.observe(container.value)
})

watch(
  () => props.mei,
  (val) => {
    currentMei = val
    render()
  },
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.chant-score :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}
</style>
