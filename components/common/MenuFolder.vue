<template>
  <li class="cursor-pointer text-gray-700">
    <div class="flex w-full flex-col">
      <div
        class="group flex w-full flex-row items-center py-2.5 pl-8 pr-4 transition duration-300 hover:bg-indigo-400"
        @click="toggle"
      >
        <span :class="[icon, 'w-3 shrink-0 text-xs group-hover:text-white']" aria-hidden="true"></span>
        <span class="ml-4 grow text-sm font-semibold group-hover:text-white">
          {{ name }}
        </span>
        <span
          :class="['fas shrink-0 text-xs group-hover:text-white', expanded ? 'fa-caret-down' : 'fa-caret-right']"
        ></span>
      </div>

      <div :class="[expanded ? 'flex w-full flex-col ' : 'hidden']">
        <slot name="items"></slot>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    expanded: false,
  }),
  watch: {
    $route: {
      handler(val, old) {
        this.expanded = [
          '/site',
          '/mains',
          '/oem/data',
          '/generator',
          '/fuel',
          '/battery',
          '/temperature',
          '/access',
          '/alarm',
          '/settings',
          '/report',
        ].includes(val.path)
      },
      immediate: true,
    },
  },
  methods: {
    toggle() {
      this.expanded = !this.expanded
    },
  },
}
</script>

<style lang="scss" scoped></style>
