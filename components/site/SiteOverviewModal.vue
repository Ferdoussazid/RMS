<template>
  <div>
    <input id="my-modal-5" ref="mtrigger" type="checkbox" class="hidden modal-toggle" />
    <label for="my-modal-5" class="modal z-[1001] w-full">
      <label class="modal-box relative flex h-[98vh] max-h-screen w-11/12 max-w-5xl flex-col py-4" for="">
        <span class="text-base font-semibold text-gray-700">{{ siteName }}</span>

        <label for="my-modal-5" class="absolute btn-sm btn-circle btn right-2 top-2">✕</label>

        <div class="w-full mt-2 tabs">
          <a class="font-medium tab-lifted tab" :class="[alarmTabActive ? 'tab-active text-gray-800' : 'text-gray-600']"
            @click="onTabClick('alarm')">
            <i class="mr-2 fas fa-bell"></i> Alarms
          </a>
          <a class="font-medium tab-lifted tab" :class="[eventTabActive ? 'tab-active text-gray-800' : 'text-gray-600']"
            @click="onTabClick('event')">
            <i class="mr-2 fas fa-list-ul"></i> Event Log
          </a>
          <a v-if="!isReadOnlyUser && !isRmsUser" class="font-medium tab-lifted tab"
            :class="[accessTabActive ? 'tab-active text-gray-800' : 'text-gray-600']" @click="onTabClick('access')">
            <i class="mr-2 fas fa-door-open"></i> Access History
          </a>
          <a class="font-medium tab-lifted tab" :class="[infoTabActive ? 'tab-active text-gray-800' : 'text-gray-600']"
            @click="onTabClick('info')">
            <i class="mr-2 fas fa-info-circle"></i> Site Info
          </a>
        </div>

        <div class="w-full mt-4">
          <div v-show="alarmTabActive" class="min-h-[80vh] w-full rounded bg-slate-100">
            <SiteAlarmsTabContainer :alarms="siteAlarms" :last-events="siteEvents" />
          </div>
          <div v-if="eventTabActive" class="min-h-[80vh] w-full rounded bg-slate-100">
            <SiteEventsTabContainer />
          </div>
          <div v-if="accessTabActive" class="min-h-[80vh] w-full rounded bg-slate-100">
            <SiteAccessTabContainer />
          </div>
          <div v-if="infoTabActive" class="min-h-[80vh] w-full">
            <SiteInfoTabContainer :site="focusedSite" />
          </div>
        </div>
      </label>
    </label>
  </div>
</template>

<script>
  import _ from 'lodash'
  import { mapGetters } from 'vuex'
  import UserTypeChecker from '~/mixins/UserTypeChecker'

  export default {
    mixins: [UserTypeChecker],
    props: {
      site: {
        type: Object,
        default: null,
      },
    },
    data: () => ({
      selectedTab: 'alarm',
    }),
    computed: {
      ...mapGetters('site', ['focusedSite']),
      alarmTabActive() {
        return this.selectedTab === 'alarm'
      },
      eventTabActive() {
        return this.selectedTab === 'event'
      },
      accessTabActive() {
        return this.selectedTab === 'access'
      },
      infoTabActive() {
        return this.selectedTab === 'info'
      },

      siteName() {
        return _.get(this.site, 'name', '')
      },
      siteAlarms() {
        return _.get(this.site, 'alarms', [])
      },
      siteEvents() {
        return _.get(this.site, 'events', [])
      },
    },
    mounted() { },
    methods: {
      show() {
        this.$refs.mtrigger.click()
        setTimeout(() => {
          if (this.site) {
            this.selectedTab = 'alarm'
            this.$store.dispatch('site/getSiteConfig', this.site.uid)
            this.onTabClick(this.selectedTab)
          }
        }, 50)
      },
      onTabClick(tab) {
        this.selectedTab = tab
        switch (tab) {
          case 'alarm':
            this.$store.dispatch('site/getAlarms', this.site.uid)
            break
          case 'event':
            this.$store.dispatch('site/getEvents', this.site.uid)
            break
          case 'access':
            this.$store.dispatch('access/getEvents', this.site.uid)
            break

          default:
            break
        }
      },
    },
  }
</script>

<style lang="scss" scoped></style>
