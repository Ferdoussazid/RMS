<template>
  <div class="flex w-full flex-col gap-2">
    <AppToolbar title="Create Ticket" :with-site-id="false" />
    <div class="flex min-h-[80vh] w-full flex-col items-center rounded bg-slate-100 p-4">
      <div class="flex w-full flex-col items-start justify-center gap-4 md:w-3/4 lg:w-5/12">
        <span class="mx-0 w-full text-base font-semibold lg:mx-auto">Create New Ticket</span>
        <div class="mx-0 grid w-full grid-cols-12 gap-4 lg:mx-auto">
          <FixedLabelInput
            v-model="ticket.title"
            label="Ticket Title"
            required
            autocomplete="off"
            placeholder="Ex: Pg not working"
            class="col-span-12 md:col-span-8"
          />

          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4">
            <span class="text-xs font-medium text-gray-700">Priority</span>
            <select
              v-model="ticket.priority"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm"
              placeholder="Select Priority"
            >
              <option
                v-for="(p, i) in priorityOptions"
                :key="i"
                :value="p.Value"
                :selected="p.id == 2"
                class="text-sm text-gray-800"
              >
                {{ p.label }}
              </option>
            </select>
          </div>
        </div>
        <div class="grid w-full grid-cols-12 gap-4">
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-12">
            <span class="text-xs font-medium text-gray-700">Description</span>

            <textarea v-model="ticket.description" class="w-full rounded-md border px-3 py-2" rows="5"></textarea>
          </div>
        </div>
        <div class="grid w-full grid-cols-12 gap-4">
          <div class="col-span-6 flex grow flex-col items-start space-y-1">
            <span class="text-xs font-medium text-gray-700">Ticket category</span>
            <select
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm"
              v-model="ticket.category"
            >
              <option value="" disabled selected class="text-sm text-gray-800">Select Ticket type</option>
              <option v-for="(t, i) in ticketType" :key="i" :value="t.Value" class="text-sm text-gray-800">
                {{ t.label }}
              </option>
            </select>
          </div>
          <div class="col-span-6 flex grow flex-col items-start space-y-1">
            <span class="text-xs font-medium text-gray-700">Sub category</span>
            <select
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm"
              v-model="ticket.sub_category"
            >
            <option value="" disabled selected class="text-sm text-gray-800">Select Sub category</option>
            <option v-for="(t, i) in ticketFilteredSubCategory" :key="i" :value="t.Value" class="text-sm text-gray-800">
              {{ t.label }}
            </option>
            </select>
          </div>
        </div>
        <div class="flex w-full flex-col items-start space-y-1">
          <span class="text-xs font-medium text-gray-700">Select Site</span>
          <FilterSiteSelect @select="onSiteSelect" />
        </div>

        <div class="grid w-full grid-cols-12 gap-4">
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4">
            <span class="text-xs font-medium text-gray-700">Assigned Team</span>
            <select
              v-model="selectedTeamType"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm"
            >
              <option value="" disabled selected>Select a Team</option>
              <option v-for="(t, i) in assignedAllTeamType" :key="i" :value="t" class="text-sm text-gray-800">
                {{ t.label }}
              </option>
            </select>
          </div>
          <!-- <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4">
            <span class="text-xs font-medium text-gray-700">Assign To</span>
            <select
              v-model="ticket.assigned_to"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm"
            >
              <option value="" disabled selected>Select a Person</option>
              <option v-for="(t, i) in teamList" :key="i" :value="t.uid" class="text-sm text-gray-800">
                {{ t.name.toUpperCase() }}
              </option>
            </select>
          </div> -->
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4">
            <span class="text-xs font-medium text-gray-700">Opened By</span>
            <select
              v-model="ticket.opened_by"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm shadow-sm"
            >
              <option
                v-for="(o, i) in openedByOptions"
                :key="i"
                :value="o.uid"
                class="text-sm text-gray-800"
                :selected="o.uid === currentUserUid"
              >
                {{ o.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex flex-row items-center gap-x-4">
          <button
            class="rounded bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600"
            @click="submitForm"
          >
            <i class="fas fa-check"></i>
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
export default {
  middleware: ['auth', 'setup'],
  data: () => ({
    errors: {},
    ticket: {
      title: '',
      description: '',
      category: '',
      sub_category: '',
      site_uid: null,
      company_uid: null,
      opened_by: null,
      assigned_to: '000',
      status: 'open',
      priority: 'high',
      files: [],
      meta_data: {
        comment: [],
        history: [],
      },
    },
    priorityOptions: [
      { id: 1, label: 'High', Value: 'high' },
      { id: 2, label: 'Medium', Value: 'medium' },
      { id: 3, label: 'Low', Value: 'low' },
    ],
    ticketType:[
      { id: 1, label: 'Ac Module', Value: 'ac_module' },
      { id: 2, label: 'DC Module', Value: 'dc_module' },
      { id: 3, label: 'Power', Value: 'power' },
      { id: 4, label: 'DG-PG', Value: 'dg-pg' },
      { id: 5, label: 'Software', Value: 'software' },
    ],
    ticketAllSubCategoryOptions:[
      { id: 1, label: 'Ac Phase Missing', Value: 'ac_phase_missing',parent:'ac_module'},
      { id: 2, label: 'Mains Fail', Value: 'mains_fail',parent:'ac_module' },
      { id: 3, label: 'Dc Low', Value: 'ac_module',parent:'dc_module' },
      { id: 4, label: 'Site Down', Value: 'site_down',parent:'dc_module' },
      { id: 5, label: 'Over Load', Value: 'over_load',parent:'power' },
      { id: 6, label: 'No Load', Value: 'no_load',parent:'power' },
      { id: 7, label: 'DG-PG RUN', Value: 'dg-pG_run',parent:'dg-pg' },
      { id: 8, label: 'Reporting', Value: 'reporting',parent:'software' },
      { id: 9, label: 'Monitoring', Value: 'monitoring',parent:'software' },
      
    ],
    ticketFilteredSubCategory:[],

    openedBy: [],
    assignedAllTeamType: [
      { id: 1, label: 'M.P.L', Value: 'mpl' },
      { id: 1, label: 'O.Q.M', Value: 'oqm' },
      { id: 1, label: 'M.Q.C', Value: 'mqc' },
      { id: 1, label: 'HSL HW', Value: 'hsl_hw' },
      { id: 1, label: 'HSL SW', Value: 'hsl_sw' },
    ],
    selectedTeamType: '',
    teamList: [],
  }),
  computed: {
    ...mapGetters('site', ['sites']),
    ...mapGetters('user', ['users']),
    ...mapGetters('user', ['rootUserUid', 'users', 'accessUsers']),

    currentUserUid() {
      return this.$auth.user.uid
    },
    companyid() {
      return this.$auth.user.company_id
    },
    openedByOptions() {
      const allusers = [...this.users]
      const filteredUsers = allusers
        .filter(u => u.company_id === this.$auth.user.company_id)
        .map(u => {
          return {
            uid: u.uid,
            name: u.name,
            type: u.type,
          }
        })

      return filteredUsers
    },
  },
  watch: {
    selectedTeamType(val, old) {
      this.setTeamList()
    },
    'ticket.category'(val,old){
      this.setSunCategory()

    }
  },
  mounted() {
    this.ticket.company_uid = this.$auth.user.company_id
    this.getAlluser()
    this.getAccessUsers()
    //this.setAssignedTeamType()
    this.ticket.opened_by = this.currentUserUid
    // this.setCurrentUser()
  },
  methods: {
    cancelForm() {
      this.$router.push('/ticket')
    },
    async submitForm() {
      this.errors = {}
      this.validateForm()
      if (Object.keys(this.errors).length) {
        this.$toast.error('Invalid Ticket Details')
        return
      }

      this.ticket.meta_data.history = [
        {
          description: 'open',
          time: new Date(),
          who: this.currentUserUid,
        },
      ]
      this.ticket.company_uid = this.rootUserUid
      await this.$store.dispatch('ticket/createTicket', this.ticket)
      this.cancelForm()
    },
    onSiteSelect(site) {
      this.ticket.site_uid = site.uid
    },
    setCurrentUser() {
      const currentUser = this.$auth.user

      const user = {}
      user.id = currentUser.uid
      user.name = currentUser.name
      this.ticket.opened_by = this.currentUserUid
      this.openedBy.push(user)
    },

    validateForm() {
      if (!this.ticket.title) {
        this.errors.title = 'Please enter a Tittle'
      }
      if (!this.ticket.description) {
        this.errors.description = 'Please enter a Description'
      }
      if (!this.ticket.site_uid) {
        this.errors.site_uid = 'Please Select a Site'
      }
      if (!this.ticket.category) {
        this.errors.site_uid = 'Please Select a  Ticket Category'
      }
      if (!this.ticket.sub_category) {
        this.errors.site_uid = 'Please Select a Sub category'
      }
      if (!this.ticket.assigned_to) {
        this.errors.site_uid = 'Please Select a team'
      }
    },
    async getAlluser() {
      if (!this.users.length) {
        await this.$store.dispatch('user/getUserList')
      }
    },
    async getAccessUsers() {
      if (!this.accessUsers.total) {
        await this.$store.dispatch('user/getAccessUserList')
      }
    },

    setAssignedTeamType() {
      if (this.accessUsers.total > 0) {
        const items = this.accessUsers.items
          .filter(u => u.company_id === this.companyid)
          .map(s => this._.get(s, 'type', ''))
        this.assignedAllTeamType = this._.uniq(items)
      }
    },

    setTeamList() {
      const items = this.accessUsers.items
        .filter(u => u.company_id === this.companyid)
        .filter(s => s.type === this.selectedTeamType)
      this.teamList = items
    },

    setSunCategory(){
      if(this.ticket.category){
        this.ticketFilteredSubCategory=this.ticketAllSubCategoryOptions.filter(c=>c.parent===this.ticket.category)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
