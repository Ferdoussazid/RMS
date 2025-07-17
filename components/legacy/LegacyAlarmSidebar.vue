<template>
  <div class="gap-2">
    <!-- DURATION -->
    <div class="mb-2 overflow-hidden rounded border bg-white">
      <div class="flex justify-between bg-blue-500 p-1.5">
        <span class="font-bold text-white">Alarm Duration Filter</span>
        <i
          class="fas fa-arrow-down my-auto text-white hover:cursor-pointer"
          v-if="!showDuration"
          @click="showDuration = true"
        ></i>
        <i class="fas fa-times my-auto text-white hover:cursor-pointer" v-else @click="clearDateRange()"></i>
      </div>
      <div class="flex w-full flex-col justify-center p-1.5 align-middle" :class="showDuration ? 'block' : 'hidden'">
        <!-- DATE TIME FILTER -->
        <div class="flex flex-col gap-3">
          <div class="flex flex-col">
            <label class="mb-1 text-sm font-medium text-gray-700">Start Date & Time</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <i class="fas fa-calendar-alt text-gray-400"></i>
              </div>
              <input
                type="datetime-local"
                v-model="dateTimeStart"
                class="w-full rounded-md border border-gray-300 py-2 px-3 pl-10 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @change="updateDateRange"
              />
            </div>
          </div>
          <div class="flex flex-col">
            <label class="mb-1 text-sm font-medium text-gray-700">End Date & Time</label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <i class="fas fa-calendar-alt text-gray-400"></i>
              </div>
              <input
                type="datetime-local"
                v-model="dateTimeEnd"
                class="w-full rounded-md border border-gray-300 py-2 px-3 pl-10 shadow-sm transition duration-150 ease-in-out focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                @change="updateDateRange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- POWER -->
    <div class="mb-2 overflow-hidden rounded border bg-white">
      <div class="flex justify-between bg-blue-500 p-1.5">
        <span class="font-bold text-white">Power Alarms</span>
      </div>
      <div class="w-full p-1.5">
        <div
          v-for="(alarm, i) in getFilteredAlarms('POWER')"
          :key="i"
          class="border-bottom flex justify-between gap-2 border-gray-300 py-1 pr-1.5 align-top"
        >
          <div class="flex gap-2 align-middle">
            <input
              @change="toggleStatus(alarm)"
              :value="alarm.checked"
              type="checkbox"
              :name="alarm.key"
              :id="alarm.key"
              class="my-auto h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-gray-700" :class="alarm.checked ? 'font-bold' : ''">{{ alarm.label }}</span>
          </div>

          <div class="flex gap-2 align-middle">
            <div class="rounded-full border border-gray-300 bg-slate-200">
              <span class="px-2 text-xs">{{ getPercentage(alarm) }}</span>
            </div>
            <div class="rounded-full border border-gray-300 bg-blue-500">
              <span class="px-2 text-xs text-white">{{ getCount(alarm) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-2 overflow-hidden rounded border bg-white">
      <div class="flex justify-between bg-blue-500 p-1.5">
        <span class="font-bold text-white">Environment</span>
      </div>
      <div class="w-full p-1.5">
        <div
          v-for="(alarm, i) in getFilteredAlarms('ENV')"
          :key="i"
          class="border-bottom flex justify-between gap-2 border-gray-300 py-1 pr-1.5 align-top"
        >
          <div class="flex gap-2 align-middle">
            <input
              @change="toggleStatus(alarm)"
              :value="alarm.checked"
              type="checkbox"
              :name="alarm.key"
              :id="alarm.key"
              class="my-auto h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-gray-700" :class="alarm.checked ? 'font-bold' : ''">{{ alarm.label }}</span>
          </div>

          <div class="flex gap-2 align-middle">
            <div class="rounded-full border border-gray-300 bg-slate-200">
              <span class="px-2 text-xs">{{ getPercentage(alarm) }}</span>
            </div>
            <div class="rounded-full border border-gray-300 bg-blue-500">
              <span class="px-2 text-xs text-white">{{ getCount(alarm) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-2 overflow-hidden rounded border bg-white" v-if="canAccessAcs">
      <div class="flex justify-between bg-blue-500 p-1.5">
        <span class="font-bold text-white">Access Control</span>
      </div>
      <div class="w-full p-1.5">
        <div
          v-for="(alarm, i) in getFilteredAlarms('ACS')"
          :key="i"
          class="border-bottom flex justify-between gap-2 border-gray-300 py-1 pr-1.5 align-top"
        >
          <div class="flex gap-2 align-middle">
            <input
              @change="toggleStatus(alarm)"
              :value="getAlarmStatus(alarm)"
              type="checkbox"
              :name="alarm.key"
              :id="alarm.key"
              class="my-auto h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-blue-500"
            />
            <span class="text-gray-700" :class="alarm.checked ? 'font-bold' : ''">{{ alarm.label }}</span>
          </div>

          <div class="flex gap-2 align-middle">
            <div class="rounded-full border border-gray-300 bg-slate-200">
              <span class="px-2 text-xs">{{ getPercentage(alarm) }}</span>
            </div>
            <div class="rounded-full border border-gray-300 bg-blue-500">
              <span class="px-2 text-xs text-white">{{ getCount(alarm) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseISO } from 'date-fns'
import { mapGetters } from 'vuex'
import { ACS_EVENTS, ENV_EVENTS, getCompanySpecificEventLabel, RMS_EVENTS } from '~/assets/js/LegacyHelper'
import { TelegramAlarm } from '~/assets/js/TelegramConstant'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  middleware: ['auth', 'setup'],
  mixins: [UserTypeChecker],
  props: {
    selectedAlarms: {
      type: Array,
      required: true,
    },
  },
  computed: {
    ...mapGetters('user', ['companyName']),
    ...mapGetters('site', ['sites']),
    ...mapGetters('dashboard-legacy', ['alarm']),
    activeRangeLeft() {
      // Calculate the left position of the active range track
      return `${((this.range.start - this.min) / (this.max - this.min)) * 100}%`
    },
    activeRangeWidth() {
      // Calculate the width of the active range track
      return `${((this.range.end - this.range.start) / (this.max - this.min)) * 100}%`
    },
  },
  data: () => ({
    showDuration: false,
    alarms: [],
    dateRange: {
      start: null,
      end: null,
    },
    dateTimeStart: null,
    dateTimeEnd: null,
  }),

  watch: {
    dateRange(newValue) {
      this.$emit('update:dateRange', {
        start: newValue.start ? newValue.start : null,
        end: newValue.end ? newValue.end : null,
      })
    },
  },
  mounted() {
    this.alarms = [
      ...RMS_EVENTS.map(item => ({
        label: getCompanySpecificEventLabel(this.companyName, item),
        checked: false,
        key: item,
        type: 'POWER',
        count: 0,
      })),
      ...ENV_EVENTS.map(item => ({
        label: getCompanySpecificEventLabel(this.companyName, item),
        checked: false,
        key: item,
        type: 'ENV',
        count: 0,
      })),
      ...ACS_EVENTS.map(item => ({
        label: getCompanySpecificEventLabel(this.companyName, item),
        checked: false,
        key: item,
        type: 'ACS',
        count: 0,
      })),
    ]
  },
  methods: {
    updateDateRange() {
      if (this.dateTimeStart && this.dateTimeEnd) {
        this.dateRange = {
          start: parseISO(this.dateTimeStart),
          end: parseISO(this.dateTimeEnd),
        }
      }
    },
    applyDateFilter() {
      this.updateDateRange()
      // Optional: You can add visual feedback here
      // For example, show a temporary success message
    },
    clearDateRange() {
      this.showDuration = false
      this.dateRange = {
        start: null,
        end: null,
      }
      this.dateTimeStart = null
      this.dateTimeEnd = null

      this.$emit('update:dateRange', {
        start: null,
        end: null,
      })
    },
    getAlarmStatus(alarm) {
      return this.selectedAlarms.includes(alarm.key) ? true : false
    },
    getFilteredAlarms(type) {
      const disabledAlarms = [TelegramAlarm.ac_fail]
      if (!this.alarms || this.alarms.length === 0) return []
      return this.alarms.filter(alarm => alarm.type === type).filter(alarm => !disabledAlarms.includes(alarm.key))
    },
    toggleStatus(alarm) {
      this.alarms.find(a => a.key === alarm.key).checked = !alarm.checked
      if (alarm.checked) {
        this.$emit('update:selectedAlarms', [...this.selectedAlarms, alarm.key])
      } else {
        this.$emit(
          'update:selectedAlarms',
          this.selectedAlarms.filter(a => a !== alarm.key)
        )
      }
    },
    getCount(selectedAlarm) {
      if (!this.sites) {
        return 0
      }

      if (!this.alarm || this.alarm.length === 0) {
        return 0
      }
      let count = this.alarm
        .filter(item => item.event_name === selectedAlarm.key)
        .filter(item => this.sites.filter(site => site.uid === item.site_uid).length > 0).length
      this.alarms.find(a => a.key === selectedAlarm.key).count = count
      return count
    },
    getPercentage(alarm) {
      return `${Math.round((alarm.count / this.sites.length) * 100)}%`
    },
  },
}
</script>
