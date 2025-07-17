<template>
  <div class="flex w-36 cursor-pointer flex-row items-center px-4 py-2 transition duration-300 hover:bg-gray-100" @click="onClick">
    <i :class="[icon, 'w-6 text-xs text-gray-500']"></i>
    <span class="text-sm font-light text-gray-500">
      {{ label }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClick() {
      if (this.action === 'logout') {
        this.$auth.logout()
      } else {
        this.$router.push(this.action)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
