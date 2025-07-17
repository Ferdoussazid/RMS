<template>
  <div class="relative flex flex-col items-center">
    <span
      class="
        absolute
        top-0
        left-1/2
        -translate-y-1/2 -translate-x-1/2
        transform
        whitespace-pre
        bg-white
        px-2
        text-center text-xs
        font-normal
        text-gray-700
      "
      v-html="label"
    >
    </span>
    <input
      v-model="input"
      type="text"
      class="
        h-full
        w-full
        rounded-md
        border border-slate-300
        text-sm text-gray-800
        placeholder:text-sm placeholder:font-light placeholder:text-gray-400
      "
      :placeholder="placeholder"
      @input="e => $emit('input', e.target.value)"
    />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    prefill: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: 'Write here',
    },
    // value: {
    //   type: String,
    //   required: true,
    // },
  },
  data: () => ({
    input: '',
  }),
  computed: {
    // inputVal: {
    //   get() {
    //     return this.value
    //   },
    //   set(val) {
    //     this.$emit('input', val)
    //   },
    // },
  },
  mounted() {
    this.input = this.prefill
  },
}
</script>

<style lang="scss" scoped></style>
