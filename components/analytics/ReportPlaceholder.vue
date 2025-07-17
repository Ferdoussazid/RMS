<template>
  <div class="flex w-full flex-col items-center justify-center space-y-4 py-2">
    <img src="/icon/search-report.png" alt="" class="w-1/3 md:w-1/4 lg:w-1/5" />
    <p class="w-1/2 text-center text-xs font-normal text-gray-500 md:w-1/3 lg:w-1/4">
      {{ message }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="scss" scoped></style>
