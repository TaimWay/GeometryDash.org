<template>
    <transition name="window-slide" @enter="handleEnter" @leave="handleLeave">
        <div v-if="isVisible" class="windows-box">
            <img src="/resource/back.png" alt="Back" class="back button" @click="handleClose">
            <div class="winbox">
                <div class="window-content">
                    <!-- Slot for custom content -->
                    <slot>
                        <!-- Default content if no slot provided -->
                        <h2 class="window-title">Window Title</h2>
                        <div class="window-body">
                            <p>This is the window content area</p>
                            <p>You can add any content you want to display here</p>
                        </div>
                    </slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue'

// Internal state for window visibility
const isVisible = ref(false)

// Define props
const props = defineProps({
    // Whether the window is initially visible
    show: {
        type: Boolean,
        default: false
    }
})

// Define emit events
const emit = defineEmits(['close', 'enter', 'leave'])

// Expose methods to template ref
defineExpose({
    open,
    close: handleClose
})

// Open the window
function open() {
    isVisible.value = true
}

// Handle close window
function handleClose() {
    isVisible.value = false
    emit('close')
}

// Handle action button click
function handleAction() {
    // Add specific business logic here
}

// Animation lifecycle hooks
function handleEnter(el) {
    emit('enter', el);
}

function handleLeave(el) {
    emit('leave', el);
}

// Watch for prop changes
import { watch } from 'vue'
watch(() => props.show, (newVal) => {
    isVisible.value = newVal
})

// Initialize visibility based on props
onMounted(() => {
    isVisible.value = props.show
    console.log('Window component mounted')
})
</script>

<style scoped>
.windows-box {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    z-index: 1000;
    font-family: Pusab, Arial;
}

.windows-box .winbox {
    width: 80%;
    height: 80%;
    margin: auto;
    background-color: rgba(48, 48, 48, 0.8);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    overflow: hidden;
}

.windows-box .back {
    position: fixed;
    left: 10px;
    top: 100px;
    width: 64px;
}

.window-content {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.window-title {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    padding-bottom: 10px;
}

.window-body {
    flex: 1;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.window-body p {
    margin: 0;
    font-size: 1.8rem;
    text-align: center;
}

/* Animation styles */
.window-slide-enter-active,
.window-slide-leave-active {
    transition: all 0.4s ease;
}

.window-slide-enter-from {
    opacity: 0;
    transform: translateY(-100%);
}

.window-slide-enter-to {
    opacity: 1;
    transform: translateY(0);
}

.window-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}

.window-slide-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}
</style>
