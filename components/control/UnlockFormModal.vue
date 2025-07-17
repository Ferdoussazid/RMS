<template>
  <div
    v-if="showModal"
    class="fixed top-0 left-0 z-[999] flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition duration-300 ease-in-out"
  >
    <div class="w-11/12 rounded bg-white shadow md:w-1/2 lg:w-1/3">
      <div
        class="flex shrink-0 flex-row items-center justify-between overflow-hidden rounded border-b border-gray-200 bg-slate-100 px-4 py-2"
      >
        <div class="text-sm font-semibold text-gray-600">Unlock Details</div>
        <div>
          <button class="p-0.5 text-base font-medium text-slate-800" @click="cancelForm">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="p-6">
        <div class="flex w-full flex-col space-y-3">
          <div class="flex flex-col gap-1">
            <FixedLabelInput v-model="form.organization" label="Organization" placeholder="e.g. TowerCo Ltd" />
            <div v-if="errors.organization" class="text-xs italic text-red-500">{{ errors.organization }}</div>
          </div>

          <div class="flex flex-col gap-1">
            <FixedLabelInput v-model="form.name" label="Name" placeholder="e.g. Mr. Lee" required />
            <div v-if="errors.name" class="text-xs italic text-red-500">{{ errors.name }}</div>
          </div>
          <div class="flex flex-col gap-1">
            <FixedLabelInput v-model="form.phone" label="Phone Number" placeholder="e.g. 01900123456" required />
            <div v-if="errors.phone" class="text-xs italic text-red-500">{{ errors.phone }}</div>
          </div>

          <div class="flex flex-col gap-1">
            <FixedLabelInput v-model="form.designation" label="Designation" placeholder="e.g. Assistant Engineer" />
            <div v-if="errors.designation" class="text-xs italic text-red-500">{{ errors.designation }}</div>
          </div>
          <div class="flex flex-col gap-1">
            <FixedLabelInput v-model="form.purpose" label="Purpose" placeholder="e.g. Rapair" required />
            <div v-if="errors.purpose" class="text-xs italic text-red-500">{{ errors.purpose }}</div>
          </div>
          <div class="flex gap-2">
            <input
              id="unlockForMe"
              v-model="form.unlockForMe"
              class="rounded"
              type="checkbox"
              @change="onCheckboxChange"
            />
            <label class="text-xs font-medium text-gray-700" for="unlockForMe"> Unlock for me </label>
          </div>
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <button
            class="flex items-center justify-center gap-1 rounded-md bg-red-500 px-3 py-1.5 shadow-lg hover:bg-red-700"
            @click="cancelForm"
          >
            <div class="flex items-stretch text-xs font-medium text-white">
              <i class="fas fa-times"></i>
            </div>
            <span class="text-sm font-semibold text-white">Cancel</span>
          </button>
          <button
            class="flex items-center justify-center gap-1 rounded-md bg-green-500 px-3 py-1.5 shadow-lg hover:bg-green-700"
            @click="submitForm"
          >
            <CircularSpinner v-show="loading" size="sm" theme="border-white" />
            <span v-show="!loading" class="text-sm font-semibold text-white"><i class="fas fa-unlock"></i></span>
            <span class="text-sm font-semibold text-white">Unlock Door</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      showModal: false,
      loading: false,
      form: {
        organization: '',
        name: '',
        phone: '',
        designation: '',
        purpose: '',
        unlockForMe: false,
      },
      errors: {},
    }
  },
  computed: {
    ...mapGetters('site', ['siteConfig']),
    ...mapGetters('user', ['userUid']),
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    async submitForm() {
      this.errors = {}
      if (this.loading) return
      this.loading = true
      try {
        const data = {
          site_uid: this.siteConfig.siteUid,
          user_uid: this.userUid,
          organization: this.form.organization || '',
          name: this.form.name || '',
          phone: this.form.phone || '',
          designation: this.form.designation || '',
          purpose: this.form.purpose || '',
          unlock_for_me: this.form.unlockForMe,
        }
        await this.$store.dispatch('site/unlockSite', data)
      } catch (error) {
        this.errors.name = error.response.data.name
        this.errors.phone = error.response.data.phone
        this.errors.designation = error.response.data.designation
        this.errors.organization = error.response.data.organization
        this.errors.purpose = error.response.data.purpose
        for (const key in this.errors) {
          if (Object.hasOwnProperty.call(this.errors, key)) {
            this.$toast.error(this.errors[key])
          }
        }
        this.loading = false
        return
      }
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 2000)
      })
      this.loading = false
      this.hide()
      this.clearForm()
      this.$toast.success('Command sent to Site')
    },
    cancelForm() {
      this.hide()
      this.errors = {}
      this.clearForm()
    },
    clearForm() {
      this.form.name = ''
      this.form.phone = ''
      this.form.designation = ''
      this.form.organization = ''
      this.form.purpose = ''
      this.form.unlockForMe = false
    },
    onCheckboxChange() {
      if (this.form.unlockForMe === true) {
        this.form.name = this.$auth.user.name
        this.form.phone = this.$auth.user.phone
        this.form.designation = this.$auth.user.designation
        this.form.organization = ''
        this.form.purpose = ''
        this.errors = {}
      } else {
        this.clearForm()
      }
    },
  },
}
</script>
