<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
    <div class="info">
        <span class="title">404 - Page Not Found</span>
        <span class="top">Please check if your page URL is correct.</span>
        <RouterLink to="/" class="back">Back to Home</RouterLink>
    </div>
</template>

<style scoped>
.info {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100px;
    gap: 10px;

    font-family: 'CascadiaCode';
}

.info .title {
    font-weight: bold;
    font-size: 2rem;
    color: var(--theme-primary);
}

.info .tip {
    color: var(--text-primary);
}

.info .back {
    background: none;
    border: none;
    margin-top: 50px;
    font-size: 18px;
    cursor: pointer;
    text-decoration: none;
    color: var(--text-primary);
    transition: color .2s;
}

.info .back:hover {
    color: var(--theme-primary)
}
</style>