<template>
  <div class="flex w-full flex-col">
    <AppToolbar title="Site Alarms" />
    <SiteTabMenu class="mt-2" />
    <div :class="['grid w-full grid-cols-1 gap-4 sm:grid-cols-2', isRmsUser ? 'md:grid-cols-2' : 'md:grid-cols-3']">
      <AlarmGroup :class="[isReadOnlyUser ? 'min-h-[70vh]' : '']" name="Power" :alarms="getAlarmsOfGroup('power')" />
      <AlarmGroup :masked="isReadOnlyUser" name="Env & Others" :alarms="getAlarmsOfGroup('env')" />
      <AlarmGroup v-if="!isRmsUser" :masked="isReadOnlyUser" name="Access" :alarms="getAlarmsOfGroup('access')" />
    </div>
    <SecurityBreachClearModal ref="security_breach_modal" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { powerAlarms, tenetSpeceficAlams } from '~/assets/js/AlarmHelper'
import { SITE_ALARM, SITE_TENANT } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  middleware: ['auth', 'setup', 'user', 'site'],
  computed: {
    ...mapGetters('site', ['focusedSite', 'focusedTenant', 'showSecurityBreachClearModal']),
    ...mapGetters('user', ['allowedTenants']),
    siteAlarms() {
      return this._.get(this.focusedSite, 'alarms', [])
    },
  },
  watch: {
    showSecurityBreachClearModal(val) {
      if (val) {
        this.$refs.security_breach_modal.show()
      } else {
        this.$refs.security_breach_modal.hide()
      }
    },
  },
  methods: {
    getAlarmsOfGroup(group) {
      return this.siteAlarms.filter(a => {
        const isTenantSpecificAlarm =
          powerAlarms.includes(a.id) ||
          tenetSpeceficAlams.includes(a.id) ||
          (this.isScl && a.id === SITE_ALARM.RECTIFIER_FAIL)
        const isAlarmOfFocusedTenant = isTenantSpecificAlarm
          ? (a.tenant || SITE_TENANT.BANGLALINK) === this.focusedTenant
          : true
        return a.group === group && isAlarmOfFocusedTenant
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
