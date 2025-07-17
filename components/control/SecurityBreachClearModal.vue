<template>
  <div
    v-if="showModal"
    class="fixed top-0 left-0 z-[999] flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition duration-300 ease-in-out"
  >
    <div class="w-11/12 rounded bg-white shadow md:w-1/2 lg:w-1/3">
      <div
        class="flex shrink-0 flex-row items-center justify-between overflow-hidden rounded border-b border-gray-200 bg-slate-100 px-4 py-2"
      >
        <div class="text-sm font-semibold text-gray-600">Please add a note to clear security breach.</div>
        <div>
          <button class="p-0.5 text-base font-medium text-slate-800" @click="cancelForm">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="p-6">
        <div class="flex w-full flex-col space-y-3">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium text-gray-700">
              Note <span class="text-xs font-medium text-red-500"> * </span>
            </span>
            <textarea
              key="note"
              v-model="form.note"
              class="h-24 w-full rounded-md border border-slate-300 text-sm text-gray-800 placeholder:text-sm placeholder:font-light placeholder:text-gray-400"
              placeholder="e.g. Site Installation Test"
            ></textarea>
            <!-- <FixedLabelInput v-model="form.note" label="Note" placeholder="e.g. Site Installation Test" required /> -->
            <div v-if="errors.note" class="text-xs italic text-red-500">{{ errors.note }}</div>
          </div>
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <button
            class="flex items-center justify-center gap-1 rounded-md bg-slate-500 px-3 py-1.5 shadow-lg hover:bg-slate-700"
            @click="cancelForm"
          >
            <div class="flex items-stretch text-xs font-medium text-white">
              <i class="fas fa-times"></i>
            </div>
            <span class="text-sm font-semibold text-white">Cancel</span>
          </button>
          <button
            class="flex items-center justify-center gap-1 rounded-md bg-blue-500 px-3 py-1.5 shadow-lg hover:bg-blue-700"
            @click="submitForm"
          >
            <CircularSpinner v-show="loading" size="sm" theme="border-white" />
            <span v-show="!loading" class="text-sm font-semibold text-white"><i class="fas fa-check-circle"></i></span>
            <span class="text-sm font-semibold text-white">Enter</span>
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
        note: '',
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
      if (!this.form.note) {
        this.errors.note = 'Note is required'
        this.$toast.error(this.errors.note)
        return
      }
      this.loading = true
      try {
        const data = {
          site_uid: this.siteConfig.siteUid,
          user_uid: this.userUid,
          note: this.form.note,
        }
        await this.$store.dispatch('site/clearSecurityBreach', data)
        this.$toast.success('Security breach alarm cleared')
      } catch (error) {
        this.errors.note = error.response?.data?.note || 'Failed to clear security breach alarm'
        for (const key in this.errors) {
          if (Object.hasOwnProperty.call(this.errors, key)) {
            this.$toast.error(this.errors[key])
          }
        }
        this.loading = false
        return
      }
      this.loading = false
      this.$store.dispatch('site/setSecurityBreachClearModal', false)
      this.clearForm()
    },
    cancelForm() {
      this.$store.dispatch('site/setSecurityBreachClearModal', false)
      this.errors = {}
      this.clearForm()
    },
    clearForm() {
      this.form.note = ''
    },
  },
}
</script>
