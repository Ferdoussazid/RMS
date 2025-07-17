<template>
  <div v-if="showModal"
    class="fixed top-0 left-0 z-[999] flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition duration-300 ease-in-out">
    <div class="w-11/12 rounded bg-white shadow md:w-1/2 lg:w-1/3">
      <div
        class="flex shrink-0 flex-row items-center justify-between overflow-hidden rounded-t border-b border-gray-200 bg-blue-500 px-4 py-2">
        <div class="flex items-center gap-2 text-sm font-semibold text-white">
          <span><i class="fas fa-user"></i></span><span>Update User</span>
        </div>
        <div>
          <button class="p-0.5 text-base font-medium text-white" @click="cancelForm">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div v-if="!loading" class="p-6">
        <div class="flex w-full flex-col space-y-3">
          <div v-if="isSud" class="flex flex-col gap-1">
            <div>
              <span class="text-xs font-medium text-gray-700">Company</span>
              <span class="text-xs font-medium text-red-500"> * </span>
            </div>
            <select v-model="form.company"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[form.company ? 'text-sm  text-gray-600' : 'text-sm font-light text-gray-400']">
              <option value="" disabled selected>Select a Company</option>
              <option v-for="c in companies" :key="c.id" class="text-sm text-gray-800" :value="c.id">
                {{ c.name }}
              </option>
            </select>
            <div v-if="errors.company" class="text-xs italic text-red-500">{{ errors.company }}</div>
          </div>

          <div class="flex flex-col gap-1">
            <FixedLabelInput v-model="form.name" required label="Name" placeholder="e.g. Mr. Lee" />
            <div v-if="errors.name" class="text-xs italic text-red-500">{{ errors.name }}</div>
          </div>
          <div class="flex flex-col gap-1">
            <FixedLabelInput v-model="form.phone" autocomplete="off" label="Phone Number" placeholder="e.g. 01900123456"
              required />
            <div v-if="errors.phone" class="text-xs italic text-red-500">{{ errors.phone }}</div>
          </div>
          <div class="flex flex-col gap-1">
            <div>
              <span class="text-xs font-medium text-gray-700">User Status</span>
              <span class="text-xs font-medium text-red-500"> * </span>
            </div>
            <select v-model="form.status"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[form.status ? 'text-sm  text-gray-600' : 'text-sm font-light text-gray-400']">
              <option value="" disabled selected>Select Status</option>
              <option v-for="s in statuses" :key="s.id" class="text-sm text-gray-800" :value="s.value">
                {{ s.name }}
              </option>
            </select>
            <div v-if="errors.status" class="text-xs italic text-red-500">{{ errors.status }}</div>
          </div>

          <div class="flex flex-col gap-1">
            <div>
              <span class="text-xs font-medium text-gray-700">User Type</span>
              <span class="text-xs font-medium text-red-500"> * </span>
            </div>
            <select v-model="form.type"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[form.type ? 'text-sm  text-gray-600' : 'text-sm font-light text-gray-400']">
              <option value="" disabled selected>Select a Type</option>
              <option v-for="t in userTypeOptions" :key="t.id" class="text-sm text-gray-800" :value="t.value">
                {{ t.name }}
              </option>
            </select>
            <div v-if="errors.type" class="text-xs italic text-red-500">{{ errors.type }}</div>
          </div>
          <div v-if="form.type === 'read_only'" class="flex flex-col gap-1">
            <span class="text-xs font-medium text-gray-700">Tenant</span>
            <select v-model="form.tenants"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <option v-for="t in tenants" :key="t.id" class="text-sm text-gray-800" :value="t.value">
                {{ t.name }}
              </option>
            </select>
            <div v-if="errors.tenants" class="text-xs italic text-red-500">{{ errors.tenants }}</div>
          </div>
          <div class="flex flex-col gap-1">
            <FixedLabelInput v-model="form.password" input-type="password" autocomplete="off"
              label="Password (Optional)" placeholder="******" />
            <div v-if="errors.password" class="text-xs italic text-red-500">{{ errors.password }}</div>
          </div>
          <hr>
          <div class="flex flex-col gap-1">
            <div>
              <span class="text-xs font-medium text-gray-700">Permissions</span>
            </div>
            <div class="grid grid-cols-12">
              <div v-for="access in userAccessList" :key="access.id"
                class="gap-2 py-2 flex align-middle col-span-12 md:col-span-6">
                <ToggleSwitch v-if="isSudoUser || access.public" :status="access.checked"
                  @toggleStatus="toggleStatus(access)" />
                <span class="text-sm font-medium text-gray-700" v-if="isSudoUser || access.public">{{
                  access.name }}</span>

              </div>
            </div>
          </div>
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <button
            class="flex cursor-pointer items-center justify-center gap-1 rounded bg-red-500 px-3 py-1.5 shadow-lg hover:bg-red-700"
            @click="cancelForm">
            <div class="flex items-stretch text-xs font-medium text-white">
              <i class="fas fa-times"></i>
            </div>
            <span class="text-sm font-semibold text-white">Cancel</span>
          </button>
          <button
            class="flex cursor-pointer items-center justify-center gap-1 rounded bg-blue-500 px-3 py-1.5 shadow-lg hover:bg-blue-700"
            @click="submitForm">
            <CircularSpinner v-show="loading" size="sm" theme="border-white" />
            <span v-show="!loading" class="text-sm font-semibold text-white"><i class="fas fa-unlock"></i></span>
            <span class="text-sm font-semibold text-white">Update</span>
          </button>
        </div>
      </div>
      <div v-else class="flex h-[50vh] w-full flex-col items-center justify-center">
        <span class="text-lg font-bold text-blue-500">Updating...</span>
        <CircularSpinner />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { SITE_TENANT, USER_TYPE, USER_ACCESS_LIST } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
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
      form: {
        company: '',
        name: '',
        phone: '',
        type: '',
        tenants: null,
        status: 'active',
        password: undefined,
      },
      errors: {},

      tenants: [
        { id: 1, name: 'Select a tenant', value: null },
        { id: 2, name: 'Banglalink', value: SITE_TENANT.BANGLALINK },
        { id: 3, name: 'Grameenphone', value: SITE_TENANT.GRAMEENPHONE },
        { id: 4, name: 'Robi', value: SITE_TENANT.ROBI },
      ],
      statuses: [
        { id: 1, name: 'Active', value: 'active' },
        { id: 2, name: 'Blocked', value: 'blocked' },
        { id: 3, name: 'Inactive', value: 'inactive' },
      ],
      userOptions: [
        { id: 1, name: 'Employee', value: 'employee' },
        { id: 2, name: 'Superuser', value: 'superuser' },
        { id: 3, name: 'Admin', value: 'sudo' },
        { id: 4, name: 'Ops', value: 'support' },
        { id: 5, name: 'Read Only', value: 'read_only' },
        { id: 6, name: 'NOC', value: 'noc' },
        { id: 7, name: 'Company', value: 'company' },
        { id: 8, name: 'Finance', value: 'finance' },
      ],
      userAccessList: USER_ACCESS_LIST.map((access, i) => ({
        id: i,
        name: access.name,
        value: access.value,
        checked: false,
        public: access.public,
      })),
    }
  },
  computed: {
    ...mapGetters('customer', ['companies']),
    userTypeOptions() {
      let types = this.userOptions
      if (!this.isSudoUser) {
        types = types.filter(
          type => ![USER_TYPE.SUDO, USER_TYPE.SUPPORT, USER_TYPE.SUPERUSER, USER_TYPE.COMPANY].includes(type.value)
        )
      }
      return types
    },
  },
  watch: {
    user(val, old) {
      this.fillupForm()
    },
  },
  mounted() {
    // this.fillupForm()
  },
  methods: {
    show() {
      this.showModal = true
    },
    hide() {
      this.showModal = false
    },
    toggleStatus(access) {
      this.userAccessList[access.id].checked = !this.userAccessList[access.id].checked
    },
    fillupForm() {
      this.loading = true
      const tenants = this._.get(this.user, 'tenants', null)
      const userTenant = tenants ? tenants[0] : null
      let type = this._.get(this.user, 'type', '')
      if (type === USER_TYPE.READ_ONLY && !userTenant) {
        type = 'noc'
      }
      this.form = {
        company: this._.get(this.user, 'company_id', ''),
        name: this._.get(this.user, 'name', ''),
        phone: this._.get(this.user, 'phone', ''),
        type,
        tenants: userTenant,
        status: this._.get(this.user, 'status', 'active'),
      }
      let meta = this._.get(this.user, 'meta', {})
      if (meta && meta.accessRoles) {
        this.userAccessList.forEach(access => access.checked = meta.accessRoles.includes(access.value))
      }

      this.loading = false
    },
    async submitForm() {
      this.errors = {}
      if (this.loading) return
      this.validateForm()
      if (this.userAccessList.filter(access => access.checked).length === 0) {
        this.$toast.error('Please select at least one permission')
        return;
      }
      if (Object.keys(this.errors).length) return
      this.loading = true
      try {
        const data = {
          uid: this.user.uid,
          company_id: this.form.company,
          name: this.form.name,
          phone: this.form.phone,
          type: this.form.type,
          tenants: this.form.tenants,
          status: this.form.status,
          created_at: this.user.created_at,
          password: this.form.password,
          access_roles: this.userAccessList.filter(access => access.checked).map(access => access.value),
        }
        await this.$store.dispatch('user/updateUser', data)
        this.$toast.success('User Updated Successfully')
        this.cancelForm()
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.loading = false
    },
    validateForm() {
      if (!this.form.name) {
        this.errors.name = 'Please enter a name'
      }
      if (!this.form.phone) {
        this.errors.name = 'Please enter a name'
      }
      if (this.form.phone.trim().length !== 11) {
        this.errors.phone = 'Please enter a number with 11 digits'
      }
      if (this.form.type === 'read_only' && !this.form.tenants) {
        this.errors.tenants = 'Please select a tenant'
      }
      if (this.form.type === 'read_only' && this.form.tenants) {
        this.form.tenants = [this.form.tenants]
      }
      if (this.form.type !== 'read_only') {
        this.form.tenants = null
      }
      if (!this.form.status) {
        this.errors.status = 'Please select a user status'
      }
      if (!this.form.company) {
        const loggedInUser = this.$auth.user
        if (!loggedInUser.type === USER_TYPE.SUDO) {
          this.errors.company = 'Please select a company'
        } else {
          this.form.company = loggedInUser.company_id
        }
      }
      if (!this.form.type) {
        this.errors.type = 'Please select a user type'
      }
      if (this.form.type === 'noc') {
        this.form.type = 'read_only'
      }
      if (this.password && this.password.trim().length < 6) {
        this.errors.password = 'Please enter at least 6 characters'
      }
    },
    cancelForm() {
      this.hide()
      this.errors = {}
      //   this.clearForm()
    },
    clearForm() {
      this.form.name = ''
      this.form.phone = ''
      this.form.company = ''
      this.form.tenants = null
      this.form.status = 'active'
      this.form.type = ''
      this.form.password = undefined
    },
  },
}
</script>
