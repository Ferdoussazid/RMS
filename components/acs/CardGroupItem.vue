<template>
  <div
    class="group flex cursor-pointer flex-row items-center space-x-2 rounded bg-white px-2 py-1.5 shadow-sm transition duration-300"
    :draggable="canDrag"
    @click="onClick"
    @dragover.prevent
    @dragstart="onDragStart"
    @drop.stop="onDrop"
  >
    <div class="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 p-1.5">
      <img src="/icon/group.png" alt="" class="h-auto w-full" />
    </div>
    <div class="flex grow flex-col">
      <span class="text-xs font-semibold text-gray-700">{{ group.name }}</span>
      <span class="text-xs font-normal text-gray-500">{{ group.count }} cards</span>
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
    group: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      canDrag: true,
    }
  },
  mounted() {
    if (this.isReadOnlyUser) this.canDrag = false
  },
  methods: {
    onClick() {
      this.$router.push({ path: '/access/card-group/save', query: { groupId: this.group.id } })
    },
    onDragStart(e) {
      if (!this.getPermissionStatus('drag a card group')) return
      this.$store.commit('acs/RESET_GROUP_ATTACH_PARAMS')
      this.$store.commit('acs/UPDATE_GROUP_ATTACH_PARAMS', {
        cardGroupType: 'group',
        cardGroupId: this.group.id,
      })
    },
    onDrop(e) {
      if (!this.getPermissionStatus('drop on a card group')) return
      this.$store.commit('acs/UPDATE_GROUP_ATTACH_PARAMS', {
        cardGroupType: 'group',
        cardGroupId: this.group.id,
      })

      this.onDropSubmit()
    },
  },
}
</script>

<style lang="scss" scoped></style>
