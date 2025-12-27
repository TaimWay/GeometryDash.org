<template>
    <transition name="popup-slide" @enter="handleEnter" @leave="handleLeave">
        <div v-if="isVisible" class="popup">
            <div class="win-popup">
                <img src="/resource/close.png" alt="Close" class="button close-btn" @click="handleClose">
                <div class="content text-apply">
                    <!-- Always show title and button group -->
                    <h1>{{ title }}</h1>
                    
                    <!-- Custom slot content replaces message -->
                    <div v-if="$slots.default" class="custom-message">
                        <slot></slot>
                    </div>
                    <!-- Default message when no slot is provided -->
                    <span v-else class="default-message">{{ message }}</span>
                    
                    <!-- Always show button group -->
                    <div class="button-group">
                        <button 
                            v-for="(btn, index) in buttonList" 
                            :key="index"
                            class="button"
                            :class="{'cancel-btn': index > 0}"
                            @click="handleButtonClick(btn.event)"
                        >
                            {{ btn.text }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted, defineExpose } from 'vue'

// Internal state for popup visibility
const isVisible = ref(false)

// Define props for dynamic content
const props = defineProps({
    // Whether the popup is initially visible
    show: {
        type: Boolean,
        default: false
    },
    // Popup title
    title: {
        type: String,
        default: 'Hello World!'
    },
    // Popup message/content
    message: {
        type: String,
        default: 'Content goes here.'
    },
    // Button list for dynamic button generation
    buttonList: {
        type: Array,
        default: () => [
            { text: 'OK', event: 'ok' }
        ]
    }
})
// Define emit events - support dynamic events from buttonList
const emit = defineEmits(['close', 'enter', 'leave'])

// Expose methods to template ref
defineExpose({
    open,
    close: handleClose
})

// Open the popup
function open() {
    isVisible.value = true
}

// Handle close popup
function handleClose() {
    isVisible.value = false
    emit('close')
}

// Handle dynamic button click
function handleButtonClick(eventName) {
    isVisible.value = false
    emit(eventName)
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
    console.log('Popup component mounted')
})
</script>

<style scoped>
.popup {
    position: fixed;
    top: 0;
    left: 0;

    width: 100vw;
    height: 100vh;
}
.popup .win-popup {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    min-width: 50vw;
    height: 50vh;

    border-width: 2.5vh;
    border-style: solid;
    border-radius: 3vh;
    background-color: #995533;
    border-image: url(/resource/winbox.png) 10% round;
}
.popup .win-popup .close-btn {
    position: fixed;
    left: -4vw;
    top: -6vh;

    width: 5vw;   
    cursor: pointer;
} 

.popup .win-popup .content {
    padding: 2vh;
    text-align: center;
    font-size: 2.5rem;
    color: #fff;
    font-family: Pusab, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 90%;
}

.popup .win-popup .content h1 {
    font-size: 4rem;
    line-height: 10px;
    margin-bottom: 80px;
}

.popup .win-popup .content span {
    font-size: 2rem;
}

.popup .win-popup .content .button-group {
    display: flex;
    gap: 20px;
    margin-top: auto;
    justify-content: center;
    margin-top: 50px;
}

.popup .win-popup .content button {
    border: none;
    background: none;
    color: #fff !important;
    font-size: 2rem;
    font-weight: bold;
    text-transform: uppercase;
    font-family: Pusab, sans-serif;
    background-image: url('/resource/button_bg.png');
    background-repeat: no-repeat;
    padding: 20px;
    width: auto;
    background-repeat: round;
    display: flex;
    align-items: center;
    column-gap: 1.5%;
    justify-content: center;
    gap: 10px;
    height: 60px;
    min-width: 12vw;
    outline: none;
    cursor: pointer;
}

.popup .win-popup .content .cancel-btn {
    background-image: url('/resource/button_bg.png');
    filter: brightness(0.8);
}

/* Animation styles with center scale and bounce effect */
.popup-slide-enter-active {
    animation: popup-scale-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.popup-slide-leave-active {
    animation: popup-scale-out 0.3s ease;
}

@keyframes popup-scale-in {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    70% {
        opacity: 1;
        transform: scale(1.1);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes popup-scale-out {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    100% {
        opacity: 0;
        transform: scale(0.3);
    }
}
</style>
