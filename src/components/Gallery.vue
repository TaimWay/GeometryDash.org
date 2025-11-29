<template>
  <div class="gallery" 
    :class="[`indicators-${indicatorPosition}`, `controls-${controlPosition}`]"
    @contextmenu.prevent="showContextMenu"
  >
    <!-- Context Menu -->
    <div 
      v-if="contextMenuVisible" 
      class="context-menu" 
      :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
      v-click-outside="hideContextMenu"
    >
      <div class="context-menu-item" @click="toggleAutoPlay">
        <span>{{ autoPlayEnabled ? 'Pause' : 'Play' }} Auto Play</span>
        <span class="context-menu-check" v-if="autoPlayEnabled">✓</span>
      </div>
      <div class="context-menu-item" @click="toggleIndicators">
        <span>Show Indicators</span>
        <span class="context-menu-check" v-if="showIndicators">✓</span>
      </div>
      <div class="context-menu-item" @click="toggleControls">
        <span>Show Controls</span>
        <span class="context-menu-check" v-if="showControls">✓</span>
      </div>
      <div class="context-menu-item" @click="toggleThumbnails">
        <span>Show Thumbnails</span>
        <span class="context-menu-check" v-if="showThumbnails">✓</span>
      </div>
      <div class="context-menu-item" @click="toggleCounter">
        <span>Show Counter</span>
        <span class="context-menu-check" v-if="showCounter">✓</span>
      </div>
      <div class="context-menu-item" @click="toggleTitle">
        <span>Show Title</span>
        <span class="context-menu-check" v-if="showTitle">✓</span>
      </div>
      <div class="context-menu-item" @click="toggleDescription">
        <span>Show Description</span>
        <span class="context-menu-check" v-if="showDescription">✓</span>
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" @click="zoomCurrentImage">
        <span>Zoom Current Image</span>
      </div>
    </div>

    <!-- Zoom Modal -->
    <div v-if="zoomModalVisible" class="zoom-modal" @click="closeZoomModal">
      <div class="zoom-modal-content" @click.stop>
        <button class="zoom-close" @click="closeZoomModal" aria-label="Close zoom view" title="Close (Esc)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <!-- Zoom info display -->
        <div class="zoom-info" v-if="zoomShowInfo && (currentZoomTitle || currentZoomDescription)">
          <h3 class="zoom-title" v-if="zoomShowInfo && currentZoomTitle">{{ currentZoomTitle }}</h3>
          <p class="zoom-description" v-if="zoomShowInfo && currentZoomDescription">{{ currentZoomDescription }}</p>
        </div>
        
        <!-- Download button in zoom mode -->
        <button 
          v-if="imageDownload" 
          class="zoom-download" 
          @click="downloadCurrentImage"
          aria-label="Download image"
          title="Download image"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <button class="zoom-nav prev" @click="zoomPrevImage" :disabled="!loop && currentIndex === 0" title="Previous image (←)">
          <slot name="zoom-prev-icon">
            <span class="default-arrow">‹</span>
          </slot>
        </button>
        
        <div class="zoom-image-container" @contextmenu.prevent="handleZoomContextMenu">
          <img 
            :src="currentZoomImage" 
            :alt="currentZoomAlt"
            class="zoom-image"
            :style="{ transform: `scale(${zoomScale}) translate(${zoomTranslateX}px, ${zoomTranslateY}px)` }"
            @mousedown="startZoomDrag"
            @touchstart="startZoomDrag"
            @wheel="handleZoomWheel"
          />
        </div>
        
        <button class="zoom-nav next" @click="zoomNextImage" :disabled="!loop && currentIndex === sourceData.length - 1" title="Next image (→)">
          <slot name="zoom-next-icon">
            <span class="default-arrow">›</span>
          </slot>
        </button>
        
        <div class="zoom-controls">
          <button class="zoom-control" @click="zoomOut" :disabled="zoomScale <= zoomMin" title="Zoom out (-)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <!-- Zoom scale input -->
          <div class="zoom-scale-input-container">
            <input
              v-if="scaleInputVisible"
              ref="scaleInputRef"
              v-model="scaleInputValue"
              type="number"
              class="zoom-scale-input"
              min="10"
              max="500"
              @keydown.enter="applyZoomScale"
              @keydown.escape="cancelZoomScale"
              @blur="applyZoomScale"
            />
            <span 
              v-else
              class="zoom-scale"
              @click="showScaleInput"
              title="Click to input custom zoom level"
            >{{ Math.round(zoomScale * 100) }}%</span>
          </div>
          
          <button class="zoom-control" @click="zoomIn" :disabled="zoomScale >= zoomMax" title="Zoom in (+)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button class="zoom-control" @click="resetZoom" title="Reset zoom (0)">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 15L9 20M9 20L4 15M9 20V10C9 7.23858 11.2386 5 14 5C16.7614 5 19 7.23858 19 10V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Gallery View -->
    <div class="gallery-view" :style="{ '--gallery-height': height }" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      <button 
        v-if="showControls"
        class="nav-button prev" 
        @click="prevSlide"
        :disabled="!loop && currentIndex === 0"
        aria-label="Previous slide"
        title="Previous slide"
      >
        <slot name="prev-icon">
          <span class="default-arrow">‹</span>
        </slot>
      </button>
      
      <div 
        class="gallery-content" 
        ref="galleryContent"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseEnd"
        @mouseleave="onMouseEnd"
      >
        <div 
          v-for="(item, index) in sourceData" 
          :key="item.id" 
          class="gallery-slide"
        >
          <img 
            :src="item.imgSrc" 
            :alt="item.altText"
            class="slide-image"
            :style="{ 'object-fit': imageFit }"
            @load="onImageLoad"
            @error="onImageError"
            @dblclick="zoomImage(item.imgSrc, item.altText, item.title, item.description)"
            @click="handleImageClick"
          >
          <div 
            class="slide-info" 
            v-if="(showTitle && item.title) || (showDescription && item.description)"
            :class="`info-${infoPosition}`"
          >
            <h3 class="slide-title" v-if="showTitle && item.title">{{ item.title }}</h3>
            <p class="slide-description" v-if="showDescription && item.description">{{ item.description }}</p>
          </div>
          
          <!-- Zoom button on image -->
          <button 
            class="image-zoom-button"
            @click="zoomImage(item.imgSrc, item.altText, item.title, item.description)"
            aria-label="Zoom image"
            title="Zoom image (double-click)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <button 
        v-if="showControls"
        class="nav-button next" 
        @click="nextSlide"
        :disabled="!loop && currentIndex === sourceData.length - 1"
        aria-label="Next slide"
        title="Next slide"
      >
        <slot name="next-icon">
          <span class="default-arrow">›</span>
        </slot>
      </button>
      
      <!-- Play/Pause button inside image - moved to bottom right -->
      <button 
        v-if="showPlayButton && sourceData.length > 1"
        class="play-button"
        @click="toggleAutoPlay"
        :class="{ active: autoPlayEnabled }"
        :aria-label="autoPlayEnabled ? 'Pause slideshow' : 'Play slideshow'"
        :title="autoPlayEnabled ? 'Pause slideshow' : 'Play slideshow'"
      >
        <slot name="play-icon" :playing="autoPlayEnabled">
          <svg v-if="!autoPlayEnabled" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="5" width="4" height="14" fill="currentColor"/>
            <rect x="14" y="5" width="4" height="14" fill="currentColor"/>
          </svg>
        </slot>
      </button>
      
      <!-- Counter - moved to avoid overlap with zoom button -->
      <div 
        class="gallery-counter" 
        v-if="showCounter && sourceData.length > 1"
        title="Current slide"
      >
        {{ currentIndex + 1 }} / {{ sourceData.length }}
      </div>
    </div>
    
    <!-- Indicators - hidden when thumbnails are shown -->
    <div 
      class="gallery-indicators" 
      v-if="showIndicators && sourceData.length > 1 && !showThumbnails"
    >
      <div 
        v-for="(item, index) in sourceData" 
        :key="item.id" 
        class="indicator" 
        :class="{ active: currentIndex === index }"
        @click="goToSlide(index)"
        :aria-label="`Go to slide ${index + 1}`"
        :title="`Go to slide ${index + 1}`"
      >
        <span class="indicator-progress" v-if="progressIndicators && autoPlayEnabled"></span>
      </div>
    </div>
    
    <!-- Thumbnails - positioned outside the main gallery -->
    <div 
      class="gallery-thumbnails-container" 
      v-if="showThumbnails && sourceData.length > 1"
    >
      <button 
        class="thumb-nav thumb-prev" 
        @click="scrollThumbnails(-1)"
        :disabled="thumbnailScrollPosition <= 0"
        aria-label="Scroll thumbnails left"
        title="Scroll thumbnails left"
      >
        <span class="default-arrow">‹</span>
      </button>
      
      <div class="gallery-thumbnails" ref="thumbnailsRef">
        <div 
          v-for="(item, index) in sourceData" 
          :key="item.id" 
          class="thumbnail" 
          :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"
          :title="`Go to slide ${index + 1}`"
        >
          <img :src="item.imgSrc" :alt="item.altText">
        </div>
      </div>
      
      <button 
        class="thumb-nav thumb-next" 
        @click="scrollThumbnails(1)"
        :disabled="thumbnailScrollPosition >= maxThumbnailScroll"
        aria-label="Scroll thumbnails right"
        title="Scroll thumbnails right"
      >
        <span class="default-arrow">›</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// Component props
const props = defineProps({
  // Play speed (ms)
  playSpeed: {
    type: Number,
    default: 5000
  },
  // Image data source
  sourceData: {
    type: Array,
    default: () => [
      {
        id: 1,
        imgSrc: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        altText: 'Mountain landscape',
        title: 'Majestic Mountains',
        description: 'Magnificent mountains reflecting in a tranquil lake'
      },
      {
        id: 2,
        imgSrc: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
        altText: 'Forest',
        title: 'Enchanted Forest',
        description: 'Sunlight filtering through dense foliage'
      },
      {
        id: 3,
        imgSrc: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
        altText: 'Natural landscape',
        title: 'Natural Wonder',
        description: 'Breathtaking natural scenery created by geological forces'
      }
    ],
    validator: (value) => {
      return value.every(item => 
        item.id && item.imgSrc && item.altText
      )
    }
  },
  // Auto play enabled
  autoPlay: {
    type: Boolean,
    default: true
  },
  // Show indicators
  showIndicators: {
    type: Boolean,
    default: true
  },
  // Show control buttons
  showControls: {
    type: Boolean,
    default: true
  },
  // Loop playback
  loop: {
    type: Boolean,
    default: true
  },
  // Gallery height
  height: {
    type: String,
    default: '500px'
  },
  // Show title
  showTitle: {
    type: Boolean,
    default: true
  },
  // Show description
  showDescription: {
    type: Boolean,
    default: true
  },
  // Image fit mode
  imageFit: {
    type: String,
    default: 'cover',
    validator: (value) => ['cover', 'contain', 'fill'].includes(value)
  },
  // Info position
  infoPosition: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
  },
  // Indicator position
  indicatorPosition: {
    type: String,
    default: 'inside-bottom',
    validator: (value) => ['inside-bottom', 'inside-top', 'outside'].includes(value)
  },
  // Control button position
  controlPosition: {
    type: String,
    default: 'inside',
    validator: (value) => ['inside', 'outside'].includes(value)
  },
  // Show play button
  showPlayButton: {
    type: Boolean,
    default: true
  },
  // Show counter
  showCounter: {
    type: Boolean,
    default: false
  },
  // Show thumbnails
  showThumbnails: {
    type: Boolean,
    default: false
  },
  // Progress indicators
  progressIndicators: {
    type: Boolean,
    default: false
  },
  // Transition effect
  transitionEffect: {
    type: String,
    default: 'slide',
    validator: (value) => ['slide', 'fade', 'zoom'].includes(value)
  },
  // Draggable
  draggable: {
    type: Boolean,
    default: true
  },
  // Pause on hover
  pauseOnHover: {
    type: Boolean,
    default: true
  },
  // Enable context menu
  enableContextMenu: {
    type: Boolean,
    default: true
  },
  // Enable zoom
  enableZoom: {
    type: Boolean,
    default: true
  },
  // Resume play after interaction
  resumeAfterInteraction: {
    type: Boolean,
    default: true
  },
  // Show info in zoom mode
  zoomShowInfo: {
    type: Boolean,
    default: true
  },
  // Enable image download
  imageDownload: {
    type: Boolean,
    default: false
  },
  // Minimum zoom level
  zoomMin: {
    type: Number,
    default: 0.1
  },
  // Maximum zoom level
  zoomMax: {
    type: Number,
    default: 5
  }
})

// Component events
const emit = defineEmits([
  'slide-change', 
  'image-load', 
  'image-error', 
  'play-state-change',
  'context-menu-toggle',
  'zoom-toggle'
])

// Reactive data
const currentIndex = ref(0)
const autoPlayEnabled = ref(props.autoPlay)
const isDragging = ref(false)
const startPos = ref(0)
const currentTranslate = ref(0)
const prevTranslate = ref(0)
const animationID = ref(null)
const autoPlayTimer = ref(null)
const progressTimer = ref(null)
const galleryContent = ref(null)
const isHovering = ref(false)

// Context menu
const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)

// Zoom functionality
const zoomModalVisible = ref(false)
const currentZoomImage = ref('')
const currentZoomAlt = ref('')
const currentZoomTitle = ref('')
const currentZoomDescription = ref('')
const zoomScale = ref(1)
const zoomTranslateX = ref(0)
const zoomTranslateY = ref(0)
const isZoomDragging = ref(false)
const zoomStartX = ref(0)
const zoomStartY = ref(0)
const zoomStartTranslateX = ref(0)
const zoomStartTranslateY = ref(0)

// Zoom scale input
const scaleInputVisible = ref(false)
const scaleInputValue = ref('100')
const scaleInputRef = ref(null)

// Thumbnail scrolling
const thumbnailsRef = ref(null)
const thumbnailScrollPosition = ref(0)
const maxThumbnailScroll = ref(0)

// Computed properties
const slideCount = computed(() => props.sourceData.length)

// Methods
const nextSlide = () => {
  if (currentIndex.value < slideCount.value - 1) {
    currentIndex.value++
  } else if (props.loop) {
    currentIndex.value = 0
  }
  emit('slide-change', currentIndex.value)
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else if (props.loop) {
    currentIndex.value = slideCount.value - 1
  }
  emit('slide-change', currentIndex.value)
}

const goToSlide = (index) => {
  if (index >= 0 && index < slideCount.value) {
    currentIndex.value = index
    emit('slide-change', currentIndex.value)
  }
}

const toggleAutoPlay = () => {
  autoPlayEnabled.value = !autoPlayEnabled.value
  emit('play-state-change', autoPlayEnabled.value)
  
  if (autoPlayEnabled.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
  
  hideContextMenu()
}

const startAutoPlay = () => {
  if (props.autoPlay && autoPlayEnabled.value && !isHovering.value) {
    stopAutoPlay()
    
    autoPlayTimer.value = setInterval(() => {
      nextSlide()
    }, props.playSpeed)
    
    // Start progress animation if enabled
    if (props.progressIndicators) {
      startProgressAnimation()
    }
  }
}

const stopAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
  
  if (progressTimer.value) {
    clearTimeout(progressTimer.value)
    progressTimer.value = null
  }
}

const startProgressAnimation = () => {
  const indicators = document.querySelectorAll('.indicator-progress')
  indicators.forEach(indicator => {
    indicator.style.animation = 'none'
    void indicator.offsetWidth // Trigger reflow
    indicator.style.animation = `progress ${props.playSpeed}ms linear`
  })
}

// Touch event handling
const onTouchStart = (event) => {
  if (!props.draggable) return
  
  stopAutoPlay()
  startPos.value = getPositionX(event)
  isDragging.value = true
  prevTranslate.value = currentIndex.value * -getGalleryWidth()
  animationID.value = requestAnimationFrame(animation)
}

const onTouchMove = (event) => {
  if (!props.draggable || !isDragging.value) return
  
  const currentPosition = getPositionX(event)
  currentTranslate.value = prevTranslate.value + currentPosition - startPos.value
}

const onTouchEnd = () => {
  if (!props.draggable) return
  
  finishDrag()
}

// Mouse event handling
const onMouseDown = (event) => {
  if (!props.draggable) return
  
  stopAutoPlay()
  startPos.value = getPositionX(event)
  isDragging.value = true
  prevTranslate.value = currentIndex.value * -getGalleryWidth()
  animationID.value = requestAnimationFrame(animation)
  
  // Prevent text selection during drag
  event.preventDefault()
}

const onMouseMove = (event) => {
  if (!props.draggable || !isDragging.value) return
  
  const currentPosition = getPositionX(event)
  currentTranslate.value = prevTranslate.value + currentPosition - startPos.value
}

const onMouseEnd = () => {
  if (!props.draggable) return
  
  finishDrag()
}

const finishDrag = () => {
  cancelAnimationFrame(animationID.value)
  isDragging.value = false
  
  const movedBy = currentTranslate.value - prevTranslate.value
  const galleryWidth = getGalleryWidth()
  const threshold = galleryWidth * 0.1 // 10% threshold
  
  if (movedBy < -threshold && (currentIndex.value < slideCount.value - 1 || props.loop)) {
    nextSlide()
  } else if (movedBy > threshold && (currentIndex.value > 0 || props.loop)) {
    prevSlide()
  }
  
  setPositionByIndex()
  
  // Resume autoplay after drag if enabled
  if (props.resumeAfterInteraction && autoPlayEnabled.value) {
    startAutoPlay()
  }
}

const getPositionX = (event) => {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX
}

const getGalleryWidth = () => {
  return galleryContent.value ? galleryContent.value.offsetWidth : 0
}

const animation = () => {
  setSliderPosition()
  if (isDragging.value) {
    requestAnimationFrame(animation)
  }
}

const setSliderPosition = () => {
  if (galleryContent.value) {
    galleryContent.value.style.transform = `translateX(${currentTranslate.value}px)`
  }
}

const setPositionByIndex = () => {
  const galleryWidth = getGalleryWidth()
  currentTranslate.value = currentIndex.value * -galleryWidth
  prevTranslate.value = currentTranslate.value
  setSliderPosition()
}

const onImageLoad = (event) => {
  emit('image-load', {
    index: currentIndex.value,
    event
  })
}

const onImageError = (event) => {
  emit('image-error', {
    index: currentIndex.value,
    event
  })
}

// Handle image click - fix for issue #4
const handleImageClick = (event) => {
  // Only handle single clicks, not double clicks
  if (event.detail === 1) {
    // Resume autoplay after click if enabled
    if (props.resumeAfterInteraction && autoPlayEnabled.value) {
      // Small delay to ensure other interactions are complete
      setTimeout(() => {
        startAutoPlay()
      }, 1000)
    }
  }
}

// Mouse enter/leave for pause on hover
const onMouseEnter = () => {
  isHovering.value = true
  if (props.pauseOnHover && autoPlayEnabled.value) {
    stopAutoPlay()
  }
}

const onMouseLeave = () => {
  isHovering.value = false
  if (props.pauseOnHover && autoPlayEnabled.value) {
    startAutoPlay()
  }
}

// Context menu functions
const showContextMenu = (event) => {
  if (!props.enableContextMenu) return
  
  contextMenuX.value = event.pageX
  contextMenuY.value = event.pageY
  contextMenuVisible.value = true
  emit('context-menu-toggle', true)
}

const hideContextMenu = () => {
  contextMenuVisible.value = false
  emit('context-menu-toggle', false)
}

// Toggle functions for context menu - fixed to work properly
const toggleIndicators = () => {
  // Emit update event for parent component to handle
  emit('update:showIndicators', !props.showIndicators)
  hideContextMenu()
}

const toggleControls = () => {
  emit('update:showControls', !props.showControls)
  hideContextMenu()
}

const toggleThumbnails = () => {
  emit('update:showThumbnails', !props.showThumbnails)
  hideContextMenu()
}

const toggleCounter = () => {
  emit('update:showCounter', !props.showCounter)
  hideContextMenu()
}

const toggleTitle = () => {
  emit('update:showTitle', !props.showTitle)
  hideContextMenu()
}

const toggleDescription = () => {
  emit('update:showDescription', !props.showDescription)
  hideContextMenu()
}

// Zoom functions
const zoomImage = (imgSrc, altText, title = '', description = '') => {
  if (!props.enableZoom) return
  
  currentZoomImage.value = imgSrc
  currentZoomAlt.value = altText
  currentZoomTitle.value = title
  currentZoomDescription.value = description
  zoomModalVisible.value = true
  resetZoom()
  emit('zoom-toggle', true)
  
  // Add keyboard event listener for zoom modal
  document.addEventListener('keydown', handleZoomKeydown)
}

const zoomCurrentImage = () => {
  const currentItem = props.sourceData[currentIndex.value]
  if (currentItem) {
    zoomImage(currentItem.imgSrc, currentItem.altText, currentItem.title, currentItem.description)
  }
  hideContextMenu()
}

const closeZoomModal = () => {
  zoomModalVisible.value = false
  scaleInputVisible.value = false
  emit('zoom-toggle', false)
  document.removeEventListener('keydown', handleZoomKeydown)
  
  // Resume autoplay after closing zoom if enabled
  if (props.resumeAfterInteraction && autoPlayEnabled.value) {
    startAutoPlay()
  }
}

// Handle zoom context menu - prevent context menu from appearing after closing zoom
const handleZoomContextMenu = (event) => {
  event.preventDefault()
  // Don't show context menu in zoom mode
}

const zoomIn = () => {
  if (zoomScale.value < props.zoomMax) {
    zoomScale.value = Math.min(zoomScale.value + 0.25, props.zoomMax)
  }
}

const zoomOut = () => {
  if (zoomScale.value > props.zoomMin) {
    zoomScale.value = Math.max(zoomScale.value - 0.25, props.zoomMin)
  }
}

const resetZoom = () => {
  zoomScale.value = 1
  zoomTranslateX.value = 0
  zoomTranslateY.value = 0
}

const zoomPrevImage = () => {
  if (currentIndex.value > 0 || props.loop) {
    prevSlide()
    const prevItem = props.sourceData[currentIndex.value]
    if (prevItem) {
      currentZoomImage.value = prevItem.imgSrc
      currentZoomAlt.value = prevItem.altText
      currentZoomTitle.value = prevItem.title
      currentZoomDescription.value = prevItem.description
      resetZoom()
    }
  }
}

const zoomNextImage = () => {
  if (currentIndex.value < slideCount.value - 1 || props.loop) {
    nextSlide()
    const nextItem = props.sourceData[currentIndex.value]
    if (nextItem) {
      currentZoomImage.value = nextItem.imgSrc
      currentZoomAlt.value = nextItem.altText
      currentZoomTitle.value = nextItem.title
      currentZoomDescription.value = nextItem.description
      resetZoom()
    }
  }
}

const handleZoomWheel = (event) => {
  event.preventDefault()
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

const startZoomDrag = (event) => {
  // Don't allow dragging when zoom is at 100% or less
  if (zoomScale.value <= 1) return
  
  isZoomDragging.value = true
  zoomStartX.value = event.type.includes('touch') ? event.touches[0].clientX : event.clientX
  zoomStartY.value = event.type.includes('touch') ? event.touches[0].clientY : event.clientY
  zoomStartTranslateX.value = zoomTranslateX.value
  zoomStartTranslateY.value = zoomTranslateY.value
  
  if (event.type.includes('touch')) {
    document.addEventListener('touchmove', doZoomDragTouch)
    document.addEventListener('touchend', stopZoomDrag)
  } else {
    document.addEventListener('mousemove', doZoomDrag)
    document.addEventListener('mouseup', stopZoomDrag)
  }
}

const doZoomDrag = (event) => {
  if (!isZoomDragging.value) return
  
  const deltaX = event.clientX - zoomStartX.value
  const deltaY = event.clientY - zoomStartY.value
  
  zoomTranslateX.value = zoomStartTranslateX.value + deltaX
  zoomTranslateY.value = zoomStartTranslateY.value + deltaY
}

const doZoomDragTouch = (event) => {
  if (!isZoomDragging.value) return
  
  const deltaX = event.touches[0].clientX - zoomStartX.value
  const deltaY = event.touches[0].clientY - zoomStartY.value
  
  zoomTranslateX.value = zoomStartTranslateX.value + deltaX
  zoomTranslateY.value = zoomStartTranslateY.value + deltaY
}

const stopZoomDrag = () => {
  isZoomDragging.value = false
  document.removeEventListener('mousemove', doZoomDrag)
  document.removeEventListener('touchmove', doZoomDragTouch)
  document.removeEventListener('mouseup', stopZoomDrag)
  document.removeEventListener('touchend', stopZoomDrag)
}

const handleZoomKeydown = (event) => {
  if (!zoomModalVisible.value) return
  
  switch(event.key) {
    case 'Escape':
      closeZoomModal()
      break
    case 'ArrowLeft':
      zoomPrevImage()
      break
    case 'ArrowRight':
      zoomNextImage()
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      resetZoom()
      break
  }
}

// Download current image
const downloadCurrentImage = () => {
  if (!props.imageDownload) return
  
  const currentItem = props.sourceData[currentIndex.value]
  if (!currentItem) return
  
  const link = document.createElement('a')
  link.href = currentItem.imgSrc
  link.download = currentItem.altText || 'image'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Zoom scale input functions
const showScaleInput = () => {
  scaleInputValue.value = Math.round(zoomScale.value * 100).toString()
  scaleInputVisible.value = true
  nextTick(() => {
    if (scaleInputRef.value) {
      scaleInputRef.value.focus()
      scaleInputRef.value.select()
    }
  })
}

const applyZoomScale = () => {
  const value = parseInt(scaleInputValue.value)
  if (!isNaN(value) && value >= 10 && value <= 500) {
    zoomScale.value = Math.max(props.zoomMin, Math.min(props.zoomMax, value / 100))
  }
  scaleInputVisible.value = false
}

const cancelZoomScale = () => {
  scaleInputVisible.value = false
}

// Thumbnail scrolling
const scrollThumbnails = (direction) => {
  if (!thumbnailsRef.value) return
  
  const scrollAmount = 200 // pixels to scroll
  const newPosition = thumbnailScrollPosition.value + (direction * scrollAmount)
  
  // Clamp the position between 0 and maxThumbnailScroll
  thumbnailScrollPosition.value = Math.max(0, Math.min(newPosition, maxThumbnailScroll.value))
  
  thumbnailsRef.value.scrollTo({
    left: thumbnailScrollPosition.value,
    behavior: 'smooth'
  })
}

const updateMaxThumbnailScroll = () => {
  if (!thumbnailsRef.value) return
  
  maxThumbnailScroll.value = thumbnailsRef.value.scrollWidth - thumbnailsRef.value.clientWidth
}

// Click outside directive for context menu
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}

// Watch for prop changes
watch(() => props.autoPlay, (newValue) => {
  autoPlayEnabled.value = newValue
  if (newValue && !isHovering.value) {
    startAutoPlay()
  } else {
    stopAutoPlay()
  }
})

watch(() => props.sourceData, () => {
  // Reset to first slide when data changes
  currentIndex.value = 0
})

watch(() => currentIndex.value, () => {
  // Restart progress animation when slide changes
  if (props.progressIndicators && autoPlayEnabled.value) {
    startProgressAnimation()
  }
})

// Lifecycle
onMounted(() => {
  if (props.autoPlay && autoPlayEnabled.value) {
    // Wait for next tick to ensure DOM is ready
    nextTick(() => {
      startAutoPlay()
    })
  }
  
  // Update max thumbnail scroll on mount and resize
  if (props.showThumbnails) {
    nextTick(() => {
      updateMaxThumbnailScroll()
      window.addEventListener('resize', updateMaxThumbnailScroll)
    })
  }
})

onUnmounted(() => {
  stopAutoPlay()
  if (animationID.value) {
    cancelAnimationFrame(animationID.value)
  }
  document.removeEventListener('keydown', handleZoomKeydown)
  window.removeEventListener('resize', updateMaxThumbnailScroll)
})
</script>

<style scoped>
/* Prevent text selection */
.gallery {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.gallery * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Allow text selection only in input fields */
.zoom-scale-input {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

.gallery {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-view {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: var(--ui-glasscard-shadow);
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--ui-glasscard-border);
  height: var(--gallery-height, 500px);
  transition: box-shadow 0.3s ease;
}

.gallery-view:hover {
  box-shadow: var(--ui-glasscard-shadow-hover);
}

.gallery-content {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  height: 100%;
}

.gallery-slide {
  flex: 0 0 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: v-bind('imageFit');
  display: block;
  cursor: pointer;
}

.slide-info {
  position: absolute;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  padding: 2rem 1.5rem 1.5rem;
  transition: all 0.3s ease;
  width: 100%;
}

.slide-info.info-bottom {
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.slide-info.info-top {
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
}

.slide-info.info-left {
  top: 0;
  left: 0;
  bottom: 0;
  width: 40%;
  background: linear-gradient(to right, rgba(0,0,0,0.8), transparent);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slide-info.info-right {
  top: 0;
  right: 0;
  bottom: 0;
  width: 40%;
  background: linear-gradient(to left, rgba(0,0,0,0.8), transparent);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.slide-title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: white;
}

.slide-description {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.4;
  color: white;
}

/* Navigation buttons */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--ui-glasscard-border);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  opacity: 0.8;
}

.nav-button:hover:not(:disabled) {
  background: var(--theme-hover);
  color: white;
  transform: translateY(-50%) scale(1.1);
  opacity: 1;
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Default arrow style for navigation buttons */
.default-arrow {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
}

/* Control positions */
.gallery.controls-inside .prev {
  left: 20px;
}

.gallery.controls-inside .next {
  right: 20px;
}

.gallery.controls-outside {
  padding: 0 60px;
}

.gallery.controls-outside .prev {
  left: 0;
}

.gallery.controls-outside .next {
  right: 0;
}

/* Play button - moved to bottom right */
.play-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--ui-glasscard-border);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  opacity: 0.8;
}

.play-button:hover {
  background: var(--theme-hover);
  color: white;
  transform: scale(1.1);
  opacity: 1;
}

.play-button.active {
  background: var(--theme-primary);
  color: white;
}

/* Image zoom button - positioned to avoid overlap with counter */
.image-zoom-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--ui-glasscard-border);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  opacity: 0.8;
}

.image-zoom-button:hover {
  background: var(--theme-hover);
  color: white;
  transform: scale(1.1);
  opacity: 1;
}

/* Indicators - positioned inside the image with proper z-index */
.gallery-indicators {
  display: flex;
  justify-content: center;
  gap: 10px;
  z-index: 5; /* Lower than buttons but above image */
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.indicator.active {
  background: var(--theme-primary);
  transform: scale(1.2);
}

.indicator:hover {
  background: var(--theme-hover);
}

.indicator-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: var(--theme-glow);
  border-radius: 50%;
  transform: scale(0);
  transform-origin: center;
}

@keyframes progress {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

/* Counter - positioned to avoid overlap with zoom button */
.gallery-counter {
  position: absolute;
  top: 20px;
  left: 20px; /* Changed from right to left to avoid overlap with zoom button */
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--ui-glasscard-border);
  color: var(--text-primary);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.9rem;
  z-index: 10;
}

/* Thumbnails container with navigation */
.gallery-thumbnails-container {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  position: relative;
}

.thumb-nav {
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--ui-glasscard-border);
  width: 30px;
  height: 60px;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  flex-shrink: 0;
}

.thumb-nav:hover:not(:disabled) {
  background: var(--theme-hover);
  color: white;
}

.thumb-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.thumb-prev {
  border-radius: 6px 0 0 6px;
}

.thumb-next {
  border-radius: 0 6px 6px 0;
}

/* Thumbnails - positioned outside the main gallery */
.gallery-thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  flex-grow: 1;
}

.gallery-thumbnails::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}

.thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail:hover {
  opacity: 0.9;
}

.thumbnail.active {
  opacity: 1;
  border: 2px solid var(--theme-primary);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--ui-glasscard-border);
  border-radius: 8px;
  box-shadow: var(--ui-glasscard-shadow-hover);
  padding: 8px 0;
  z-index: 1000;
  min-width: 200px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.context-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  color: var(--text-primary);
}

.context-menu-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.context-menu-check {
  color: var(--theme-primary);
  font-weight: bold;
}

.context-menu-divider {
  height: 1px;
  background: var(--ui-glasscard-border);
  margin: 8px 0;
}

/* Zoom Modal */
.zoom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.zoom-modal-content {
  position: relative;
  width: 90%;
  height: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--ui-glasscard-border);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.zoom-close:hover {
  background: var(--theme-hover);
  transform: scale(1.1);
}

/* Zoom info display - simplified without glass effect */
.zoom-info {
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  max-width: 400px;
  z-index: 10;
  padding: 10px;
}

.zoom-title {
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.zoom-description {
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.3;
}

/* Zoom download button */
.zoom-download {
  position: absolute;
  top: 20px;
  right: 70px; /* Position to the left of close button */
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--ui-glasscard-border);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.zoom-download:hover {
  background: var(--theme-hover);
  transform: scale(1.1);
}

.zoom-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--ui-glasscard-border);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.zoom-nav:hover:not(:disabled) {
  background: var(--theme-hover);
  transform: translateY(-50%) scale(1.1);
}

.zoom-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.zoom-nav.prev {
  left: 20px;
}

.zoom-nav.next {
  right: 20px;
}

.zoom-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  touch-action: none; /* Prevent browser handling of touch events */
}

.zoom-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  cursor: grab;
  user-select: none; /* Prevent text selection */
  -webkit-user-drag: none; /* Prevent dragging in WebKit */
}

.zoom-image:active {
  cursor: grabbing;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--ui-glasscard-bg);
  backdrop-filter: blur(5px);
  border: 1px solid var(--ui-glasscard-border);
  border-radius: 8px;
  padding: 8px 16px;
}

.zoom-control {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border-radius: 4px;
  padding: 4px;
}

.zoom-control:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.zoom-control:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Zoom scale input */
.zoom-scale-input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.zoom-scale {
  color: white;
  font-size: 0.9rem;
  min-width: 50px;
  text-align: center;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.zoom-scale:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.zoom-scale-input {
  width: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  text-align: center;
  font-size: 0.9rem;
  padding: 2px 4px;
}

.zoom-scale-input:focus {
  outline: none;
  border-color: var(--theme-primary);
}

/* Responsive design */
@media (max-width: 768px) {
  .gallery-view {
    height: 400px;
  }
  
  .slide-title {
    font-size: 1.3rem;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
  
  .gallery.controls-outside {
    padding: 0 50px;
  }
  
  .zoom-modal-content {
    width: 95%;
    height: 95%;
  }
  
  .zoom-nav {
    width: 40px;
    height: 40px;
  }
  
  .zoom-info {
    max-width: 300px;
  }
  
  .zoom-title {
    font-size: 1.1rem;
  }
  
  .thumbnail {
    width: 70px;
    height: 52px;
  }
}

@media (max-width: 480px) {
  .gallery-view {
    height: 300px;
  }
  
  .slide-info {
    padding: 1.5rem 1rem 1rem;
  }
  
  .slide-title {
    font-size: 1.1rem;
  }
  
  .slide-description {
    font-size: 0.9rem;
  }
  
  .gallery.controls-outside {
    padding: 0 40px;
  }
  
  .thumbnail {
    width: 60px;
    height: 45px;
  }
  
  .context-menu {
    min-width: 180px;
  }
  
  .zoom-info {
    max-width: 250px;
  }
  
  .zoom-title {
    font-size: 1rem;
  }
  
  .zoom-description {
    font-size: 0.8rem;
  }
}
</style>