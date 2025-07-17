<template>
  <div class="shado-md max-h-[200px] min-h-[200px] overflow-y-scroll rounded scrollbar-hide md:max-h-[350px]">
    <div
      v-for="(cardGroup, i) in items"
      :key="cardGroup.id"
      :class="[i % 2 === 0 ? 'bg-cyan-100 ' : 'bg-slate-50 ']"
      class="flex flex-row items-center space-x-2 rounded px-2 py-1.5 shadow-sm transition duration-300 hover:bg-slate-200"
    >
      <div class="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 p-2">
        <img src="/icon/group.png" alt="" class="pointer-events-none h-auto w-full" />
      </div>
      <div class="flex grow flex-col">
        <span class="text-xs font-semibold text-gray-700">{{ cardGroup.name }}</span>
        <span class="text-xs font-normal text-gray-500">{{ cardGroup.count }} cards</span>
      </div>
      <div class="cursor-pointer">
        <button
          class="flex cursor-pointer items-center gap-1 rounded border-2 border-red-500 bg-white px-2 py-1 text-xs font-semibold text-red-500 hover:border-red-500 hover:bg-red-500 hover:text-white"
          @click="$emit('remove-card-group', cardGroup.id)"
        >
          <i class="fas fa-times"></i><span>Detach</span>
        </button>
      </div>
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
