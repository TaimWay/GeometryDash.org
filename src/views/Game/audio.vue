<template>
  <div class="app-container">
    <h1>Audio Player Demo</h1>
    
    <!-- Audio Console Component -->
    <AudioConsole 
      :playList="audioList" 
      :stayWay="true" 
      v-model:currentIndex="currentAudioIndex"
    />
    
    <!-- Demo controls -->
    <div class="demo-controls">
      <button @click="addAudio">Add Audio</button>
      <button @click="removeAudio">Remove Audio</button>
      <label>
        <input type="checkbox" v-model="fixedPosition"> Fixed Position
      </label>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import AudioConsole from '../../components/Audio.vue'

export default {
  name: 'App',
  components: {
    AudioConsole
  },
  setup() {
    // Audio playlist data
    const audioList = ref([
      {
        url: '/audio/song1.mp3',
        title: 'Song One',
        duration: '03:45'
      },
      {
        url: '/audio/song2.mp3',
        title: 'Song Two',
        duration: '04:20'
      },
      {
        url: '/audio/song3.mp3',
        title: 'Song Three',
        duration: '02:55'
      }
    ])
    
    // Current playing index
    const currentAudioIndex = ref(0)
    
    // Whether to fix the audio console at bottom
    const fixedPosition = ref(true)
    
    // Demo functions
    const addAudio = () => {
      audioList.value.push({
        url: `/audio/song${audioList.value.length + 1}.mp3`,
        title: `New Song ${audioList.value.length + 1}`,
        duration: '03:00'
      })
    }
    
    const removeAudio = () => {
      if (audioList.value.length > 0) {
        audioList.value.pop()
        if (currentAudioIndex.value >= audioList.value.length) {
          currentAudioIndex.value = Math.max(0, audioList.value.length - 1)
        }
      }
    }
    
    return {
      audioList,
      currentAudioIndex,
      fixedPosition,
      addAudio,
      removeAudio
    }
  }
}
</script>

<style>
.app-container {
  padding: 20px;
  min-height: 100vh;
}

.demo-controls {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.demo-controls button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.demo-controls label {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
