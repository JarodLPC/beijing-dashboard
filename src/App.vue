<script setup lang="ts">

import Home from "./views/Home.vue";

import { onMounted } from 'vue';

onMounted(() => {
  setInterval(() => {
    location.reload();
  }, 3 * 60 * 60 * 1000); // 3小时 = 3*60*60*1000 毫秒
});

</script>

<template>
  <div class="bg content">
    <dv-full-screen-container>
      <Home />
    </dv-full-screen-container>

  </div>
</template>

<style scoped></style>
