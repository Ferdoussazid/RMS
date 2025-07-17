<template>
  <div class="flex items-stretch justify-center">
    <div class="flex w-2/3 flex-col items-center gap-y-4 rounded border border-gray-200 bg-gray-100 py-8">
      <h4 class="text-center">Bind new device to site</h4>
      <div class="flex flex-col items-start">
        <span class="font-semibold">Commercial ID</span>
        <input
          v-model="com_id"
          type="text"
          class="w-full rounded-md border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
          placeholder="Ex: 42596"
        />
      </div>
      <div class="flex flex-row items-center gap-x-4">
        <button
          class="flex w-1/2 items-center justify-center gap-1 rounded bg-green-300 py-2 px-2 text-xs font-semibold text-gray-800 hover:bg-gray-400"
          @click="save"
        >
          <i v-if="binding" class="fas fa-circle-notch fa-spin"></i>
          <i v-else class="fas fa-check"></i>
          <span>Bind</span>
        </button>
        <button
          class="flex w-1/2 items-center justify-center gap-1 rounded bg-gray-300 py-2 px-2 text-xs font-semibold text-gray-800 hover:bg-gray-400"
          @click="$emit('close', 'create')"
        >
          <i class="fas fa-times"></i>
          <span>Cancel</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    site: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    binding: false,
    com_id: null,
  }),
  methods: {
    async save() {
      if (this.binding) return
      this.binding = true
      try {
        await this.$store.dispatch('customer/bindDevice', {
          user_uid: this.site.user_uid,
          site_uid: this.site.uid,
          com_id: +this.com_id,
        })
        this.$emit('binded', +this.com_id)
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
      this.binding = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
