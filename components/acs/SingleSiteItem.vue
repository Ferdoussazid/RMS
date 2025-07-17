<template>
  <div
    class="flex cursor-pointer flex-row items-center space-x-2 rounded bg-white px-2 py-1.5 shadow-sm transition duration-300"
    draggable="true"
    @dragover.prevent
    @dragstart="onDragStart"
    @drop.stop="onDrop"
  >
    <div class="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-300 p-2">
      <img src="/icon/tower.png" alt="" class="pointer-events-none h-auto w-full" />
    </div>
    <div class="flex grow flex-col">
      <span class="text-xs font-semibold text-gray-700">{{ site.name }}</span>
      <span class="text-xs font-normal text-gray-500">{{ zoneLabel }}</span>
    </div>
    <div
      class="flex h-6 w-6 items-center justify-center rounded-full transition duration-300 group-hover:bg-gray-200"
      :class="[loading ? 'text-blue-500' : 'text-gray-500']"
    >
      <span class="text-xs">
        <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
      </span>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import DraggableACSItem from '~/mixins/DraggableACSItem'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [DraggableACSItem, UserTypeChecker],
  props: {
    site: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    isDragoverActive: false,
    canDrag: true,
  }),
  computed: {
    zoneLabel() {
      const label = [
        _.get(this.site, 'place.thana', '') || '',
        _.get(this.site, 'place.district', '') || '',
        _.get(this.site, 'place.division', '') || '',
      ]
        .filter(v => !!v.trim())
        .join(', ')
      return label || 'No Zone Found'
    },
  },
  mounted() {
    if (this.isReadOnlyUser) this.canDrag = false
  },
  methods: {
    onDragStart(e) {
      if (!this.getPermissionStatus('drag a site')) return
      this.$store.commit('acs/RESET_GROUP_ATTACH_PARAMS')
      this.$store.commit('acs/UPDATE_GROUP_ATTACH_PARAMS', {
        siteGroupType: 'single',
        siteGroupId: this.site.uid,
      })
    },
    onDrop(e) {
      if (!this.getPermissionStatus('drop a site')) return
      this.$store.commit('acs/UPDATE_GROUP_ATTACH_PARAMS', {
        siteGroupType: 'single',
        siteGroupId: this.site.uid,
      })

      this.onDropSubmit()
    },
  },
}
</script>

<style lang="scss" scoped></style>
