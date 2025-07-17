<template>
  <div class="max-h-[200px] min-h-[200px] overflow-y-scroll rounded scrollbar-hide md:max-h-[350px]">
    <div
      v-for="(site, i) in items"
      :key="site.uid"
      :class="[i % 2 === 0 ? 'bg-teal-100' : 'bg-slate-50']"
      class="flex flex-row items-center space-x-2 px-2 py-1.5 shadow-sm transition duration-300"
    >
      <div class="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 p-2">
        <img src="/icon/tower.png" alt="" class="pointer-events-none h-auto w-full" />
      </div>
      <div class="flex grow flex-col">
        <span class="text-xs font-semibold text-gray-700">{{ site.name }}</span>
      </div>
      <div
        class="relative mr-6 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition duration-300"
      >
        <button
          class="text-2xs shrink-0 rounded border border-red-500 px-1.5 py-0.5 text-red-500 transition duration-300 hover:bg-red-500 hover:text-white"
          @click="$emit('remove-site', site.uid)"
        >
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>
    <div v-if="!items.length" class="flex h-full w-full flex-col items-center justify-center">
      <img src="/icon/nothing.png" alt="" class="h-auto w-16" />
      <span class="text-center text-sm font-normal text-gray-400">No Site Added </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  data: () => ({}),
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
