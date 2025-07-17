<template>
  <div class="relative flex h-full flex-col divide-y divide-slate-300 rounded bg-sky-50 shadow-md">
    <div
      v-if="exporting"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 bg-white opacity-60"
    >
      <span class="text-sm font-semibold text-indigo-700">Exporting Load Status...</span>
      <CircularSpinner size="lg" />
    </div>
    <div class="flex h-[50px] justify-center divide-x divide-slate-300 rounded-t bg-slate-200">
      <div class="flex flex-1 items-center justify-center p-2 text-center text-[0.8rem] font-medium">
        Avg. <br />
        Consumption (KW)
      </div>
      <div class="flex flex-1 items-center justify-center p-2 text-center text-[0.8rem] font-medium">Site Count</div>
      <div class="flex flex-1 items-center justify-center p-2 text-center text-[0.8rem] font-medium">
        Overload <br />
        (3h/day)
      </div>
    </div>
    <div
      v-for="range in loadRanges"
      :key="range.id"
      class="group flex h-full flex-1 cursor-pointer justify-center divide-x divide-slate-300"
    >
      <div class="flex flex-1 items-center justify-center px-4 py-2">
        <span
          class=""
          :class="[
            isSelectedRange(range) ? 'text-lg font-semibold text-slate-900' : 'text-sm font-medium text-slate-600',
          ]"
          >{{ getRangeStr(range) }}</span
        >
      </div>
      <div
        :class="[isSelectedRange(range, 'sites') ? 'bg-sky-300' : 'hover:bg-sky-200']"
        class="flex flex-1 items-center justify-center px-4 py-2"
        @click="onRangeItemClick(range, 'sites')"
      >
        <span
          class=""
          :class="[
            isSelectedRange(range, 'sites')
              ? 'text-lg font-semibold text-slate-900'
              : 'text-sm font-medium text-slate-600',
          ]"
          >{{ getSiteCountInRange(range, 'sites') }}</span
        >
      </div>
      <div
        :class="[isSelectedRange(range, 'overload') ? 'bg-sky-300' : 'hover:bg-sky-200']"
        class="flex flex-1 items-center justify-center px-4 py-2"
        @click="onRangeItemClick(range, 'overload')"
      >
        <span
          class=""
          :class="[
            isSelectedRange(range, 'overload')
              ? 'text-lg font-semibold text-red-500'
              : 'text-sm font-medium text-red-600',
          ]"
          >{{ getSiteCountInRange(range, 'overload') }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
const downloadFile = require('js-file-download')

export default {
  data() {
    return {
      exporting: false,
      loadRanges: [
        { id: 1, start: -1, end: 2 },
        { id: 2, start: 2, end: 2.5 },
        { id: 3, start: 2.5, end: 3 },
        { id: 4, start: 3, end: 3.5 },
        { id: 5, start: 3.5, end: 4 },
        { id: 6, start: 4, end: 4.5 },
        { id: 7, start: 4.5, end: 5 },
        { id: 8, start: 5, end: Infinity },
        { id: 9, start: -1, end: Infinity },
      ],
    }
  },
  computed: {
    ...mapGetters('dashboard', ['powerData', 'selectedLoadCountItem']),
    ...mapGetters('site', ['siteUid2Name']),
    ...mapGetters('user', ['rootUserUid']),
  },
  mounted() {
    if (!this.selectedLoadCountItem.site) {
      this.$emit('range', {
        range: this.selectedLoadCountItem.range,
        sites: this.getSitesOfSelectedItem({
          range: this.selectedLoadCountItem.range,
          type: this.selectedLoadCountItem.type,
        }),
      })
    } else {
      this.$emit(
        'filter',
        this.getSitesOfSelectedItem({
          range: this.selectedLoadCountItem.range,
          type: this.selectedLoadCountItem.type,
        })
      )
    }
  },
  methods: {
    onRangeItemClick(range, type) {
      this.$store.commit('dashboard/SET_SELECTED_LOAD_COUNT_ITEM', { key: 'range', value: range })
      this.$store.commit('dashboard/SET_SELECTED_LOAD_COUNT_ITEM', { key: 'type', value: type })
      const sites = this.getSitesOfSelectedItem({ range, type })
      this.$emit('range', { range, sites })
      this.exportLoadStatus({ range, sites })
    },
    async exportLoadStatus({ range, sites }) {
      try {
        if (!sites.length) return
        this.exporting = true
        let siteUids
        if (range.start !== -1 || range.end !== Infinity) {
          siteUids = sites.map(s => s.site_uid)
        }
        const startDate = this.selectedLoadCountItem.date.start
        const endDate = this.selectedLoadCountItem.date.end
        const params = {
          user_uid: this.rootUserUid,
          site_uids: siteUids,
          from_time: startDate,
          until_time: endDate,
        }
        const rangeStr = range.id === 9 ? 'Total' : `(${this.getRangeStr(range)}) KW`
        const res = await this.$axios.$get('/user/report/overload', { params, responseType: 'arraybuffer' })
        const fileName = `Overload Events Export of ${rangeStr} Load Range (${format(startDate, 'd LLL yy')} - ${format(
          endDate,
          'd LLL yy'
        )}).xlsx`
        downloadFile(res, fileName)
      } catch (error) {
        this.$toast.error('Error exporting load status')
      }
      this.exporting = false
    },
    getSitesOfSelectedItem({ range, type }) {
      const sites = this.powerData.filter(this.filterRangeItems(range, type)).sort((a, b) => b.power - a.power)
      return sites
    },
    filterRangeItems(range, type) {
      if (type === 'overload') {
        return item => item.power > range.start && item.power <= range.end && item.overload === 'YES'
      } else {
        return item => item.power > range.start && item.power <= range.end
      }
    },
    getSiteCountInRange(range, type) {
      const sites = this.powerData.filter(this.filterRangeItems(range, type))
      return sites.length
    },
    isSelectedRange(range, type = null) {
      return (
        range.id === this.selectedLoadCountItem.range.id && (type ? type === this.selectedLoadCountItem.type : true)
      )
    },
    getRangeStr(range) {
      const rangeStart = range.start === -1 ? 0 : range.start
      const rangeEnd = range.end
      if (rangeEnd === Infinity) {
        if (rangeStart === 0) {
          return 'Total'
        } else {
          return rangeStart + ' <'
        }
      }
      return rangeStart + ' - ' + rangeEnd
    },
  },
}
</script>

<style lang="scss" scoped></style>
