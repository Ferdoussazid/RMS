<template>
  <div
    class="flex w-full flex-row items-stretch space-x-2"
    :class="[alarm.isAvailable ? 'opacity-100' : 'cursor-not-allowed opacity-50']"
  >
    <div
      class="flex flex-col items-center pt-1.5 align-middle"
      :class="!this.alarm.isAvailable || readonlyAlarm ? 'cursor-not-allowed opacity-50' : ''"
      v-if="canAccessAlarmSettings"
    >
      <ToggleSwitch
        :status="!alarm.isDisable"
        @toggleStatus="toggleStatus"
        :disabled="!this.alarm.isAvailable || readonlyAlarm"
        :cursorDiabled="!this.alarm.isAvailable || readonlyAlarm"
      />
    </div>
    <div
      class="flex grow flex-row items-center justify-between space-x-2 overflow-hidden rounded-md bg-white px-3 py-2 shadow-lg"
    >
      <div class="flex items-center justify-start space-x-1">
        <span class="select-none text-xs font-semibold text-gray-700">{{ alarm.name }}</span>
        <span v-if="!!alarmTenant" class="hidden text-[10px] font-medium capitalize text-blue-800 lg:flex">
          ({{ alarmTenant }})</span
        >
      </div>
      <button
        v-if="canClearSecurityBreach"
        class="shrink-0 rounded bg-indigo-100 px-3 py-1.5 text-xs font-medium text-indigo-500 transition duration-300 hover:bg-indigo-500 hover:text-white"
        @click="clearSecurityBreach"
      >
        <i class="fas fa-eraser"></i> Clear Alarm
      </button>
      <button
        v-if="canClearLockOpenFail"
        class="shrink-0 rounded bg-sky-100 px-3 py-1.5 text-xs font-medium text-sky-500 transition duration-300 hover:bg-sky-500 hover:text-white"
        @click="clearLockOpenFail"
      >
        <i class="fas fa-eraser"></i> Clear Alarm
      </button>
      <span v-if="showAlarmTime" class="hidden text-[10px] font-medium capitalize text-red-500 lg:flex">{{
        alarmTime
      }}</span>
    </div>
    <div
      class="flex shrink-0 flex-row items-center justify-center rounded-md px-3 py-2 shadow-lg"
      :class="[alarmColor]"
    >
      <span v-if="!alarm.isAvailable"><i class="fas fa-question-circle"></i></span>
      <span v-else-if="alarm.isNormal"><i class="fas fa-check-circle"></i></span>
      <span v-else><i class="fas fa-exclamation-triangle"></i></span>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import { disabledinSettingsAlarms, powerAlarms } from '~/assets/js/AlarmHelper'
import { SITE_ALARM, SITE_TENANT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper'

export default {
  mixins: [UserTypeChecker],
  props: {
    alarm: {
      type: Object,
      required: true,
    },
  },
  data: () => ({}),
  computed: {
    ...mapGetters('site', ['focusedSite']),
    ...mapGetters('user', ['userUid', 'startSession']),
    readonlyAlarm() {
      return disabledinSettingsAlarms.includes(this.alarm.tag)
    },
    alarmTenant() {
      if (!powerAlarms.includes(this.alarm.id)) {
        return this.getLabelOfTenant(this.alarm.tenant)
      }
      return this.getLabelOfTenant(this.alarm.tenant || SITE_TENANT.BANGLALINK)
    },

    alarmColor() {
      if (!this.alarm.isAvailable) {
        return 'bg-slate-200 text-slate-600'
      }
      if (this.alarm.isNormal) {
        return 'bg-green-500 text-white'
      }
      return 'bg-red-500 text-white'
    },
    hasActiveSecurityBreach() {
      return this.alarm.id === SITE_ALARM.SECURITY_BREACH && this.alarm.isAvailable && !this.alarm.isNormal
    },
    hasLockOpenFail() {
      return this.alarm.id === SITE_ALARM.LOCK_OPEN_FAIL && this.alarm.isAvailable && !this.alarm.isNormal
    },
    canClearSecurityBreach() {
      return this.hasActiveSecurityBreach && !this.isReadOnlyUser
    },
    canClearLockOpenFail() {
      return this.hasLockOpenFail && !this.isReadOnlyUser
    },
    alarmTime() {
      if (this.alarm.id === SITE_ALARM.VIBRATION) {
        return null
      }
      const time = this._.get(this.alarm, 'lastEvent', null)
      if (this.alarm.isAvailable && !this.alarm.isNormal && time) {
        return format(new Date(time), 'h:mm a, d MMM yy')
      }
      return null
    },
    showAlarmTime() {
      return this.alarmTime && this.$route.path === '/alarm'
    },
  },
  methods: {
    getLabelOfTenant(tenant) {
      return getTenantLabel(tenant, false)
    },
    clearSecurityBreach() {
      this.$store.dispatch('site/setSecurityBreachClearModal', true)
    },
    async clearLockOpenFail() {
      if (!this.focusedSite) {
        this.$toast.error('Something went wrong !')
        return
      }

      try {
        await this.$store.dispatch('site/clearLockOpenFail', {
          site_uid: this.focusedSite.uid,
        })
        this.$toast.success('Lock open fail alarm cleared')
      } catch (error) {
        this.$toast.error(error.message)
      }
    },
    async toggleStatus(status) {
      if (!this.alarm.isAvailable || disabledinSettingsAlarms.includes(this.alarm.tag)) {
        return
      }

      try {
        let result = confirm(
          `Are you sure you want to ${this.alarm.isDisable ? 'enable' : 'disable'} this alarm? ${
            this.alarm.isDisable || this.alarm.isNormal ? '' : 'This action will clear the alarm.'
          }`
        )
        if (!result) return
        await this.$axios.$post('/user/site/update-alarm', {
          site_uid: this.focusedSite.uid,
          property: this.alarm.tag,
          is_disable: this.alarm.isDisable ? 'NO' : 'YES',
          tenant: this.alarm.tenant,
        })

        this.$store.dispatch('user/startSession', this.focusedSite.uid)
        this.$toast.success(`Alarm ${this.alarm.isDisable ? 'enabled' : 'disabled'}`)
      } catch (error) {
        console.log(error)
        this.$toast.error(error.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
