<template>
  <ContentCard is-flat has-footer title="Site Group Information">
    <template #content>
      <div class="md:min-h-auto relative h-full min-h-[60vh] w-full overflow-hidden bg-slate-100">
        <div class="absolute inset-0 flex flex-col space-y-2 bg-slate-100 p-3">
          <FixedLabelInput v-model="name" label="Group Name" />
          <div name="parent"
            class="flex w-full flex-grow flex-col divide-y-2 overflow-y-scroll scrollbar-hide md:flex-row md:divide-y-0 md:divide-x-2">
            <div class="flex flex-1 flex-col justify-between bg-white p-2" name="child1 ">
              <div class="flex flex-col">
                <div class="group flex cursor-pointer flex-row items-center justify-between p-2"
                  :class="[expanded.addedSiteList ? 'bg-teal-100' : 'bg-teal-50 hover:bg-teal-100']"
                  @click="showGroupItems('addedSiteList')">
                  <span class="p-2 text-xs font-semibold text-gray-700">Added Sites [{{ addedSites.length }}]</span>

                  <div :class="[expanded.addedSiteList ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-emerald-300']"
                    class="mr-4 flex h-6 w-6 items-center justify-center rounded-full text-white transition duration-300">
                    <span class="text-xs font-semibold">
                      <i class="fas fa-chevron-right"></i>
                    </span>
                  </div>
                </div>
                <div v-if="group" class="group flex cursor-pointer flex-row items-center justify-between p-2"
                  :class="[expanded.attachedCardGroups ? 'bg-cyan-100' : 'bg-cyan-50 hover:bg-cyan-100']"
                  @click="showGroupItems('attachedCardGroups')">
                  <span class="p-2 text-xs font-semibold text-gray-700">Attached Card Group [{{ acsCardGroups.length
                    }}]</span>

                  <div :class="[
                    expanded.attachedCardGroups ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-emerald-300',
                  ]"
                    class="mr-4 flex h-6 w-6 items-center justify-center rounded-full text-white transition duration-300">
                    <span class="text-xs font-semibold">
                      <i class="fas fa-chevron-right"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex w-full flex-col items-center justify-center gap-2">
                <button :class="[expanded.unaddedSiteList ? 'bg-cyan-500' : 'bg-white hover:bg-cyan-500']"
                  class="group w-1/2 rounded border-2 border-cyan-500 px-4 py-2"
                  @click="showGroupItems('unaddedSiteList')">
                  <span class="text-sm font-medium"
                    :class="[expanded.unaddedSiteList ? 'text-white' : 'text-cyan-700 group-hover:text-white']"><i
                      :class="[expanded.unaddedSiteList ? 'fa-minus' : 'fa-plus']" class="fas"></i>
                    Add Sites
                  </span>
                </button>
                <button v-if="group"
                  :class="[expanded.unattachedCardGroups ? 'bg-sky-500' : 'bg-white hover:bg-sky-500']"
                  class="group w-1/2 rounded border-2 border-sky-500 px-4 py-2"
                  @click="showGroupItems('unattachedCardGroups')">
                  <span class="text-sm font-medium"
                    :class="[expanded.unattachedCardGroups ? 'text-white' : 'text-sky-700  group-hover:text-white']"><i
                      :class="[expanded.unattachedCardGroups ? 'fa-minus' : 'fa-plus']" class="fas"></i> Attach Card
                    Group</span>
                </button>
              </div>
            </div>

            <div class="flex-1 bg-white p-2" name="child2">
              <AccessGroupSiteList v-if="expanded.addedSiteList" :items="addedSites" @remove-site="removeSite"
                @save="onSaveClick" />
              <AttachedCardGroupList v-if="expanded.attachedCardGroups" :items="acsCardGroups"
                @remove-card-group="removeAttachedCardGroup" />
              <UnaddedSiteList v-if="expanded.unaddedSiteList" :items="unaddedSites" @add-site="addSite" />
              <UnattachedCardGroupList v-if="expanded.unattachedCardGroups" :items="unattachedCardGroups"
                @add-card-group="assignCardGroup" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-row items-center justify-between space-x-3 border-t border-slate-200 px-3 py-2">
        <div v-if="isSuperUser || isOpsUser">
          <button v-if="!!groupId"
            class="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white shadow transition duration-300 hover:bg-red-600"
            @click="onDeleteClick">
            <i v-if="deleting" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-trash"></i>
            Delete
          </button>
        </div>

        <div class="flex space-x-2">
          <button v-if="canSaveSites"
            class="z-50 rounded bg-green-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition duration-300 hover:bg-green-600"
            @click="onSaveClick">
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            Save
          </button>
          <button
            class="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow transition duration-300 hover:bg-gray-100"
            @click="$router.push('/access/manage')">
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

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
    groupId: 0,
    name: '',
    siteUids: [],
    saving: false,
    deleting: false,
    canSaveSites: false,
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
    acsCardGroups: [],
    unattachedCardGroups: [],
  }),
  computed: {
    ...mapGetters('site', ['sites']),
    ...mapGetters('user', ['rootUserUid']),
    ...mapGetters('acs', ['cardGroups', 'cards', 'attachedCardGroups']),
  },
  watch: {
    group: {
      handler(val, old) {
        if (!val) return
        this.groupId = val.id
        this.name = val.name
        if (val.site_uids && val.site_uids.length) {
          this.siteUids = [...val.site_uids]
        }
      },
      immediate: true,
    },
    siteUids: {
      handler(val, old) {
        this.filterSites()
      },
      immediate: true,
    },
  },
  async mounted() {
    this.filterSites()
    await this.fetchAttachedCardGroups()
    this.getcardgroup()
  },
  methods: {
    showGroupItems(item) {
      for (const key in this.expanded) {
        if (key !== item) this.expanded[key] = false
      }
      this.expanded[item] = true
    },
    async onSaveClick() {
      if (!this.getPermissionStatus('save')) return
      if (this.saving) return
      try {
        this.validate()
        this.saving = true
        const data = {
          userUid: this.rootUserUid,
          name: this.name,
          siteUids: this.siteUids,
        }
        if (this.groupId) data.groupId = this.groupId

        await this.$store.dispatch('acs/saveSiteGroup', data)
        this.canSaveSites = false
        this.$toast.success('Site group saved successfully')

        this.$router.push('/access/manage')
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.saving = false
    },

    validate() {
      if (!this.name) throw new Error('Please type a name for the group')
      if (!this.siteUids.length) throw new Error('Choose at least one site')
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
      this.addedSites = this.sites.filter(site => this.siteUids.includes(site.uid))
      this.unaddedSites = this.sites.filter(site => !this.siteUids.includes(site.uid))
    },

    addSite(siteIdToAdd) {
      this.canSaveSites = true
      this.unaddedSites = this.unaddedSites.filter(site => site.uid !== siteIdToAdd)
      this.addedSites.unshift(this.sites.find(site => site.uid === siteIdToAdd))
      this.siteUids.push(siteIdToAdd)
      // this.handleUnaddedCardsSearch(this.unaddedCardsSearch)
    },
    removeSite(siteIdToRemove) {
      if (!confirm(`Are you sure you want to remove this site from "${this.group.name}"?`)) return
      this.canSaveSites = true
      this.addedSites = this.addedSites.filter(site => site.uid !== siteIdToRemove)
      this.unaddedSites.unshift(this.sites.find(item => item.uid === siteIdToRemove))
      this.siteUids = this.siteUids.filter(item => item !== siteIdToRemove)
      // this.handleUnaddedCardsSearch(this.unaddedCardsSearch)
    },
    async fetchAttachedCardGroups() {
      if (this.group) await this.$store.dispatch('acs/getAttachedCardGroups', this.groupId)
    },
    getcardgroup() {
      if (!this.group) return
      const attactCardGroupIds = this.attachedCardGroups.map(group => group.card_group_id)

      this.acsCardGroups = this.cardGroups.filter(cardGroup => attactCardGroupIds.includes(cardGroup.id))
      this.unattachedCardGroups = this.cardGroups.filter(cardGroup => !attactCardGroupIds.includes(cardGroup.id))
    },
    onClick(cardGroupId) {
      this.$router.push({ path: '/access/card-group/save', query: { groupId: cardGroupId } })
    },
    async assignCardGroup(cardGroupID) {
      if (!confirm('Are you sure you want to attach this Card Group?')) return

      this.$store.commit('acs/RESET_GROUP_ATTACH_PARAMS')
      this.$store.commit('acs/UPDATE_GROUP_ATTACH_PARAMS', {
        cardGroupType: 'group',
        cardGroupId: cardGroupID,
        siteGroupId: this.groupId,
        siteGroupType: 'group',
      })

      try {
        await this.$store.dispatch('acs/attachGroups')
        this.$toast.success('Cards will be added in a moment')
        await this.fetchAttachedCardGroups()
        this.getcardgroup()
      } catch (error) {
        this.$toast.error(error.message)
      }
    },
    async removeAttachedCardGroup(cardGroupIdToRemove) {
      const cardGroupToremove = this.cardGroups.find(cardGroup => cardGroup.id === cardGroupIdToRemove)

      if (!cardGroupToremove) return

      if (!confirm(`${cardGroupToremove.count} Cards Will be removed from this Site Group`)) return

      this.$store.commit('acs/RESET_GROUP_DETTACH_PARAMS')
      this.$store.commit('acs/UPDATE_GROUP_DETTACH_PARAMS', {
        cardGroupType: 'group',
        cardGroupId: cardGroupIdToRemove,
        siteGroupId: this.groupId,
        siteGroupType: 'group',
      })

      try {
        await this.$store.dispatch('acs/dettachGroups')
        this.$toast.success('Cards will be removed in a moment')
        await this.fetchAttachedCardGroups()
        this.getcardgroup()
      } catch (error) {
        this.$toast.error(error.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
