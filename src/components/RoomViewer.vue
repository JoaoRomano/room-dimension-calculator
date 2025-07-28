<template>
  <div class="room-viewer">
    <button @click="loadRandomRoom" class="btn">Load Random Room</button>

    <RoomCanvas :room-data="currentRoom.data" :canvas-width="800" :canvas-height="600" />

    <div class="room-data">
      <h3>Room Data JSON:</h3>
      <pre>{{ JSON.stringify(currentRoom.data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getRandomRoom } from '../utils/roomLoader';
import type { RoomData, RoomType } from '../types/room';
import RoomCanvas from './RoomCanvas.vue';

const currentRoom = ref<{ type: RoomType; data: RoomData }>({
  type: 'simple',
  data: { walls: [], corners: [] }
});

function loadRandomRoom() {
  currentRoom.value = getRandomRoom();
}

onMounted(() => {
  loadRandomRoom();
});
</script>

<style scoped>
.room-viewer {
  padding: 20px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.btn {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn:hover {
  background: #45a049;
}

.room-data {
  margin-top: 20px;
}

.room-data pre {
  background: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 10px;
  max-height: 200px;
  overflow-y: auto;
}
</style>