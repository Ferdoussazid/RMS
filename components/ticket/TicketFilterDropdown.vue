<template>
  <div v-click-outside="hideMenu" class="relative" :style="{ 'z-index': z }">
    <div
      class="flex items-center justify-between w-full px-4 py-2 space-x-2 transition duration-300 bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer"
      :class="{ 'bg-gray-200': isOpen }"
      @click="isOpen = !isOpen"
    >
      <span class="text-xs font-medium text-gray-600 grow"> <i class="mr-1 fa fa-filter"></i> {{ hint }} </span>
      <span
        class="text-sm font-medium text-gray-600 transition duration-300"
        :class="[isOpen ? 'opacity-100' : 'opacity-0']"
      >
        <i class="fa fa-times"></i>
      </span>
      <div
        v-show="selected.length"
        class="absolute right-0 top-0 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 transform rounded-full bg-indigo-500"
      ></div>
    </div>

    <!-- v-click-outside="hideMenu" -->
    <ul
      class="absolute inset-x-0 left-0 right-0 top-full mt-1 max-h-[300px] origin-top transform list-none overflow-y-scroll rounded border border-slate-100 bg-white shadow-lg transition duration-200"
      :class="[isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0']"
    >
      <!-- <li
        class="flex flex-row items-center px-3 py-2 space-x-1 text-gray-600 transition duration-300 bg-transparent cursor-pointer bg-slate-100 hover:bg-gray-100"
      >
        <label class="flex items-center w-full cursor-pointer">
          <input v-model="selectAll" type="checkbox" class="w-4 h-4 mr-3 border border-gray-300 rounded focus:ring-0" />
          <span class="text-xs font-medium text-gray-600">Select All</span>
        </label>
      </li> -->
      <ul v-for="(group, i) in options" :key="i" class="w-full border-t border-gray-200">
        <li class="w-full px-3 py-1 text-[0.6rem] font-normal tracking-wide text-gray-500">
          {{ group.label }}
        </li>
        <li
          v-for="(o, j) in group.items"
          :key="j"
          class="flex flex-row items-center space-x-1 text-gray-600 transition duration-300 bg-transparent cursor-pointer hover:bg-gray-100"
        >
          <label class="flex items-center w-full px-3 py-2 cursor-pointer">
            <input
              v-model="selected"
              type="checkbox"
              class="w-4 h-4 mr-3 border border-gray-300 rounded focus:ring-0"
              :value="o"
            />
            <span class="text-xs font-medium text-gray-700">{{ o.label }}</span>
          </label>
        </li>
      </ul>

      <li
        class="flex flex-row items-center px-3 py-2 space-x-1 text-gray-600 transition duration-300 bg-transparent border-t border-gray-200 cursor-pointer bg-slate-100"
        @click="clearAll"
      >
        <label class="flex items-center justify-center w-full cursor-pointer">
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
        this.selected = _.flatten(this.options.map(o => o.items))
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
      return this.options
    },
  },
}
</script>

<style scoped></style>
