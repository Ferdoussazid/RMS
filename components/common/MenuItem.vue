<template>
  <li
    :class="[
      isSelected ? 'bg-indigo-500 text-white shadow-inner' : 'text-gray-700',
      'group cursor-pointer hover:bg-indigo-400',
    ]"
    @click="$bus.$emit('drawer', 'close')"
  >
    <NuxtLink :class="['flex w-full flex-row items-center py-2.5 pr-4', nested ? 'pl-14' : 'pl-8']" :to="url">
      <span :class="[icon, 'w-3 text-xs group-hover:text-white']" aria-hidden="true"></span>
      <span class="ml-4 flex-grow text-sm font-semibold group-hover:text-white">
        {{ name }}
      </span>
    </NuxtLink>
  </li>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: false,
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: 'none',
    },
    nested: {
      type: Boolean,
      default: false,
    },
    inSiteSpecificRoute: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isSelected: false,
  }),
  watch: {
    $route: {
      handler(val, old) {
        if (this.inSiteSpecificRoute) {
          this.isSelected = true
        } else if (val.path.split('/')[1] === 'dashboard') {
          this.isSelected = this.tag === '/dashboard'
        } else {
          this.isSelected = val.path === this.tag
        }
      },
      immediate: true,
    },
  },
  methods: {},
}
</script>

<style lang="scss" scoped></style>
