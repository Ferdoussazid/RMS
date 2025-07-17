<template>
  <div class="flex flex-col items-start space-y-1">
    <span class="text-xs font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-xs font-medium text-red-500"> * </span>
    </span>
    <input v-model="inputVal" :type="inputType" disabled="true" :autocomplete="autocomplete"
      class="w-full h-full text-sm text-gray-800 border rounded-md border-slate-300 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
      :placeholder="placeholder" />
    <!-- @input="e => $emit('input', e.target.value)" -->
  </div>
</template>

<script>
  export default {
    props: {
      inputType: {
        type: String,
        default: 'text',
      },
      label: {
        type: String,
        required: true,
      },
      required: {
        type: Boolean,
        default: false,
      },
      prefill: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: 'Write here',
      },
      value: {
        type: String,
        default: '',
      },
      autocomplete: {
        type: String,
        default: 'on',
      },
    },
    data: () => ({}),
    computed: {
      inputVal: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        },
      },
    },
  }
</script>

<style lang="scss" scoped></style>
