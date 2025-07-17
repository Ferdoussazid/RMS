<template>
  <div class="flex w-full flex-col gap-2">
    <AppToolbar title="RMS Device Creation" :with-site-id="false" />
    <div class="flex min-h-[80vh] w-full flex-col gap-4 rounded bg-white p-4">
      <span class="mx-0 w-full text-base font-semibold lg:mx-auto lg:w-1/3">Create Device</span>
      <div class="mx-0 flex w-full flex-col items-stretch justify-center gap-4 lg:mx-auto lg:w-1/3">
        <div class="flex flex-col items-start">
          <span class="text-xs font-semibold">Commercial ID</span>
          <div class="flex w-full items-center gap-2">
            <div class="w-11/12 rounded-md border border-gray-200 bg-gray-200 px-4 py-1 shadow-sm">
              <span class="text-sm font-semibold text-gray-800"> {{ comId }}</span>
            </div>
            <div class="w-1/12">
              <i
                :class="[isFetchingComId ? ' rotate-180 transform animate-spin' : '']"
                class="fas fa-sync-alt cursor-pointer"
                @click="getComId"
              ></i>
            </div>
          </div>
        </div>
        <div class="flex flex-col items-start">
          <span class="text-xs font-semibold">Phone Number</span>
          <input
            v-model="form.phone"
            type="text"
            class="w-full rounded-md border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
            placeholder="Ex: 01912345678"
          />
        </div>
        <div class="flex flex-col items-start">
          <span class="text-xs font-semibold">IMEI</span>
          <input
            v-model="form.imei"
            type="text"
            class="w-full rounded-md border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
            placeholder="Ex: 2862182719827727"
          />
        </div>
        <div class="flex flex-col items-start">
          <span class="text-xs font-semibold">Version</span>
          <input
            v-model="form.version"
            type="text"
            class="w-full rounded-md border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
            placeholder="Ex: 1.1"
          />
        </div>
        <div class="col-span-2 flex flex-row items-center gap-x-4">
          <button
            class="rounded bg-green-500 py-2 px-4 text-xs font-semibold text-white hover:bg-green-600"
            @click="save"
          >
            <i v-if="creating" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            Create
          </button>
          <button
            class="rounded bg-gray-300 py-2 px-4 text-xs font-semibold text-gray-800 hover:bg-gray-400"
            @click="cancelDeviceForm"
          >
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['auth', 'setup', 'admin'],
  data: () => ({
    creating: false,
    isFetchingComId: false,
    comId: null,
    form: {
      phone: '',
      imei: '',
      version: '',
    },
  }),

  mounted() {
    this.getComId()
  },

  methods: {
    async getComId() {
      try {
        this.isFetchingComId = true
        const res = await this.$store.dispatch('customer/createComId')
        this.comId = res.data.comId
        this.isFetchingComId = false
      } catch (error) {
        console.log(error)
      }
    },

    async save() {
      if (this.creating) return
      this.creating = true
      try {
        await this.$store.dispatch('customer/createDevice', { ...this.form, com_id: this.comId })
        this.$toast.success('Device successfully created')
        this.creating = false
        this.$router.push('/device/list')
      } catch (error) {
        this.$toast.error(error)
      }
    },

    cancelDeviceForm() {
      this.$router.push('/device/list')
    },
  },
}
</script>

<style lang="scss" scoped></style>
