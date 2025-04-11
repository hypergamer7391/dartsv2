<template>

  <h1>Darts Game</h1>
  <div class="buttons">
    <div class="button" @click="open">
      <h4>Tablet Mode</h4>
      <p>Klicke hier um den Tablet Mode zu starten</p>
    </div>
    <div class="button" @click="toFastGame">
      <h4>Schnelles Spiel</h4>
      <p>Klicke hier um ein schnelles Spiel zu starten</p>
    </div>
  </div>
  <!-- <div class="circle">
    <h2 class="p-circle">Have Fun!</h2>
  </div> -->




  <Popup ref="TabletConnect">
    <h1>Scanne den QR Code mit einem Tablet!</h1>
    <div class="flex flex-col items-center p-6">
      <QRCodeGenerator :text="qrText" :size="250" />
    </div>
    <button @click="close">Close</button>
  </Popup>

</template>

<script setup>
import Popup from '../components/PopUp.vue'
import { ref } from 'vue'
import QRCodeGenerator from '../components/QRCode.vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()


const qrText = ref('Fehler');
const id = ref()
const TabletConnect = ref();

function open() {
  id.value = Date.now()
  qrText.value = "www.google.de"
  TabletConnect.value.open()
}

function close() {
  TabletConnect.value.close()
}

function toFastGame() {
  router.push('/fast-duell/create');
}
</script>

<style>
body,
#app {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
  margin: 0;
}
body{
  background-color: #003B46;
}
</style>
<style scoped>
h1 {
  font-family: Arial, Helvetica, sans-serif;
  color: #C4DFE6;
  font-size: 400%;
}

.buttons {
  display: flex;
  width: 100%;
}

.button {
  width: 30vw;
  height: 30vh;
  background-color: #07575B;
  margin: 10%;
  border-radius: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #66A5AD;
  font-size: xx-large;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button h4 {
  top: 10px;
}

.button:hover {
  transform: scale(1.2);
  background-color: #07575B;
  color: #66A5AD;
}

.button:hover h4 {
  color: #66A5AD;
  top: 10px;
}

.button:hover p {
  margin: 10%;
  opacity: 1;
  transform: translateY(0);
}

.container:hover h2 {
  top: 20%;
}

p {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.circle {
  width: 40vw;
  height: calc(40vw/2);
  background-color: #66A5AD;
  border-top-left-radius: 500px;
  border-top-right-radius: 500px;
  border-bottom: 0;
  bottom: 0;
  position: absolute;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.p-circle{
  color: #07575B;
  z-index: 0;
  opacity: 100;
  font-size: xx-large;
  font-weight: 1000;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
    /* Startet leicht unterhalb */
  }

  100% {
    opacity: 1;
    transform: translateY(0);
    /* Normaler Zustand */
  }
}
</style>