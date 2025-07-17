<template>
  <ContentCard is-flat has-footer title="Telegram Group Information">
    <template #content>
      <div class="md:min-h-auto relative h-full min-h-[60vh] w-full overflow-hidden bg-slate-100">
        <div class="absolute inset-0 flex flex-col space-y-2 bg-slate-100 p-3">
          <div
            name="parent"
            class="flex w-full flex-grow flex-col divide-y-2 overflow-y-scroll scrollbar-hide md:flex-row md:divide-y-0 md:divide-x-2"
          >
            <div class="mx-auto flex max-w-4xl flex-col gap-6 rounded-md border bg-gray-50 p-6 shadow-md">
              <!-- Group Name and Channel ID -->
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <FixedLabelInput v-model="name" label="Group/Channel Name" />
                </div>
                <div>
                  <FixedLabelInput
                    v-if="isSudoUser || isOpsUser || canAccessTelegram"
                    v-model="chatId"
                    label="Group/Channel ID"
                  />
                  <DisbledFixedLabelInput v-else v-model="chatId" label="Group/Channel ID" />
                </div>
              </div>

              <!-- Group Type and Company Selection -->
              <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <span class="block text-xs font-semibold text-gray-700">Type</span>
                  <DropdownMenu
                    v-model="groupType"
                    :flat="true"
                    :placeholder="groupType.label || 'Select Type'"
                    :options="groupTypeOptions"
                  />
                </div>
                <div v-if="isSudoUser || isOpsUser">
                  <span class="block text-xs font-semibold text-gray-700">Company</span>

                  <DropdownMenu
                    v-model="company"
                    :flat="true"
                    :placeholder="company.label || 'Select Company'"
                    :options="companiesWithLabel"
                    @input="onCompanySelect"
                  />
                </div>
              </div>

              <!-- Status -->
              <div class="align-end flex justify-between">
                <div class="flex flex-col items-start">
                  <span class="mb-2 block text-xs font-semibold text-gray-700">Status</span>
                  <ToggleSwitch :status="status" @toggleStatus="toggleStatus" />
                </div>

                <!-- Update Button -->

                <div class="flex justify-end gap-2 pt-4">
                  <button
                    v-if="!group"
                    class="h-fit rounded bg-blue-500 px-4 py-2 text-xs font-medium text-white shadow hover:bg-green-600 focus:outline-none"
                    @click="createGroup"
                  >
                    Create
                  </button>
                  <button
                    v-if="group"
                    class="h-fit rounded bg-blue-500 px-4 py-2 text-xs font-medium text-white shadow hover:bg-blue-600 focus:outline-none"
                    @click="updateGroup"
                  >
                    Update
                  </button>
                  <button
                    v-if="group"
                    class="h-fit rounded bg-red-500 px-4 py-2 text-xs font-medium text-white shadow hover:bg-red-600 focus:outline-none"
                    @click="deleteGroup"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div class="flex-1 bg-white p-2" name="child2">
              <div class="flex flex-col justify-between rounded-md bg-white p-4 shadow-sm">
                <!-- Added Sites and Button Container -->
                <div class="flex flex-col gap-4">
                  <!-- Added Sites -->
                  <div
                    :class="[expanded.addedSiteList ? 'bg-teal-100' : 'bg-teal-50 hover:bg-teal-100']"
                    class="flex cursor-pointer items-center justify-between rounded-md p-3 transition duration-300"
                    @click="showGroupItems('addedSiteList')"
                  >
                    <span class="text-sm font-semibold text-gray-700"> Added Sites [{{ addedSites.length }}] </span>
                    <div
                      :class="[expanded.addedSiteList ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-emerald-300']"
                      class="flex h-8 w-8 items-center justify-center rounded-full text-white transition duration-300"
                    >
                      <i :class="[expanded.addedSiteList ? 'fas fa-chevron-down' : 'fas fa-chevron-right']"></i>
                    </div>
                  </div>

                  <!-- Add Sites Button -->
                  <button
                    :class="[
                      expanded.unaddedSiteList
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white text-cyan-700 hover:bg-cyan-500 hover:text-white',
                    ]"
                    class="flex items-center justify-center gap-2 rounded-md border-2 border-cyan-500 px-4 py-2 transition duration-300"
                    @click="showGroupItems('unaddedSiteList')"
                  >
                    <i :class="[expanded.unaddedSiteList ? 'fas fa-minus' : 'fas fa-plus']"></i>
                    <span class="text-sm font-medium">Add Sites</span>
                  </button>
                </div>
              </div>
              <AccessGroupSiteList v-if="expanded.addedSiteList" :items="addedSites" @remove-site="removeSite" />
              <TelegramUnaddedSiteList
                v-if="expanded.unaddedSiteList"
                :items="unaddedSites"
                :company="getCompanyName()"
                @add-site="addSite"
                @filter-sites="selectAllFunc"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-row items-center justify-between space-x-3 border-t border-slate-200 px-3 py-2">
        <div class="flex gap-4">
          <button
            v-if="group"
            class="rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-blue-600 focus:outline-none"
            @click="navigateToAlarmSettings"
          >
            <i class="fas fa-cog"></i> Permitted Alarm Settings
          </button>
          <div v-if="group" class="flex flex-col items-start">
            <!-- <span class="block mb-2 text-xs font-semibold text-gray-700">Invite Link</span> -->
            <div class="flex items-center gap-4">
              <button
                v-if="isLinkExpired"
                class="rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-blue-600 focus:outline-none"
                @click="renewInviteLink"
              >
                <i class="fas fa-sync"></i> Renew Invite Link
              </button>
              <button
                v-else
                class="rounded bg-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-blue-600 focus:outline-none"
                @click="copyToClipboard"
              >
                <i class="fas fa-link"></i> {{ buttonText }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex space-x-2">
          <button
            v-if="canSave"
            class="z-50 rounded bg-green-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition duration-300 hover:bg-green-600"
            @click="addSiteToGroup"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            Add Site
          </button>
          <button
            v-if="expanded.unaddedSiteList && !canSave"
            class="z-50 rounded bg-green-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition duration-300 hover:bg-green-600"
            @click="() => selectAllFuncHandeler()"
          >
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            Add All Filtered Sites
          </button>
          <button
            class="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow transition duration-300 hover:bg-gray-100"
            @click="cancelForm"
          >
            <i class="fas fa-arrow-left"></i>
            Back
          </button>
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { getCompanyById } from '~/assets/js/Helper'
import { getCompanyByShortName } from '~/assets/js/LegacyHelper'

export default {
  mixins: [UserTypeChecker],

  props: {
    group: {
      type: Object,
      required: false,
      default: () => null,
    },
  },
  data: () => ({
    company: 0,
    name: '',
    chatId: '',
    groupId: 0,
    groupType: 'none',
    buttonText: 'Copy Invite Link',
    siteUids: [],
    saving: false,
    deleting: false,
    canSave: false,
    status: false,
    groupStatus: false,
    search: '',
    area: '',
    cluster: '',
    addedSites: [],
    unaddedSites: [],
    expanded: {
      addedSiteList: true,
      attachedCardGroups: false,
      unaddedSiteList: false,
      unattachedCardGroups: false,
    },
    loading: false,
    acsCardGroups: [],
    unattachedCardGroups: [],
    groupTypeOptions: [
      { id: 1, value: 'GROUP', label: 'GROUP' },
      { id: 2, value: 'CHANNEL', label: 'CHANNEL' },
    ],
    filteredSitesState: [],
  }),
  computed: {
    ...mapGetters('site', ['sites']),
    ...mapGetters('user', ['rootUserUid', 'companyName']),
    ...mapGetters('acs', ['cardGroups', 'cards', 'attachedCardGroups']),
    ...mapGetters('customer', ['companies']),
    ...mapGetters('telegram', ['isLoading']),

    filteredSites() {
      if (this.company) {
        return this.sites.filter(site => site.user_uid === this.company.user_uid)
      }
      return this.sites
    },

    companiesWithLabel() {
      return this.companies.map(c => {
        return { ...c, label: c.name }
      })
    },

    isLinkExpired() {
      return this.isExpired(this.group?.invite_expires)
    },
    inviteLink() {
      return this.group?.invite_link || ''
    },
  },
  watch: {
    group: {
      handler(val, old) {
        if (!val) return
        this.name = val.name || ''
        this.chatId = val.chat_id || ''
        this.groupType = this.groupTypeOptions.find(type => type.value === val.group_type) || ''
        this.company = this.companiesWithLabel.find(company => company.id === val.company_id) || ''
        this.status = val.status === 'ACTIVE' || false
        if (val.sites && val.sites.length) {
          this.siteUids = [...val.sites].map(site => site.site_id)
        }
      },
    },
    siteUids: {
      handler(val, old) {
        this.filterSites()
      },
      immediate: true,
    },

    company: {
      handler(val, old) {
        this.filterSites()
      },
      immediate: true,
    },
  },
  mounted() {
    this.getCompanyList()
    this.filterSites()
  },
  methods: {
    onCompanySelect() {
      this.siteUids = []
      this.filterSites()
    },
    copyToClipboard() {
      navigator.clipboard.writeText(this.inviteLink).then(() => {
        this.buttonText = 'Copied'
        setTimeout(() => {
          this.buttonText = 'Copy Link'
        }, 2000)
      })
    },
    isExpired(date) {
      const now = new Date()
      const expireDate = new Date(date)
      return now > expireDate // Returns true if the current date is past the expiry date
    },
    renewLink() {
      try {
        this.$store.dispatch('telegram/renewInviteLink', { chat_id: this.chatId })
        this.$toast.success('Link Renewed Successfully')
      } catch (error) {
        this.$toast.error(error.message)
      }
    },

    showGroupItems(item) {
      if (!this.group) {
        this.$toast.error('Please Create a group first')
        return
      }

      for (const key in this.expanded) {
        if (key !== item) this.expanded[key] = false
      }
      this.expanded[item] = true
    },
    async updateGroup() {
      if (!this.getPermissionStatus('save')) return
      if (this.saving) return
      try {
        this.validate()
        this.saving = true

        const data = {
          name: this.name,
          status: this.status ? 'ACTIVE' : 'INACTIVE',
          chat_id: this.chatId,
          sites: this.siteUids,
          group_type: this.groupType.value,
          company_id: this.company.id,
        }

        await this.$store.dispatch('telegram/updateTelegramGroup', data)
        this.$router.push('/telegram')
        this.canSave = false
        this.$toast.success('group saved successfully')
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.saving = false
    },
    async createGroup() {
      if (!this.getPermissionStatus('save')) return
      if (this.saving) return
      try {
        this.validate()
        const data = {
          name: this.name,
          status: this.status ? 'ACTIVE' : 'INACTIVE',
          chat_id: this.chatId,
          sites: this.siteUids,
          group_type: this.groupType.value,
          company_id: this.company.id ? this.company.id : getCompanyByShortName(this.companyName),
        }

        await this.$store.dispatch('telegram/createTelegramGroup', data)
        this.$router.push('/telegram')
        this.canSave = false
        this.$toast.success('group created successfully')
      } catch (error) {
        this.$toast.error(error)
      }
    },

    async addSiteToGroup() {
      if (!this.siteUids.length) throw new Error('Choose at least one site')
      const data = {
        chat_id: parseInt(this.chatId), // Convert chat_id to integer before passing it to the action this.chatId,
        sites: this.siteUids,
      }
      try {
        await this.$store.dispatch('telegram/addSiteToGroup', data)
        this.$router.push('/telegram')
      } catch (error) {
        this.$toast.error(error)
      }
    },
    async renewInviteLink() {
      if (!this.group) throw new Error('No group selected')

      const data = {
        chat_id: parseInt(this.chatId), // Convert chat_id to integer before passing it to the action this.chatId,
      }

      try {
        await this.$axios.patch(
          '/telegram/group/update-link',
          {},
          {
            params: data,
          }
        )
        this.$emit('refetchGroup')
        // Copy the invite link to the clipboard
        this.$toast.success('Invite Link Renewed Successfully')
      } catch (error) {
        this.$toast.error(error)
      }
    },

    cancelForm() {
      this.$store.dispatch('telegram/clearTelegramFocusGroup')

      this.$router.push('/telegram')
    },
    toggleStatus(status) {
      this.status = status
    },

    async getCompanyList() {
      await this.$store.dispatch('customer/getCompanyList')
    },

    validate() {
      if (!this.name) throw new Error('Please type a name for the group')

      if (!this.chatId) throw new Error('Please type a chat id')
      if (!this.groupType) throw new Error('Please select a group type')
      return true
    },

    async onDeleteClick() {
      if (!this.getPermissionStatus('delete')) return
      if (this.attachedCardGroups.length) {
        this.$toast.error('Please remove Attached Card Groups first!')
        return
      }
      if (!confirm('Are you sure you want to delete this group ?')) return

      this.deleting = true
      try {
        await this.$store.dispatch('acs/deleteSiteGroup', this.groupId)

        this.$toast.success('Site group deleted successfully')
        this.$router.push('/access/manage')
      } catch (error) {
        this.$toast.erro(error.message)
      }
      this.deleting = false
    },

    filterSites() {
      this.addedSites = this.filteredSites.filter(site => this.siteUids.includes(site.uid))
      this.unaddedSites = this.filteredSites.filter(site => !this.siteUids.includes(site.uid))
    },

    addSite(siteIdToAdd) {
      this.canSave = true
      this.unaddedSites = this.unaddedSites.filter(site => site.uid !== siteIdToAdd)
      this.addedSites.unshift(this.filteredSites.find(site => site.uid === siteIdToAdd))
      this.siteUids.push(siteIdToAdd)
      // this.handleUnaddedCardsSearch(this.unaddedCardsSearch)
    },
    async removeSite(siteIdToRemove) {
      if (this.group) {
        if (!confirm(`Are you sure you want to remove this site from "${this.group.name}"?`)) return
        const data = {
          chat_id: this.chatId,
          site_id: siteIdToRemove,
        }
        await this.$store.dispatch('telegram/removeSiteFromGroup', data)
      }
      this.addedSites = this.addedSites.filter(site => site.uid !== siteIdToRemove)
      this.unaddedSites.unshift(this.filteredSites.find(item => item.uid === siteIdToRemove))
      this.siteUids = this.siteUids.filter(item => item !== siteIdToRemove)
    },

    async deleteGroup() {
      if (!this.group) return
      if (!confirm('Are you sure you want to delete this group ?')) return
      try {
        await this.$store.dispatch('telegram/deleteGroup', this.group.chat_id)
        this.$router.push('/telegram')
        this.$toast.success('Group deleted successfully')
      } catch (error) {
        this.$toast.error(error.message)
      }
    },
    navigateToAlarmSettings() {
      this.$router.push(`/telegram/alarm-settings?chatId=${this.group.chat_id}`)
    },
    getCompanyName() {
      return getCompanyById(this.company.id)
    },
    async selectAllFuncHandeler() {
      if (this.filteredSitesState.length) {
        this.filteredSitesState.map(item => this.addSite(item.uid))
      }
      await this.addSiteToGroup()
    },
    selectAllFunc(data) {
      this.filteredSitesState = data
    },
  },
}
</script>

<style lang="scss" scoped></style>
