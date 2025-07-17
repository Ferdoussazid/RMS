<template>
  <div class="flex flex-col gap-2">
    <AppToolbar title="RMS User List" :with-site-id="false" />
    <div class="flex w-full flex-col items-center justify-between gap-2 rounded bg-white p-2 md:flex-row">
      <div class="grid grid-cols-12 gap-2">
        <DropdownMenu
          v-if="isSudoUser"
          v-model="company"
          :options="companiesWithLabel"
          placeholder="Select a Company"
          class="col-span-12 md:col-span-6"
        />
        <SearchInputField v-model="search" hint="Search Phone" class="col-span-12 md:col-span-6" />
      </div>

      <div
        class="cursor-pointer rounded bg-sky-600 px-6 py-2 text-xs font-semibold text-white shadow hover:bg-sky-800"
        @click="onUserCreate"
      >
        <i class="fas fa-plus"></i>
        New User
      </div>
    </div>
    <div class="min-h-[70vh] gap-2 bg-white">
      <div v-if="loading" class="flex h-full items-center justify-center text-center">
        <CircularSpinner size="lg" />
      </div>
      <div
        v-if="!loading && paginatedUsers.length === 0"
        class="m-auto flex h-full flex-col items-center justify-center space-y-6"
      >
        <img src="/icon/empty.png" alt="" class="h-auto w-16" />
        <span class="text-sm font-light text-gray-500">No User Found</span>
      </div>
      <div
        v-if="!loading && paginatedUsers.length"
        class="relative m-auto flex h-[70vh] w-full flex-col overflow-auto rounded bg-white shadow"
      >
        <table class="whitespace-no-wrap table-striped relative w-full table-auto border-collapse">
          <UserListHeader />
          <tbody>
            <UserListItem
              v-for="(user, i) in paginatedUsers"
              :key="user.uid"
              :serial="getSerial(i)"
              :class="i % 2 === 0 ? 'bg-white' : 'bg-slate-100'"
              :user="user"
              @edit="onUserUpdate"
              @delete="onUserDelete"
            />
          </tbody>
        </table>
      </div>
      <UserCreationForm ref="create" />
      <UserDeletionForm ref="delete" :user="focusedUser" />
      <UserUpdateForm ref="update" :user="focusedUser" />
    </div>
    <div class="flex w-full justify-center">
      <el-pagination
        v-if="!loading"
        background
        :hide-on-single-page="showPagination"
        :current-page.sync="currentPage"
        :page-size="perPage"
        :pager-count="7"
        layout="prev, pager, next"
        :total="configurableUsers.total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import fuzzysearch from 'fuzzysearch'
import PaginatedList from '~/mixins/PaginatedList'
import { USER_TYPE } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [PaginatedList, UserTypeChecker],
  middleware: ['auth'],
  data: () => ({
    search: '',
    searching: false,
    company: '',
    loading: true,
    focusedUser: null,
  }),

  computed: {
    ...mapGetters('user', ['tokenExpired', 'users']),
    ...mapGetters('customer', ['companies']),

    companiesWithLabel() {
      const allCompanyItem = { id: null, name: 'All Users' }
      const companies = [allCompanyItem, ...this.companies]
      return companies.map(c => {
        return { ...c, label: c.name }
      })
    },
    configurableUsers() {
      let filteredUsers = [...this.users]
      const loggedInUser = this.$auth.user
      if (loggedInUser.type !== USER_TYPE.SUDO) {
        filteredUsers = filteredUsers.filter(user => user.company_id === loggedInUser.company_id)
      }
      if (this.company) {
        filteredUsers = filteredUsers.filter(user => (this.company.id ? user.company_id === this.company.id : true))
      }
      if (this.search) {
        const searchQuery = this.search.trim()
        filteredUsers = filteredUsers.filter(s => {
          const phoneMatched = fuzzysearch(searchQuery, s.phone.trim())
          return phoneMatched
        })
      }
      return { total: filteredUsers.length, items: filteredUsers }
    },
    paginatedUsers() {
      return this.configurableUsers.items.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage)
    },
  },

  watch: {
    configurableUsers(val, old) {
      this.setPagination()
    },
  },

  mounted() {
    this.currentPage = 1
    this.$store.dispatch('customer/getCompanyList')
    if (!this.users.length) {
      this.$store.dispatch('user/getUserList')
    }
    this.setPagination()
    this.loading = false
  },

  methods: {
    setPagination() {
      this.pageCount = Math.ceil(this.configurableUsers.total / this.perPage)
      this.showPaginate(this.configurableUsers)
    },

    handleCurrentChange(val) {
      this.currentPage = val
    },
    onUserCreate() {
      this.$refs.create.show()
    },
    onUserDelete(user) {
      if (!this.isSudoUser) {
        this.$toast.error("You don't have the necessary permission to delete a user")
        return
      }
      this.focusedUser = user
      this.$refs.delete.show()
    },
    onUserUpdate(user) {
      if (!this.checkPermission(user)) {
        this.$toast.error("You don't have the necessary permission to update a user of this type")
        return
      }
      this.focusedUser = user
      this.$refs.update.show()
    },
    checkPermission(user) {
      if (!this.isSudoUser && [USER_TYPE.COMPANY, USER_TYPE.SUPERUSER].includes(user.type)) {
        return false
      }
      return true
    },
  },
}
</script>

<style lang="scss" scoped></style>
