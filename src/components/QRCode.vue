<template>
  <div class="flex flex-col items-center p-4">
    <VueQrcode :value="text" :size="size" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
/* import VueQrcode from 'vue-qrcode'; */

defineProps({
  text: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 200
  }
});
</script>
