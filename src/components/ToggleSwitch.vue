<template>
    <div class="mb-4">
      <label class="inline-flex items-center cursor-pointer space-x-3 select-none">
        <div class="relative">
          <!-- Hidden checkbox input -->
          <input 
            type="checkbox" 
            :checked="modelValue"
            @change="$emit('update:modelValue', $event.target.checked)"
            class="sr-only"
          >
          
          <!-- Toggle track -->
          <div 
            class="block w-14 h-7 rounded-full transition-colors duration-300" 
            :class="modelValue ? 'bg-blue-500 dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
          ></div>
          
          <!-- Toggle circle -->
          <div 
            class="absolute left-1 top-1 bg-white dark:bg-gray-100 w-5 h-5 rounded-full shadow transition-transform duration-300 transform"
            :class="{ 'translate-x-7': modelValue }"
          ></div>
        </div>
        
        <!-- Label text -->
        <span class="text-sm font-medium dark:text-white">{{ label }}</span>
      </label>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ToggleSwitch',
    props: {
      modelValue: {
        type: Boolean,
        required: true
      },
      label: {
        type: String,
        default: 'Toggle'
      }
    },
    emits: ['update:modelValue']
  }
  </script>
  
  <style scoped>
  /* Add some hover effects */
  .relative:hover .block {
    @apply bg-opacity-90;
  }
  
  /* Add focus styles for accessibility */
  input:focus + div {
    @apply ring-2 ring-offset-2 ring-blue-300 dark:ring-blue-700;
  }
  
  /* Add a nice transition for the toggle track */
  .block {
    @apply transition-all duration-300 ease-in-out;
  }
  </style>