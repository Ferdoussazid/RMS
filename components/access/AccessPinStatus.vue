<template>
  <div class="flex w-full flex-col items-center justify-center rounded-md py-10">
    <div
      class="flex h-14 w-14 flex-row items-center justify-center rounded-full bg-gradient-to-tr p-3 shadow-lg"
      :class="[isClosed ? 'from-green-500 to-green-300' : 'from-red-500 to-red-300']"
    >
      <img :src="icon" alt="" class="" />
    </div>

    <p class="mt-2 text-center text-xs font-semibold text-gray-700">
      <span :class="[isClosed ? 'text-green-500' : 'text-red-500']">
        {{ statusLabel }}
      </span>
      <br />
    </p>
  </div>
</template>

<script>
export default {
  props: {
    isClosed: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  computed: {
    statusLabel() {
      const state = this.isClosed ? 'Closed' : 'Open'
      return `${this.name} ${state}`
    }
  }
}
</script>

<style lang="scss" scoped></style>
