<template>
  <ContentCard has-footer title="Telegram Groups">
    <template #action>
      <div class="flex w-60 flex-row items-center justify-start space-x-2">
        <DropdownMenu
          v-if="isSudoUser || isOpsUser"
          v-model="currentCompany"
          :placeholder="currentCompany?.label || 'Select Company'"
          :options="companiesWithLabel"
        />
        <LoadingSpinner v-if="loading" class="scale-50" />
      </div>
    </template>
    <template #content>
      <div class="md:min-h-auto relative h-full min-h-[60vh] w-full overflow-hidden bg-slate-100">
        <div class="absolute inset-0 flex flex-col items-start justify-start py-1 shadow-inner">
          <div
            v-if="!isEmpty"
            class="flex w-full flex-col items-stretch justify-start space-y-2 overflow-y-scroll px-2 scrollbar-hide"
          >
            <div class="px-2">
              <span class="text-xs font-light text-gray-700">Groups</span>
            </div>
            <div class="flex w-full flex-col items-stretch justify-start gap-2">
              <TelegramGroupItem v-for="g in telegramGroups" :key="g.id" :group="g" />
            </div>

            <div v-if="!telegramGroups.length" class="flex justify-center py-2">
              <span class="text-xs font-normal text-gray-500">No Group Available</span>
            </div>
          </div>
          <div v-if="isEmpty" class="flex w-full flex-col items-center justify-start py-[15vh]">
            <img src="/icon/nothing.png" alt="" class="h-auto w-16" />
            <span class="text-center text-sm font-normal text-gray-400"> No group found </span>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex flex-row items-center justify-between border-t border-slate-200 px-3 py-2">
        <div class="flex flex-row items-center space-x-1">
          <span class="text-2xs font-normal text-gray-500">
            <strong>{{ telegramGroups?.length || 0 }}</strong> Groups
          </span>
          <span class="text-[0.35rem] text-gray-300"><i class="fas fa-circle"></i></span>
        </div>
        <div v-if="isSudoUser || isOpsUser || canAccessTelegram" class="flex">
          <nuxt-link
            to="/telegram/group/save"
            class="rounded bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow transition duration-300 hover:bg-indigo-600"
          >
            <i class="fas fa-plus"></i>
            Telegram Group
          </nuxt-link>
        </div>
      </div>
    </template>
  </ContentCard>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { filterSiteListByTextSearch, siteListAlphabeticSort } from '~/assets/js/SiteHelper'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  data: () => ({
    loading: false,
    search: '',
    area: '',
    cluster: '',
    currentCompany: 'null',
  }),
  computed: {
    ...mapGetters('user', ['rootUserUid']),
    ...mapGetters('acs', ['siteGroups']),
    ...mapGetters('site', ['sites']),
    ...mapGetters('telegram', ['telegramGroups']),
    ...mapGetters('customer', ['companies']),

    companiesWithLabel() {
      return [
        ...this.companies.map(c => {
          return { ...c, label: c.name }
        }),
        { id: null, label: 'Unassigned Group', value: null, name: 'none' },
      ]
    },
    isEmpty() {
      return !this.telegramGroups.length
    },
    areaList() {
      const items = this.sites.map(s => _.get(s, 'place.division', '')).filter(a => !!a)
      return _.uniq(items)
    },
    companyId() {
      return this.$auth.user.company_id
    },
    clusterList() {
      if (!this.area) return []
      const items = this.sites
        .filter(s => _.get(s, 'place.division', '') === this.area)
        .map(s => _.get(s, 'place.district', ''))
        .filter(c => !!c)
      return _.uniq(items)
    },
    filteredSites() {
      let items = [...this.sites]
      if (this.search.trim().length) {
        items = filterSiteListByTextSearch(items, this.search)
      }

      if (this.area) {
        items = items.filter(s => _.get(s, 'place.division', '') === this.area)
      }

      if (this.cluster) {
        items = items.filter(s => _.get(s, 'place.district', '') === this.cluster)
      }

      // Sort sites alphabetically

      items.sort(siteListAlphabeticSort)

      return items
    },
  },
  watch: {
    currentCompany: {
      handler(val, old) {
        this.fetchTelegramGroups(val?.id || 'null')
      },
    },
  },
  async mounted() {
    await this.getCompanyList()
    const company = await this.companiesWithLabel.find(c => c.id === this.companyId)
    this.currentCompany = company || null
    await this.fetchTelegramGroups(company ? company.id : 'null')
  },

  methods: {
    async fetchTelegramGroups(companyId) {
      try {
        await this.$store.dispatch('telegram/fetchTelegramGroups', companyId)
      } catch (error) {
        this.$toast.error(error)
      }
    },
    async getCompanyList() {
      await this.$store.dispatch('customer/getCompanyList')
    },
  },
}
</script>

<style lang="scss" scoped></style>
