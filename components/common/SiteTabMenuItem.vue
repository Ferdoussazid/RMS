<template>
  <!-- <li class="list-none rounded-md w-full lg:w-3/4  :bg-blue-300" :class="[isSelected ? 'bg-blue-400 text-white' : '']" > -->
  <NuxtLink
    v-show="hasService"
    :class="[isSelected ? 'tab-active' : '']"
    class="group tab-lifted tab col-span-5 flex flex-col justify-center md:col-span-2 lg:col-span-1"
    :to="url"
  >
    <div class="flex w-full flex-row items-center justify-center gap-2 text-center">
      <div class="flex items-center gap-2">
        <span
          :class="[icon, 'w-3 text-xs', isSelected ? ' text-blue-600' : ' text-gray-600 group-hover:text-blue-400']"
          aria-hidden="true"
        ></span>
        <span
          class="text-xs font-bold"
          :class="[isSelected ? ' text-blue-600' : ' text-gray-600  group-hover:text-blue-400 ']"
        >
          {{ name }}
        </span>
      </div>
    </div>
  </NuxtLink>

  <!-- <NuxtLink
    class="tab-lifted tab flex-1"
    :to="url"
    :class="[
      isSelected
        ? 'tab-active text-gray-800 hover:text-gray-800 active:text-gray-800'
        : 'text-gray-500 hover:text-blue-800',
    ]"
  >
    <div
      class="text-sm font-bold leading-normal"
      :class="[isSelected ? 'hover:text-gray-800' : ' hover:text-blue-800']"
    >
      :class="{ ' text-blue-500': !isSelected, 'bg-blue-500 text-white': isSelected }"
      <i :class="icon" class="mr-1 text-base"></i> {{ name }}
    </div>
  </NuxtLink> -->
</template>

<script>
export default {
  props: {
    url: {
      type: String,
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
    hasService: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({
    isSelected: false,
  }),
  watch: {
    $route: {
      handler(val, old) {
        this.isSelected = val.path === this.url
      },
      immediate: true,
    },
  },
  methods: {},
}
</script>

<style scoped>
.nuxt-link-exact-active {
  color: darkslategray;
}
</style>
