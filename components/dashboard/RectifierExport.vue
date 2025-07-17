<template>
  <ContentCard :title="title">
    <template #content>
      <div class="flex flex-col items-center justify-center p-4 space-x-6 md:flex-col md:items-stretch gap-y-4">
        <div class="flex flex-col items-start w-full space-y-4">
          <div class="flex flex-col items-stretch w-full">
            <span class="text-xs font-semibold text-gray-600">Date Range</span>
            <vc-date-picker v-model="dateRange" color="indigo" is-range class="w-full mt-1 border-0"> </vc-date-picker>
          </div>
        </div>

        <div>
          <button class="p-2 text-xs text-white transition duration-300 bg-blue-500 rounded shadow-lg hover:bg-blue-600"
            @click="exportRectifierData()">
            <i v-if="loadingData" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-list-ul"></i>
            Export Rectifier Events
          </button>
        </div>

      </div>
    </template>
  </ContentCard>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { sub, startOfToday, differenceInDays, add, format } from 'date-fns'
  import UserTypeChecker from '~/mixins/UserTypeChecker'
  const downloadFile = require('js-file-download')

  export default {
    mixins: [UserTypeChecker],
    props: {
      siteUid: {
        type: Number,
        default: () => null,
      },
      title: {
        type: String,
        default: 'Export Data',
      },
      isAtTop: {
        type: Boolean,
        default: true,
      },
    },
    data: () => ({
      dateRange: {
        start: sub(startOfToday(), { days: 5 }),
        end: startOfToday(),
      },

      selectedColumns: [],
      selectedResolution: 0,
      selectedSiteUid: 'all',
      loadingRMSEvents: false,
      loadingACSEvents: false,
      loadingAvailability: false,
      loadingData: false

    }),
    computed: {
      ...mapGetters('site', ['sites', 'focusedSite']),
      ...mapGetters('user', ['rootUserUid', 'allowedTenants', 'companyName']),

    },
    watch: {

    },
    mounted() {

    },
    methods: {


      async exportRectifierData() {


        if (this.loadingData) return

        this.loadingData = true
        try {

          if (differenceInDays(this.dateRange.end, this.dateRange.start) > 30) {
            throw new Error('Please pick a range within 31 days')
          }

          const options = {
            user_uid: this.rootUserUid,
            from_time: this.dateRange.start,
            until_time: add(this.dateRange.end, { days: 1 }),
            file_name: `Rectifier Events export ${format(this.dateRange.start, 'dd MMM yyyy')} to ${format(this.dateRange.end, 'dd MMM yyyy')}.xlsx`,
          }
          const res = await this.$axios.$get('/oem/report/event', {
            params: options,
            responseType: 'arraybuffer',
          })
          downloadFile(res, options.file_name)


        } catch (error) {
          this.$toast.error(error.message)
        }
        this.loadingData = false

      },




    },
  }
</script>

<style lang="scss" scoped></style>
