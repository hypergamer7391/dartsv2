<script setup>
import QRCodeGenerator from '../components/QRCode.vue' 
import { ref } from 'vue';

const qrText = ref('Hallo Welt!');
</script>

<template>
  <div class="flex flex-col items-center p-6">
    <input v-model="qrText" placeholder="Text eingeben" class="border p-2 rounded mb-4" />
    <QRCodeGenerator :text="qrText" :size="250" />
  </div>
</template>

