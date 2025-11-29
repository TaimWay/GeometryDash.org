<script setup>
import HeaderMenu from './components/HeaderMenu.vue';
</script>

<template>
  <HeaderMenu></HeaderMenu>

  <div class="box">
    <RouterView>
    </RouterView>
  </div>
</template>

<style scoped>
.box {
  margin-top: 60px;
  padding: 10px;
}
</style>
