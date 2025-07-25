<template>
  <div class="flex w-full flex-col gap-2">
    <AppToolbar title="Site Create" :with-site-id="false" />
    <div class="flex min-h-[80vh] w-full flex-col items-center rounded bg-white p-4">
      <div class="flex w-full flex-col items-start justify-center gap-4 md:w-3/4 lg:w-7/12">
        <span class="mx-0 w-full text-base font-semibold lg:mx-auto">Create Device Vendor</span>
        <div class="mx-0 grid w-full grid-cols-12 gap-4 lg:mx-auto">
          <FixedLabelInput
            v-model="form.name"
            label="Device Vendor Name"
            placeholder="Type the full device vendor name here"
            class="col-span-12 md:col-span-7"
          />
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-5">
            <span class="text-xs font-medium text-gray-700">Company</span>
            <select
              v-model="company"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[company ? 'text-sm  text-gray-600' : 'text-sm font-light text-gray-400']"
            >
              <option value="" disabled selected>Select a Company</option>
              <option v-for="c in companies" :key="c.id" class="text-sm text-gray-800" :value="c">
                {{ c.name }}
              </option>
            </select>
          </div>
          <FixedLabelInput
            v-model="form.phone"
            label="Phone Number"
            placeholder="Ex: 017XXXXXXXX"
            class="col-span-12 md:col-span-6"
          />
          <FixedLabelInput
            v-model="form.logo"
            label="Logo URL (Optional)"
            placeholder="Ex: https://abc.com/logo.png"
            class="col-span-12 md:col-span-6"
          /><FixedLabelInput
            v-model="form.address"
            label="Full Address (Optional)"
            placeholder="Type full address here"
            class="col-span-12"
          />
        </div>
        <div class="flex flex-row items-center gap-x-4">
          <button
            class="rounded bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600"
            @click="save"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            Save
          </button>
          <button
            class="rounded bg-gray-300 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-400"
            @click="cancelForm"
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
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  middleware: ['auth', 'setup', 'admin'],
  mixins: [UserTypeChecker],
  data: () => ({
    saving: false,
    company: '',
    form: {
      id: '',
      name: '',
      phone: '',
      address: '',
      logo: '',
    },
  }),
  computed: {
    ...mapGetters('user', ['rootUserUid']),
    ...mapGetters('customer', ['companies']),
  },

  async mounted() {
    await this.$store.dispatch('customer/getCompanyList')
  },

  methods: {
    async save() {
      if (this.saving) return
      this.saving = true
      try {
        this.validateForm(this.form)
        await this.$store.dispatch('device-vendor/createDeviceVendor', {
          name: this.form.name.trim(),
          phone: this.form.phone.trim(),
          address: this.form.address.trim() || null,
          logo: this.form.logo.trim() || null,
          company_id: this.company.id,
        })
        this.$toast.success('Device vendor created successfully')
        this.cancelForm()
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.saving = false
    },

    validateForm({ name, phone }) {
      if (!name) {
        throw new Error('Please enter a name')
      }
      if (!phone) {
        throw new Error('Please select a phone number')
      }
      if (!this.company) {
        throw new Error('Please select a company')
      }
    },

    cancelForm() {
      this.$router.push('/device-vendor/list')
    },
  },
}
</script>

<style lang="scss" scoped></style>
