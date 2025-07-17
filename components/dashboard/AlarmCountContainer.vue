<template>
  <div class="flex flex-col w-full overflow-hidden bg-white">
    <div :class="isRmsUser ? 'grid-cols-9' : 'grid-cols-12'"
      class="grid h-full p-4 divide-y divide-slate-200 md:divide-y-0 md:divide-x">
      <AlarmCountGroup title="Power" :alarms="firstPowerAlarms" />
      <AlarmCountGroup title="Power" :alarms="secondPowerAlarms" />
      <AlarmCountGroup title="Env & Others" :alarms="envAlarms" />
      <AlarmCountGroup v-if="!isRmsUser" title="Access" :alarms="accessAlarms" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { alarmFilterGroups } from '~/assets/js/AlarmHelper'
import { COMPANY, INSTALLED_TENANTS, SCOMM_TENANTS } from '~/assets/js/Constant'
import { getCompanySpecificAlarmLabel, getTenantLabel } from '~/assets/js/Helper'
import { SCOMM_POWER_ALARM } from '~/assets/js/SCommAlarmHelper'
import UserTypeChecker from '~/mixins/UserTypeChecker'
import utils from '~/mixins/utils'

export default {
  mixins: [utils, UserTypeChecker],
  computed: {
    ...mapGetters('user', ['companyName']),
    ...mapGetters('dashboard', ['selectedTenant']),
    powerAlarms() {
      if (this.companyName === COMPANY.SUMMIT_COM) {
        return this.getMappedAlarms(SCOMM_POWER_ALARM.items.filter(item => {
          if (item.tenant) {
            if (this.selectedTenant) {
              return item.tenant === this.selectedTenant
            }
            return Object.keys(SCOMM_TENANTS).includes(item.tenant)
          }
          return true
        }))
      } else {
        return this.getMappedAlarms(
          alarmFilterGroups[0].items.filter(item => {
            if (item.tenant) {
              if (this.selectedTenant) {
                return item.tenant === this.selectedTenant
              }
              return this.companyName === COMPANY.SUMMIT_COM ? Object.values(SCOMM_TENANTS).includes(item.tenant) : INSTALLED_TENANTS.includes(item.tenant)
            }
            return true
          })
        )
      }

    },
    isFTB() {
      return this.companyName === COMPANY.FRONTIER_TOWERS_BD
    },
    firstPowerAlarms() {
      if (this.isFTB && this.selectedTenant) {
        return this.powerAlarms.slice(0, 5)
      }
      if (this.isScl && this.selectedTenant) {
        return this.powerAlarms.slice(0, 5)
      } else if (this.isScl) {
        return this.powerAlarms.slice(0, 7)
      }
      return this.powerAlarms.slice(0, 9)
    },
    secondPowerAlarms() {
      if (this.isFTB && this.selectedTenant) {
        return this.powerAlarms.slice(5, this.powerAlarms.length)
      }
      if (this.isScl && this.selectedTenant) {
        return this.powerAlarms.slice(5, this.powerAlarms.length)
      } else if (this.isScl) {
        return this.powerAlarms.slice(7, this.powerAlarms.length)
      }
      return this.powerAlarms.slice(9, this.powerAlarms.length)
    },
    envAlarms() {
      return alarmFilterGroups[2].items
    },
    accessAlarms() {
      return alarmFilterGroups[1].items
    },
  },
  methods: {
    getMappedAlarms(alarms) {
      return alarms.map(alarm => {
        let label = getCompanySpecificAlarmLabel(this.companyName, alarm.id)
        if (label) {
          label = `${label} (${getTenantLabel(alarm.tenant)})`
        } else {
          label = alarm.label
        }
        return { ...alarm, label }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
