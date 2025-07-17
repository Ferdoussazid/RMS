<template>
  <div class="relative flex items-center w-12 h-6 transition-colors rounded-full" :class="cursorDiabled ?
    'bg-slate-400 border-slate-400 cursor-not-allowed' : disabled ? 'bg-slate-400 border-slate-400 cursor-not-allowed' : status
      ? 'bg-green-500 border-green-500  cursor-pointer' : 'bg-red-500 border-red-500  cursor-pointer'"
    @click="toggleStatus">
    <div class="absolute w-5 h-5 transition-transform transform bg-white rounded-full shadow-md left-1"
      :class="status ? 'translate-x-6' : 'translate-x-0'"></div>
  </div>
</template>

<script>
export default {
  name: "ToggleSwitch",
  props: {
    status: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false
    },
    cursorDiabled: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    toggleStatus() {
      this.$emit("toggleStatus", !this.status); // Emit updated status to the parent
    },
  },
};
</script>
