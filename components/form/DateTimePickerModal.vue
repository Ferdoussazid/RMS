<template>
  <div>
    <input :id="tag" ref="mtrigger" type="checkbox" class="modal-toggle hidden" />
    <label ref="backdrop" :for="tag" class="modal w-full">
      <label
        class="modal-box relative flex w-11/12 max-w-5xl flex-col"
        :class="[timePicker ? 'md:w-2/3 lg:w-1/2' : 'md:w-1/4 lg:w-1/3']"
        for=""
      >
        <span class="text-lg font-semibold text-gray-700">{{ title }}</span>
        <div class="mt-4 flex w-full items-stretch" :class="[timePicker ? 'justify-start' : 'justify-center']">
          <div class="shrink-0">
            <vc-date-picker v-if="!rangePicker" v-model="date" color="indigo" class="w-full border-0"></vc-date-picker>
            <vc-date-picker v-if="rangePicker" v-model="dateRange" color="indigo" is-range class="w-full border-0">
            </vc-date-picker>
          </div>
          <div v-if="timePicker" class="flex grow flex-col items-center justify-center space-y-4 px-4">
            <div class="flex flex-col items-start space-y-1">
              <span class="text-xs font-semibold text-gray-700">Hour</span>
              <select v-model="hour" class="select-bordered select w-60">
                <option v-for="i in 12" :key="i">{{ i }}</option>
              </select>
            </div>
            <ButtonOptionGroup v-model="meridiem" :options="meridiems" />
          </div>
        </div>
        <div class="mt-4 flex flex-row items-center justify-end space-x-4 border-t border-slate-200 px-4 pt-4">
          <button class="btn-ghost btn flex space-x-2" @click="dismiss">
            <i class="fas fa-times"></i>
            <span>Cancel</span>
          </button>
          <button class="btn-success btn flex space-x-2 text-white" @click="submit">
            <i class="fas fa-check"></i>
            <span>Ok</span>
          </button>
        </div>
      </label>
    </label>
  </div>
</template>

<script>
import { differenceInDays, endOfDay, endOfToday, startOfDay, startOfToday } from 'date-fns'
export default {
  props: {
    timePicker: {
      type: Boolean,
      default: true,
    },
    tag: {
      type: String,
      required: false,
      default: () => 'date-time-modal',
    },
    rangePicker: {
      type: Boolean,
      default: false,
    },
    range: {
      type: Object,
      default: () => ({
        start: startOfToday(),
        end: endOfToday(),
      }),
    },
  },
  data: () => ({
    date: new Date(),
    dateRange: {},
    hour: '12',
    meridiem: null,
    meridiems: [
      { value: 'am', label: 'AM' },
      { value: 'pm', label: 'PM' },
    ],
  }),
  computed: {
    title() {
      if (this.timePicker) {
        return 'Pick Date/Time'
      }
      if (this.rangePicker) {
        return 'Pick Range'
      }
      return 'Pick Date'
    },
  },
  watch: {
    range: {
      handler(val, old) {
        this.dateRange = { ...val }
      },
      deep: true,
    },
  },
  mounted() {
    this.dateRange = { ...this.range }
  },
  methods: {
    show() {
      this.$refs.mtrigger.click()
    },
    dismiss() {
      this.$refs.backdrop.click()
    },
    submit() {
      try {
        if (this.rangePicker) {
          const start = startOfDay(this.dateRange.start)
          const end = endOfDay(this.dateRange.end)

          if (differenceInDays(end, start) > 30) {
            throw new Error('Please pick a range within 31 days')
          }

          this.$emit('range', { start, end })
        } else {
          const result = new Date(this.date)
          if (this.timePicker) {
            result.setHours(this.get24Hour(), 0, 0, 0)
          }
          this.$emit('submit', result)
        }
      } catch (error) {
        this.$toast.error(error)
      }
    },
    get24Hour() {
      if (this.meridiem.value === 'am' && +this.hour < 12) return +this.hour
      if (this.meridiem.value === 'pm' && +this.hour < 12) return +this.hour + 12
      if (this.meridiem.value === 'pm' && +this.hour === 12) return 12
      return 0
    },
  },
}
</script>

<style lang="scss" scoped></style>
