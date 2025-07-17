<template>
  <div class="flex flex-1 flex-col space-y-2 rounded transition duration-300 ease-in-out">
    <span class="px-1 text-xs font-semibold text-gray-700">Unattached Card Groups</span>
    <div class="max-h-[200px] overflow-scroll rounded shadow-md scrollbar-hide md:max-h-[300px]">
      <div
        v-for="(cardGroup, i) in items"
        :key="cardGroup.id"
        :class="[i % 2 === 0 ? 'bg-slate-100' : 'bg-white']"
        class="roundedshadow-sm flex flex-row items-center space-x-2 hover:bg-slate-200"
      >
        <span class="shrink-0 px-2 py-3 text-xs font-semibold text-gray-500">{{ i + 1 }}.</span>
        <span class="grow text-xs font-semibold text-gray-700">{{
          cardGroup.name + ' (' + cardGroup.count + ')'
        }}</span>
        <div class="relative px-2">
          <button
            class="flex cursor-pointer items-center gap-1 rounded border-2 border-sky-600 bg-white px-2 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-600 hover:text-white"
            @click="$emit('add-card-group', cardGroup.id)"
          >
            <i class="plus-icon fas fa-plus"></i><span>Attach</span>
          </button>
        </div>
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
  data: () => ({
    search: '',
  }),
  computed: {},
}
</script>

<style lang="scss" scoped></style>
