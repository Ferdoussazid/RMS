<template>
  <div v-click-outside="hideMenu" class="relative" :style="{ 'z-index': z }">
    <div
      class="flex w-full cursor-pointer items-center justify-between space-x-2 rounded-md border border-gray-200 bg-white px-4 py-2 shadow-sm transition duration-300"
      :class="{ 'bg-gray-200': isOpen }"
      @click="isOpen = !isOpen"
    >
      <span class="grow text-xs font-medium text-gray-600"> <i class="fa fa-filter mr-1"></i> {{ hint }} </span>
      <span
        class="text-sm font-medium text-gray-600 transition duration-300"
        :class="[isOpen ? 'opacity-100' : 'opacity-0']"
      >
        <i class="fa fa-times"></i>
      </span>
      <div
        v-show="selected.length"
        class="absolute top-0 right-0 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500"
      ></div>
    </div>

    <!-- v-click-outside="hideMenu" -->
    <ul
      class="absolute inset-x-0 left-0 right-0 top-full mt-1 max-h-[300px] origin-top transform list-none overflow-y-scroll rounded border border-slate-100 bg-white shadow-lg transition duration-200"
      :class="[isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0']"
    >
      <li
        class="flex cursor-pointer flex-row items-center space-x-1 bg-slate-100 bg-transparent px-3 py-2 text-gray-600 transition duration-300 hover:bg-gray-100"
      >
        <label class="flex w-full cursor-pointer items-center">
          <input v-model="selectAll" type="checkbox" class="mr-3 h-4 w-4 rounded border border-gray-300 focus:ring-0" />
          <span class="text-xs font-medium text-gray-600">Select All</span>
        </label>
      </li>
      <ul v-for="(group, i) in options" :key="i" class="w-full border-t border-gray-200">
        <li class="w-full px-3 py-1 text-[0.6rem] font-normal tracking-wide text-gray-500">
          {{ group.label }}
        </li>
        <li
          v-for="(o, j) in getMappedItems(group.items)"
          :key="j"
          class="flex cursor-pointer flex-row items-center space-x-1 bg-transparent text-gray-600 transition duration-300 hover:bg-gray-100"
        >
          <label class="flex w-full cursor-pointer items-center px-3 py-2">
            <input
              v-model="selected"
              type="checkbox"
              class="mr-3 h-4 w-4 rounded border border-gray-300 focus:ring-0"
              :value="o"
            />
            <span class="text-xs font-medium text-gray-700">{{ o.label }}</span>
          </label>
        </li>
      </ul>

      <li
        class="flex cursor-pointer flex-row items-center space-x-1 border-t border-gray-200 bg-slate-100 bg-transparent px-3 py-2 text-gray-600 transition duration-300"
        @click="clearAll"
      >
        <label class="flex w-full cursor-pointer items-center justify-center">
          <XIcon class="h-4" />
          <span class="text-xs font-medium text-gray-600">Clear Filter</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import ClickOutside from 'vue-click-outside'
import { XIcon } from 'vue-tabler-icons'
import { getCompanySpecificAlarmLabel, getTenantLabel } from '~/assets/js/Helper'

export default {
  components: {
    XIcon,
  },
  directives: {
    ClickOutside,
  },
  props: {
    z: {
      type: Number,
      default: 100,
    },
    options: {
      type: Array,
      required: true,
    },
    hint: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    isOpen: false,
    selected: [],
    selectAll: false,
  }),
  computed: {
    ...mapGetters('user', ['companyName']),
  },
  watch: {
    selectAll(val, old) {
      if (val) {
        this.selected = _.flatten(this.options.map(group => group.items))
      } else {
        this.selected = []
      }
    },
    selected(val, old) {
      this.$emit('input', val)
    },
  },
  mounted() {},
  methods: {
    hideMenu() {
      this.isOpen = false
    },
    clearAll() {
      this.selected = []
      this.selectAll = false
    },
    getMappedItems(alarms) {
      return alarms.map(alarm => {
        let label = getCompanySpecificAlarmLabel(this.companyName, alarm.id)
        if (label) {
          label = `${label} (${getTenantLabel(alarm.tenant)})`
        } else {
          label = alarm.label
        }

        return { ...alarm, label }
      })
    },
  },
}
</script>

<style scoped></style>
