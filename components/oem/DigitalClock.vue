<template>
  <div id="clock">
    <div v-if="oemTime" class="flex flex-col text-center">
      <span class="date text-base tracking-wider text-[#daf6ff]">{{ date }}</span>
      <span class="time text-2xl tracking-wider text-[#daf6ff]">{{ time }}</span>
    </div>
    <div v-else class="flex items-center justify-center">
      <span class="text-xl tracking-wider text-[#daf6ff]">N/A</span>
    </div>
  </div>
</template>

<script>
import { add } from 'date-fns'
import { mapGetters } from 'vuex'
export default {
  props: {
    isHour: {
      type: Boolean,
      default: true,
    },
    isMinute: {
      type: Boolean,
      default: true,
    },
    isSecond: {
      type: Boolean,
      default: true,
    },
    siteUid: {
      type: Number,
      default: null,
    },
    rectifierType: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      clockTime: '',
      time: '',
      date: '',
      week: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      timerId: null,
    }
  },
  computed: {
    ...mapGetters('oem', ['oemTime']),
  },
  async mounted() {
    await this.getTime()
    this.timerID = setInterval(this.updateTime, 1000)
    this.clockTime = this.oemTime
    this.startTime(this.clockTime)
  },
  destroyed() {
    clearInterval(this.timerId)
  },
  methods: {
    async getTime() {
      await this.$store.dispatch('oem/getRectifierInfo', {
        site_uid: this.siteUid,
        rectifier_type: this.rectifierType || ' ',
      })
    },
    startTime(time) {
      if (time) {
        this.time =
          this.zeroPadding(time.getHours(), 2) +
          ':' +
          this.zeroPadding(time.getMinutes(), 2) +
          ':' +
          this.zeroPadding(time.getSeconds(), 2)
        this.date =
          this.zeroPadding(time.getDate(), 2) +
          '-' +
          this.zeroPadding(time.getMonth() + 1, 2) +
          '-' +
          time.getFullYear() +
          ' ' +
          this.week[time.getDay()]
      }
    },

    updateTime() {
      this.clockTime = add(this.clockTime, { seconds: 1 })
      this.startTime(this.clockTime)
    },

    zeroPadding(num, digit) {
      let zero = ''
      for (let i = 0; i < digit; i++) {
        zero += '0'
      }
      return (zero + num).slice(-digit)
    },
  },
}
</script>

<style></style>
