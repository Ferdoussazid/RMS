<template>
  <div
    class="flex flex-row items-center space-x-2 bg-gray-50 px-2 py-3"
    :class="serialNo % 2 === 0 ? 'bg-sky-100' : 'bg-white'"
  >
    <div class="flex h-10 w-10 flex-row items-center justify-center p-2">
      <img :src="setting.icon" alt="" class="" />
    </div>
    <div class="flex flex-grow flex-col items-center justify-center">
      <span class="text-base font-semibold text-blue-900"> {{ setting.data.value }} {{ setting.data.unit }}</span>
      <span class="text-xs font-medium text-gray-700">{{ setting.label }} </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    serialNo: {
      type: Number,
      required: true,
    },
    setting: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
