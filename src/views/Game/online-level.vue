<template>
    <div class="list-page">
        <OnlineLevel></OnlineLevel>
    </div>
</template>

<script setup>
import OnlineLevel from '../../components/WinList.vue'
</script>

<style scoped>
.list-page {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    padding: 10px;
    background-image: linear-gradient(#0065FD, #002E73);
    display: flex;
}
</style>