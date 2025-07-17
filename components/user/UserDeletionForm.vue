<template>
  <div
    v-if="showModal"
    class="fixed top-0 left-0 z-[999] flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition duration-300 ease-in-out"
  >
    <div class="flex w-11/12 flex-col gap-4 rounded bg-white md:w-1/2 lg:w-1/3">
      <div
        class="flex shrink-0 flex-row items-center justify-between overflow-hidden rounded-t border-b border-gray-200 bg-red-500 px-4 py-2"
      >
        <div class="flex items-center gap-2 text-sm font-semibold text-white">
          <span><i class="fas fa-user"></i></span><span>Delete User</span>
        </div>
        <div>
          <button class="p-0.5 text-base font-medium text-white" @click="onCancel">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-12 gap-2 p-6">
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Name</span><span class="text-sm font-semibold">{{ user.name }}</span>
        </div>
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Phone</span><span class="text-sm font-semibold">{{ user.phone }}</span>
        </div>
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Company</span><span class="text-sm font-semibold">{{ company }}</span>
        </div>
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Type</span><span class="text-sm font-semibold">{{ userType }}</span>
        </div>
        <div v-if="user.tenants" class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-sm font-semibold">Tenant</span><span>{{ tenant }}</span>
        </div>
        <div class="col-span-12 flex flex-col justify-center md:col-span-6">
          <span class="text-xs font-normal">Created At</span><span class="text-sm font-semibold">{{ createdAt }}</span>
        </div>
      </div>
      <div class="flex flex-col items-center gap-2 p-6">
        <div class=""><span class="text-base font-medium"> Are you sure you want to delete this user? </span></div>
        <div class="flex items-center justify-center gap-2">
          <button
            class="flex cursor-pointer items-center justify-center gap-1 rounded bg-red-500 px-3 py-1.5 shadow-lg hover:bg-red-700"
            @click="onUserDelete"
          >
            <CircularSpinner v-show="loading" size="sm" theme="border-white" />
            <span v-show="!loading" class="text-sm font-semibold text-white"><i class="fas fa-trash"></i></span>
            <span class="text-sm font-semibold text-white">YES</span>
          </button>

          <button
            class="flex cursor-pointer items-center justify-center gap-1 rounded bg-slate-500 px-3 py-1.5 shadow-lg hover:bg-slate-700"
            @click="onCancel"
          >
            <div class="flex items-stretch text-xs font-medium text-white">
              <i class="fas fa-times"></i>
            </div>
            <span class="text-sm font-semibold text-white">NO</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { format } from 'date-fns'
import { getCompanyById, getCompanyLabel, getTenantLabel, getUserTypeLabel } from '~/assets/js/Helper'

export default {
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      showModal: false,
      loading: false,
    }
  },
  computed: {
    createdAt() {
      const date = this._.get(this.user, 'created_at', null)
      if (!date) {
        return ''
      }
      return format(new Date(date), 'h:mm a, d MMM yy')
    },
    company() {
      const company = getCompanyById(this.user.company_id)
      return getCompanyLabel(company)
    },
    userType() {
      return getUserTypeLabel(this.user)
    },
    tenant() {
      if (!this.user.tenants) {
        return null
      }
      return getTenantLabel(this.user.tenants[0])
    },
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    async onUserDelete() {
      this.loading = true
      try {
        await this.$store.dispatch('user/deleteUser', this.user.uid)
        this.onCancel()
        this.$toast.success('User Successfully Deleted!')
      } catch (error) {
        this.$toast.error('Error Deleting User!')
      }
      this.loading = false
    },
    onCancel() {
      this.showModal = false
    },
  },
}
</script>
