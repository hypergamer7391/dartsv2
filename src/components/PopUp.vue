<template>
    <div v-if="visible" class="popup">
      <div class="popup-content">
        <slot></slot>
        
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        visible: false
      };
    },
    methods: {
      open() {
        this.visible = true;
      },
      close() {
        this.visible = false;
      }
    }
  };
  </script>
  
  <style scoped>
  option:hover {
    pointer-events: none;  
    background-color: #00ccff!important;
} 
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  .popup-content {
  max-width: 600px;
  width: 100%;

  
  padding: 40px;
  background-color: #333;
  border-radius: 5px;
  align-items: center;
  flex-direction: column;
  display: flex;

  
}

  
button {
  width: 100%;
  padding: 15px;
  font-size: 14px;
  background-color: white;
  color: black; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
  border-radius: 5px;
  border: 2px solid black;
}
  </style>
  