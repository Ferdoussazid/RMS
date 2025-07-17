<template>
  <div class="flex w-full flex-col items-center justify-center space-y-6 py-12">
    <img :src="icon" alt="" class="w-1/4 md:w-1/5 lg:w-1/6" />
    <p class="text-center text-sm font-normal text-gray-500">{{ message }}</p>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '/icon/no-result-found.png',
    },
    message: {
      type: String,
      default: `We couln't find any match for your search`,
    },
  },
}
</script>

<style lang="scss" scoped></style>
