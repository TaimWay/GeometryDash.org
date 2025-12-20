<template>
  <div :class="['audio-console', { 'fixed-bottom': stayWay }]">
    <!-- Audio player -->
    <audio
      ref="audioRef"
      :src="currentAudio?.url"
      @timeupdate="handleTimeUpdate"
      @ended="handleAudioEnded"
      @loadedmetadata="handleLoadedMetadata"
    ></audio>

    <!-- Control panel -->
    <div class="control-panel glass-effect">
      <!-- Playback controls -->
      <div class="controls-left">
        <!-- Previous button (show only when playlist has more than 1 item) -->
        <button
          v-if="playList.length > 1"
          class="control-btn"
          @click="playPrevious"
          :disabled="!hasPrevious"
          title="Previous"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
          </svg>
        </button>

        <!-- Play/Pause button -->
        <button class="control-btn play-btn" @click="togglePlay" title="Play/Pause">
          <svg v-if="!isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>

        <!-- Next button (show only when playlist has more than 1 item) -->
        <button
          v-if="playList.length > 1"
          class="control-btn"
          @click="playNext"
          :disabled="!hasNext"
          title="Next"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
          </svg>
        </button>
      </div>

      <!-- Progress bar -->
      <div class="progress-section">
        <span class="time-display">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="seekAudio">
          <div class="progress-track">
            <div 
              class="progress-fill" 
              :style="{ width: progressPercentage + '%' }"
            ></div>
          </div>
        </div>
        <span class="time-display">{{ formatTime(duration) }}</span>
      </div>

      <!-- Additional controls -->
      <div class="controls-right">
        <!-- Loop mode (show only when playlist has more than 1 item) -->
        <button
          v-if="playList.length > 1"
          class="control-btn"
          @click="toggleLoop"
          :class="{ active: loopMode !== 'none' }"
          :title="loopMode === 'none' ? 'Loop Off' : loopMode === 'one' ? 'Loop One' : 'Loop All'"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path v-if="loopMode === 'none'" d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
            <path v-else-if="loopMode === 'one'" d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4zm-4-2V9h-1l-2 1v1h1.5v4H13z"/>
            <path v-else d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
          </svg>
        </button>

        <!-- Playback speed -->
        <div class="speed-control">
          <select v-model="playbackRate" @change="updatePlaybackRate" class="speed-select">
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>

        <!-- Playlist toggle -->
        <button class="control-btn" @click="togglePlaylist" title="Playlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Playlist panel -->
    <div v-if="showPlaylist" class="playlist-panel glass-effect">
      <div class="playlist-header">
        <h3>Playlist ({{ playList.length }})</h3>
        <button class="close-btn" @click="showPlaylist = false" title="Close">×</button>
      </div>
      <div class="playlist-items">
        <div
          v-for="(audio, index) in playList"
          :key="index"
          :class="['playlist-item', { active: index === currentIndex }]"
          @click="playAudio(index)"
        >
          <span class="item-index">{{ index + 1 }}</span>
          <span class="item-title">{{ audio.title || `Audio ${index + 1}` }}</span>
          <span class="item-duration">{{ audio.duration || '--:--' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'

export default {
  name: 'AudioConsole',
  props: {
    // Audio playlist array
    playList: {
      type: Array,
      default: () => []
    },
    // Whether to fix the component at the bottom of the page
    stayWay: {
      type: Boolean,
      default: false
    },
    // Current playing index
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:currentIndex'],
  setup(props, { emit }) {
    // Refs
    const audioRef = ref(null)
    const isPlaying = ref(false)
    const currentTime = ref(0)
    const duration = ref(0)
    const loopMode = ref('none') // 'none', 'one', 'all'
    const playbackRate = ref(1)
    const showPlaylist = ref(false)

    // Computed properties
    const currentAudio = computed(() => {
      return props.playList[props.currentIndex] || null
    })

    const progressPercentage = computed(() => {
      return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
    })

    const hasPrevious = computed(() => {
      return props.currentIndex > 0
    })

    const hasNext = computed(() => {
      return props.currentIndex < props.playList.length - 1
    })

    // Methods
    const togglePlay = async () => {
      if (!audioRef.value) return

      if (isPlaying.value) {
        audioRef.value.pause()
      } else {
        try {
          await audioRef.value.play()
        } catch (error) {
          console.error('Playback failed:', error)
        }
      }
      isPlaying.value = !isPlaying.value
    }

    const playAudio = (index) => {
      if (index >= 0 && index < props.playList.length) {
        emit('update:currentIndex', index)
        nextTick(() => {
          if (audioRef.value) {
            audioRef.value.currentTime = 0
            audioRef.value.play().then(() => {
              isPlaying.value = true
            }).catch(console.error)
          }
        })
      }
    }

    const playPrevious = () => {
      if (hasPrevious.value) {
        playAudio(props.currentIndex - 1)
      }
    }

    const playNext = () => {
      if (hasNext.value) {
        playAudio(props.currentIndex + 1)
      } else if (loopMode.value === 'all') {
        playAudio(0)
      }
    }

    const toggleLoop = () => {
      const modes = ['none', 'one', 'all']
      const currentIndex = modes.indexOf(loopMode.value)
      loopMode.value = modes[(currentIndex + 1) % modes.length]
    }

    const updatePlaybackRate = () => {
      if (audioRef.value) {
        audioRef.value.playbackRate = parseFloat(playbackRate.value)
      }
    }

    const seekAudio = (event) => {
      if (!audioRef.value) return

      const progressBar = event.currentTarget
      const rect = progressBar.getBoundingClientRect()
      const percent = (event.clientX - rect.left) / rect.width
      const newTime = percent * duration.value

      audioRef.value.currentTime = newTime
      currentTime.value = newTime
    }

    const formatTime = (seconds) => {
      if (!seconds || isNaN(seconds)) return '00:00'
      
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const togglePlaylist = () => {
      showPlaylist.value = !showPlaylist.value
    }

    // Event handlers
    const handleTimeUpdate = () => {
      if (audioRef.value) {
        currentTime.value = audioRef.value.currentTime
      }
    }

    const handleAudioEnded = () => {
      if (loopMode.value === 'one') {
        // Loop current audio
        if (audioRef.value) {
          audioRef.value.currentTime = 0
          audioRef.value.play()
        }
      } else if (hasNext.value || loopMode.value === 'all') {
        // Play next or loop to beginning
        playNext()
      } else {
        // Stop playback
        isPlaying.value = false
      }
    }

    const handleLoadedMetadata = () => {
      if (audioRef.value) {
        duration.value = audioRef.value.duration
      }
    }

    // Watchers
    watch(() => props.currentIndex, (newIndex) => {
      if (audioRef.value) {
        audioRef.value.currentTime = 0
        if (isPlaying.value) {
          audioRef.value.play().catch(console.error)
        }
      }
    })

    watch(() => props.playList, (newPlaylist) => {
      if (newPlaylist.length === 0) {
        isPlaying.value = false
        if (audioRef.value) {
          audioRef.value.pause()
        }
      }
    })

    return {
      audioRef,
      isPlaying,
      currentTime,
      duration,
      loopMode,
      playbackRate,
      showPlaylist,
      currentAudio,
      progressPercentage,
      hasPrevious,
      hasNext,
      togglePlay,
      playAudio,
      playPrevious,
      playNext,
      toggleLoop,
      updatePlaybackRate,
      seekAudio,
      formatTime,
      togglePlaylist,
      handleTimeUpdate,
      handleAudioEnded,
      handleLoadedMetadata
    }
  }
}
</script>

<style scoped>
.audio-console {
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.audio-console.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.control-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  gap: 20px;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.control-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn.active {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
}

.play-btn {
  background: rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.5);
  padding: 10px;
}

.play-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.5);
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  max-width: 400px;
}

.time-display {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  min-width: 40px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  cursor: pointer;
  padding: 8px 0;
}

.progress-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.1s ease;
}

.speed-control {
  display: flex;
  align-items: center;
}

.speed-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 6px 8px;
  color: white;
  font-size: 12px;
  cursor: pointer;
}

.speed-select option {
  background: #2d3748;
  color: white;
}

.playlist-panel {
  position: absolute;
  bottom: 100%;
  right: 20px;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 12px;
  margin-bottom: 10px;
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.playlist-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.playlist-items {
  padding: 8px 0;
}

.playlist-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  gap: 12px;
}

.playlist-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.playlist-item.active {
  background: rgba(59, 130, 246, 0.2);
}

.item-index {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  min-width: 20px;
}

.item-title {
  flex: 1;
  font-size: 14px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-duration {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  min-width: 40px;
  text-align: right;
}

/* Responsive design */
@media (max-width: 768px) {
  .control-panel {
    padding: 8px 12px;
    gap: 12px;
  }
  
  .progress-section {
    max-width: 200px;
  }
  
  .playlist-panel {
    width: 280px;
    right: 12px;
  }
}
</style>
