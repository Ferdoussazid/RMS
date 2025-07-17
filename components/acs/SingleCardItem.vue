<template>
  <div
    class="flex cursor-pointer flex-row items-center space-x-2 rounded bg-white px-2 py-1.5 shadow-sm transition duration-300"
    :draggable="canDrag"
    @dragover.prevent
    @dragstart="onDragStart"
    @drop.stop="onDrop"
  >
    <div class="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 p-2">
      <img src="/icon/card.png" alt="" class="pointer-events-none h-auto w-full" />
    </div>
    <div class="flex grow flex-col">
      <span class="text-xs font-semibold text-gray-700">{{ card.card_number }}</span>
      <span class="text-xs font-normal text-gray-500">{{ card.name }}</span>
    </div>
    <div
      class="flex h-6 w-6 items-center justify-center rounded-full transition duration-300 group-hover:bg-gray-200"
      :class="[loading ? 'text-blue-500' : 'text-gray-500']"
    >
      <span class="text-xs">
        <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
        <i v-else class="fas fa-chevron-right"></i>
      </span>
    </div>
  </div>
</template>

<script>
import DraggableACSItem from '~/mixins/DraggableACSItem'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [DraggableACSItem, UserTypeChecker],
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    canDrag: true,
  }),
  computed: {},
  mounted() {
    if (this.isReadOnlyUser) this.canDrag = false
  },
  methods: {
    onDragStart(e) {
      if (!this.getPermissionStatus('drag a card')) return
      this.$store.commit('acs/RESET_GROUP_ATTACH_PARAMS')
      this.$store.commit('acs/UPDATE_GROUP_ATTACH_PARAMS', {
        cardGroupType: 'single',
        cardGroupId: this.card.id,
      })
    },
    onDrop(e) {
      if (!this.getPermissionStatus('drop a card')) return
      this.$store.commit('acs/UPDATE_GROUP_ATTACH_PARAMS', {
        cardGroupType: 'single',
        cardGroupId: this.card.id,
      })

      this.onDropSubmit()
    },
  },
}
</script>

<style lang="scss" scoped></style>
