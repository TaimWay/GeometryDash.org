<script setup>
import { ref, onMounted } from 'vue';
import ShowLevel from '../../components/ShowLevel.vue';
import Level from '../../utils/Level';
import { Music } from '../../utils/Music';
import { getUrlParameter } from '../../utils/utils';

const level = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const id = getUrlParameter("id");
    
    if (!id) {
      throw new Error('Missing level ID parameter');
    }

    const response = await fetch(`https://gdbrowser.com/api/level/${id}`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const levelData = await response.json();
    
    if (levelData && levelData.id) {
      level.value = new Level(levelData);
    } else {
      throw new Error('The data format returned by the API is incorrect');
    }
  } catch (err) {
    error.value = err.message;
    console.error('Failed to obtain level data: ', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error" class="error">{{ error }}</div>
  <ShowLevel v-else-if="level" :level="level"></ShowLevel>
</template>