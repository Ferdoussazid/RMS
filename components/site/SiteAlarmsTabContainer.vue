<template>
  <div class="w-full">
    <div v-if="loading" class="flex items-center justify-center py-[15vh]">
      <CircularSpinner size="lg" />
    </div>
    <div v-if="!loading" class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      <AlarmGroup name="Power" :alarms="getAlarmsOfGroup('power')" theme="p-4" :events="lastEvents" />
      <AlarmGroup :masked="isReadOnlyUser" name="Env & Others" :alarms="getAlarmsOfGroup('env')" theme="p-4"
        :events="lastEvents" />
      <AlarmGroup v-if="!isRmsUser" :masked="isReadOnlyUser" name="Access" :alarms="getAlarmsOfGroup('access')"
        theme="p-4" :events="lastEvents" />
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { checkAlarmInclusivity } from '~/assets/js/SiteHelper'
  import UserTypeChecker from '~/mixins/UserTypeChecker'

  export default {
    mixins: [UserTypeChecker],
    props: {
      alarms: {
        type: Array,
        required: true,
      },
      lastEvents: {
        type: Array,
        required: true,
      },
    },
    computed: {
      ...mapGetters('site', {
        loading: 'alarmsLoading',
      }),
      ...mapGetters('user', ['allowedTenants']),
    },
    methods: {
      getAlarmsOfGroup(group) {
        return this.alarms.filter(a => {
          const isGroup = a.group === group
          const isTenant = checkAlarmInclusivity(a, this.allowedTenants)
          if (this.isReadOnlyUser) {
            return isGroup && isTenant && this.isReadOnlyAlarm(a)
          }
          return isGroup && isTenant
        })
      },
    },
  }
</script>

<style lang="scss" scoped></style>
