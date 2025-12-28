<template>
    <div class="inputbox">
        <img v-if="showButtons" src="/resource/whitearrow-left.png" alt="Decrease" class="button" @click="decrement">
        <input 
            type="number" 
            :placeholder="placeholder" 
            class="text-apply" 
            v-model="currentValue"
            :min="min"
            :max="max"
            :step="step"
            @input="handleInput"
            @change="handleChange"
            ref="inputRef">
        <img v-if="showButtons" src="/resource/whitearrow-right.png" alt="Increase" class="button" @click="increment">
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Component props
const props = defineProps({
    // Initial value
    modelValue: {
        type: Number,
        default: 1
    },
    // Placeholder text
    placeholder: {
        type: String,
        default: '1'
    },
    // Minimum value
    min: {
        type: Number,
        default: 1
    },
    // Maximum value
    max: {
        type: Number,
        default: Infinity
    },
    // Step value for increment/decrement
    step: {
        type: Number,
        default: 1
    },
    // Whether to show increment/decrement buttons
    showButtons: {
        type: Boolean,
        default: true
    }
});

// Emit events
const emit = defineEmits(['update:modelValue', 'change']);

// Current value ref
const currentValue = ref(props.modelValue);
const inputRef = ref(null);

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
    if (newValue !== currentValue.value) {
        currentValue.value = newValue;
    }
});

// Watch for internal value changes and emit update
watch(currentValue, (newValue) => {
    emit('update:modelValue', newValue);
});

// Increment value
const increment = () => {
    const newValue = Math.min(currentValue.value + props.step, props.max);
    if (newValue !== currentValue.value) {
        currentValue.value = newValue;
        emit('change', newValue);
    }
};

// Decrement value
const decrement = () => {
    const newValue = Math.max(currentValue.value - props.step, props.min);
    if (newValue !== currentValue.value) {
        currentValue.value = newValue;
        emit('change', newValue);
    }
};

// Handle input event
const handleInput = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
        // Clamp value within min/max bounds
        const clampedValue = Math.max(props.min, Math.min(value, props.max));
        currentValue.value = clampedValue;
    }
};

// Handle change event
const handleChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
        // Clamp value within min/max bounds
        const clampedValue = Math.max(props.min, Math.min(value, props.max));
        currentValue.value = clampedValue;
        emit('change', clampedValue);
    } else {
        // Reset to current value if input is invalid
        event.target.value = currentValue.value;
    }
};
</script>

<style scoped>
.inputbox {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;
}

.inputbox img {
    width: 38px;
    cursor: pointer;
}

.inputbox input {
    width: 100px;
    border-radius: 10px;
    border: none;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 15px;
    font-size: 2rem;
    font-family: Pusab;
    /* Hide native number input buttons */
    -moz-appearance: textfield;
    text-align: center;
}

/* Hide native number input buttons for Webkit browsers */
.inputbox input::-webkit-outer-spin-button,
.inputbox input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Hide native number input buttons for Edge */
.inputbox input::-webkit-outer-spin-button,
.inputbox input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.inputbox input:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
</style>
