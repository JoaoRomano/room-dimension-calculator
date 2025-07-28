<template>
  <div class="room-canvas-container">
    <canvas ref="canvasRef" :width="canvasWidth" :height="canvasHeight" class="room-canvas"></canvas>

    <div class="canvas-controls">
      <button @click="cycleDimension" class="btn" :disabled="dimensionOptions.length <= 1">
        Next Wall Reference ({{ currentDimensionIndex + 1 }}/{{ dimensionOptions.length }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import type { RoomData } from '../types/room'
import { generateAllDimensionCombinations } from '../utils/dimensions'
import { CanvasRenderer } from '../renderers/canvasRenderer'

interface Props {
  roomData: RoomData
  canvasWidth?: number
  canvasHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  canvasWidth: 1200,
  canvasHeight: 800
})

const canvasRef = ref<HTMLCanvasElement>()
const currentDimensionIndex = ref(0)
const renderer = ref<CanvasRenderer>()

// Calculate dimension options
const dimensionOptions = computed(() => {
  if (!props.roomData.corners.length) return []
  return generateAllDimensionCombinations(props.roomData.corners)
})

const currentDimension = computed(() => {
  if (dimensionOptions.value.length === 0) return null
  return dimensionOptions.value[currentDimensionIndex.value]
})

// Cycle through dimension options
function cycleDimension() {
  if (dimensionOptions.value.length > 1) {
    currentDimensionIndex.value = (currentDimensionIndex.value + 1) % dimensionOptions.value.length
    nextTick(() => renderRoom())
  }
}

// Render the room using CanvasRenderer
function renderRoom() {
  if (!renderer.value || !props.roomData) return

  renderer.value.render(props.roomData, currentDimension.value || undefined)
}

// Initialize renderer and render room
function initializeRenderer() {
  if (!canvasRef.value) return

  renderer.value = new CanvasRenderer(canvasRef.value)
  renderRoom()
}

// Watch for room data changes
watch(() => props.roomData, () => {
  currentDimensionIndex.value = 0 // Reset to first option
  nextTick(() => renderRoom())
}, { deep: true })

onMounted(() => {
  initializeRenderer()
})
</script>

<style scoped>
.room-canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.room-canvas {
  border: 2px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.canvas-controls {
  text-align: center;
}

.btn {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 10px;
}

.btn:hover:not(:disabled) {
  background: #45a049;
}

.btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>