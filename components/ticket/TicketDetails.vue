<template>
  <div class="mt-4 flex w-full items-center justify-center">
    <div class="grid w-11/12 grid-cols-12 md:w-9/12">
      <div name="title" class="bg-white-100 col-span-12 border-b-2 md:col-span-12">
        <div class="flex items-center justify-between py-2">
          <div class="flex items-center gap-2">
            <button class="" @click="cancelForm">
              <i class="fas fa-arrow-left text-lg"></i>
            </button>
            <span class="ml-2 font-semibold">{{ ticket.title }} </span>
            <div :class="statusTheme" class="mr-2 rounded-2xl border px-4 py-1 text-xs font-semibold">
              <span>{{ statusLabel }}</span>
            </div>
          </div>
          <span>{{ 'TicketID ' + ticket.token }}</span>
        </div>
      </div>
      <div name="left" class="border-l-1 col-span-12 flex flex-col gap-5 bg-slate-50 md:col-span-3">
        <div class="flex flex-col gap-5 p-4">
          <div class="flex flex-col">
            <span class="font-semibold">Ticket Info</span>
            <div class="flex gap-1"><span class="text-xs font-semibold leading-tight text-gray-700">Created at  </span>
            
            <span class="text-xs font-normal leading-tight text-gray-700">{{ createdAt }}</span>
            </div>
            <div class="flex gap-1"><span class="text-xs font-semibold leading-tight text-gray-700">Created by  </span>
            
            <span class="text-xs font-normal leading-tight text-gray-700">{{ getOpened(ticket.opened_by)  }}</span>
            </div>
            
          </div>

          <div class="flex flex-col gap-5">
            <div class="flex items-center gap-1.5">
              <i class="far fa-star"></i>
              <span>Status :</span>
              <div class="md:w-35 w-40 hover:cursor-pointer">
                <DropdownMenu v-model="status" :options="statusOptions" :placeholder="status.label" />
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="fas fa-bolt"></i>
              <span>Priority :</span>
              <span class="hover:cursor-pointer">
                <div class="md:w-35 w-40 hover:cursor-pointer">
                  <DropdownMenu
                    v-model="priority"
                    :options="priorityOptions"
                    :placeholder="priority.label || 'Select priority'"
                  /></div
              ></span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-1.5 p-4">
          <span class="font-semibold">Site Info</span>
          <div class="flex items-center gap-2">
            <span>Site Name :</span>
            <span>{{ siteName }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-4 p-4">
          <span class="font-semibold">Responsible</span>
          <div class="md:w-35 h-10 w-60 hover:cursor-pointer">
            <DropdownMenu
           
              list-height="max-h-[20vh]"
              :options="assignedAllTeamType"
              :reset="isItemChanged"
           :placeholder="'M.P.L'"
            />
          </div>
        </div>
        <div name="footer" class="border-t-1 col-span-12 flex justify-end gap-2 p-4 md:col-span-12">
          <button
            class="rounded bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600"
            @click="onSaveClick"
          >
            <i v-if="loading" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            Update
          </button>
        </div>
      </div>
      <div name="body" class="bg-white-100 col-span-12 md:col-span-6">
        <div class="flex flex-col gap-1 p-3">
          <div class="font-semibold">Description</div>

          <div
            class="min-h-64 text-wrap flex max-h-64 flex-wrap overflow-scroll break-words bg-slate-50 p-3 scrollbar-hide"
          >
            <span class="text-wrap whitespace-normal break-words">
              {{ ticket.description }}
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-1 p-3">
          <div class="font-semibold">History</div>

          <div class="min-h-32 flex max-h-32 flex-col gap-2 overflow-scroll bg-slate-50 p-3 shadow scrollbar-hide">
            <span v-for="(h, i) in statusHistory" :key="i"
            class="flex gap-1"
              >
              <span :class="getStatusTextColour(h.description)">{{stringStartCase(h.description)}}</span>
              <span class="">{{ 'at ' + formatedDate(h.time) }}</span>
              
            </span>
          </div>
        </div>
      </div>
      <div name="right" class="border-l-1 col-span-12 flex flex-col bg-slate-50 md:col-span-3">
        <div class="flex items-center gap-1 px-4 py-2">
          <i class="fas fa-comments"></i>
          <span class="font-semibold">{{ `Comments(${userComments.length})` }}</span>
        </div>
        <div class="flex h-full flex-col justify-between rounded-md bg-gray-100 px-4 py-2">
          <div
            ref="commentContainer"
            class="flex h-[50vh] flex-col gap-2 overflow-hidden overflow-y-scroll scrollbar-hide"
          >
            <div v-for="(c, i) in userComments" :key="i" class="rounded-md bg-white px-4 pb-2 pt-4">
              <div class="mb-2 flex items-center">
                <img src="/icon/employee.png" class="mr-2 h-8 w-8 rounded-full" alt="Avatar" />
                <div class="flex flex-col items-start justify-center">
                  <span class="text-xs font-semibold text-gray-800">{{ getCommentsAuthor(c.who) }}</span>
                  <span class="text-xs font-normal text-gray-400">{{ formatedDate(c.time) }}</span>
                </div>
              </div>
              <div class="">
                <p class="text-balance text-gray-700">{{ c.description }}</p>
              </div>
            </div>
          </div>
          <div class="mt-4 flex gap-1">
            <input
              v-model="comments"
              class="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a comment"
            />
            <button
              class="inline-flex items-center rounded p-2 font-bold"
              :disabled="comments.trim().length === 0"
              @click="addComments"
            >
              <i class="fas fa-paper-plane text-xl text-blue-500 hover:text-blue-700"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import { getStatusLabel,getStatusTheme} from '~/assets/js/TicketHelper'
export default {
  middleware: ['auth', 'setup', 'ticket'],
  props: {
    ticket: {
      type: Object,
      required: false,
      default: () => null,
    },
  },
  data() {
    return {
      loading: false,
      status: '',
      priority: '',
      comments: '',
      assignedTo: '',
      isItemChanged: true,
      statusOptions: [
        { id: 1, label: 'Open', value: 'open' },
        { id: 6, label: 'Investigating', value: 'investigating' },
        { id: 2, label: 'Waiting-for-info', value: 'wfi' },
        { id: 3, label: 'Resolved', value: 'resolved' },
        { id: 4, label: 'Closed', value: 'closed' },
        { id: 5, label: 'Reopen', value: 'reopen' },
        
        
      ],
      priorityOptions: [
        { id: 1, label: 'High', value: 'high' },
        { id: 2, label: 'Medium', value: 'medium' },
        { id: 3, label: 'Low', value: 'low' },
      ],
      assignedAllTeamType: [
      { id: 1, label: 'M.P.L', Value: 'mpl' },
      { id: 1, label: 'O.Q.M', Value: 'oqm' },
      { id: 1, label: 'M.Q.C', Value: 'mqc' },
      { id: 1, label: 'HSL HW', Value: 'hsl_hw' },
      { id: 1, label: 'HSL SW', Value: 'hsl_sw' },
    ],
      ticketId: null,
      assignTeamList: [],
    }
  },
  computed: {
    ...mapGetters('site', ['siteUid2Name']),
    ...mapGetters('user', ['rootUserUid', 'users', 'accessUsers']),
    siteName() {
      return this.siteUid2Name[this.ticket.site_uid] || 'N/A'
    },
    createdAt() {
      return format(new Date(this.ticket.created_at), 'h:mm aaa, d MMM yyyy')
    },
    currentUserId() {
      return this.$auth.user.uid
    },
    statusHistory() {
      return this.ticket.meta_data.history.slice().reverse()
    },
    userComments() {
      return this.ticket.meta_data.comment.slice().reverse()
    },
    statusLabel() {
      return getStatusLabel(this.ticket.status)
    },
    statusTheme() {
      return getStatusTheme(this.ticket.status)
    },
    assignedUser() {
      const user = this.accessUsers.items.find(u => u.uid === this.ticket.assigned_to)
      return user?.name || 'N/A'
    },
  },
  watch: {
    ticket(val, old) {
      this.ticketUpdateDone()
    },
  },
  mounted() {
    this.commentscrollToBottom()
    this.setAssignedTeamList()
    this.status = this.statusOptions.find(s => s.value === this.ticket.status)
    this.priority = this.priorityOptions.find(p => p.value === this.ticket.priority)
    this.assignedTo = this.assignTeamList.find(p => p.value === this.ticket.assigned_to) || { id: 0, label: 'N/A', value: '000' };
  },

  methods: {
    cancelForm() {
      this.$router.push('/ticket')
    },
    validateUpdateInfo() {
      if (this.status.value === 'open') {
        this.$toast.error('Invalid ticket status')
        return false
      }

      if (
        this.status &&
        this.ticket.status === this.status.value &&
        this.priority &&
        this.ticket.priority === this.priority.value
      ) {
        return false
      }
      if (this.status.value === 'closed' && this.ticket.opened_by !== this.currentUserId) {
        this.$toast.error('You do not have the necessary permissions to close this ticket.')
        return false
      }

      if (this.status.value !== 'reopen' && this.ticket.status === 'closed') {
        this.$toast.error('Ticket is closed. Need to reopen')
        return false
      }
      if (this.status.value === 'reopen' && this.ticket.status !== 'closed') {
        this.$toast.error("Can't reopen. Need to close first")
        return false
      }

      return true
    },

    async onSaveClick() {
      this.loading = true

      if (!this.validateUpdateInfo()) {
        this.loading = false
        return
      }

      const updatedData = {
        id: this.ticket.id,
        meta_data: { ...this.ticket.meta_data },
        updated_by: this.currentUserId,
      
      }
      if (this.status && this.ticket.status !== this.status.value) {
        updatedData.status = this.status.value
        const metaData = { ...this.ticket.meta_data }
        let history = metaData.history

        history = [
          {
            description: updatedData.status,
            time: new Date(),
            who: this.currentUserId,
          },
          ...metaData.history,
        ]

        updatedData.meta_data.history = [...history]
      }
      if (this.priority && this.ticket.priority !== this.priority.value) {
        updatedData.priority = this.priority.value
      }

      try {
        await this.$store.dispatch('ticket/updateTicket', updatedData)
        this.$toast.success('Ticket updated!')
        this.loading = false
      } catch (error) {
        this.$toast.error('Error updating ticket')
      }
      this.loading = false
    },
    formatedDate(date) {
      return format(new Date(date), 'd MMM yyyy,h:mm a')
    },
    ticketUpdateDone() {
      this.status = this.statusOptions.find(s => s.value === this.ticket.status)
      this.priority = this.priorityOptions.find(p => p.value === this.ticket.priority)
      this.assignedTo = this.assignTeamList.find(p => p.value === this.ticket.assigned_to)
    },
    stringStartCase(str) {
      return this._.startCase(str)
    },

    getOpened(id) {
      const allusers = [...this.users]
      const openedBy = allusers.find(u => u.uid === id)
      return openedBy.name || 'Unknown'
    },
    setAssignedTeamList() {
      const list = this.accessUsers.items.map(s => {
        return { id: s.uid, label: s.name.toUpperCase(), value: s.uid }
      })
      this.assignTeamList = list
    },
    getCommentsAuthor(uid) {
      let user = this.users.find(u => u.uid === uid)

      if (user) {
        return user?.name || 'N/A'
      }

      user = this.accessUsers.items.find(u => u.uid === uid)
      return user?.name || 'N/A'
    },

    async addComments() {
      const updatedCommentsData = {
        id: this.ticket.id,
        meta_data: { ...this.ticket.meta_data },
        updated_by: this.currentUserId,
      }

      if (this.comments) {
        const metaData = { ...this.ticket.meta_data }
        let comments = metaData.comment

        comments = [
          {
            description: this.comments,
            time: new Date(),
            who: this.currentUserId,
          },
          ...comments,
        ]
        updatedCommentsData.meta_data.comment = [...comments]
        this.comments = ''
      }

      try {
        await this.$store.dispatch('ticket/updateTicket', updatedCommentsData)
      } catch (error) {
        this.$toast.error('Error updating ticket')
      }
    },

    commentscrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.commentContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },

    getStatusTextColour(status){
      const statusTheme = {
    open: 'text-red-400',
    wfi: 'text-orange-400',
    resolved: 'text-indigo-400',
    closed: 'text-green-400',
    reopen: 'text-rose-400',
    investigating: 'text-blue-400',
  }
  return statusTheme[status] || 'text-grey-400'

    }


   
  },
}
</script>

<style lang="scss" scoped></style>
