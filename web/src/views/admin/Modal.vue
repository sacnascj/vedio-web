<template>
    <div v-if="isVisible" class="modal">
      <iframe :src="url" width="100%" height="100%"></iframe>
      <button @click="closeModal">关闭</button>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, emit } from 'vue';

defineProps({
  url: String
});
defineEmits(['close']);
const isVisible = ref(false);

const openModal = () => {
  isVisible.value = true;
};
const closeModal = () => {
  isVisible.value = false;
  emit('close');
};
defineExpose({ openModal, closeModal });
  </script>
  <style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  iframe {
    border: none;
  }
  </style>