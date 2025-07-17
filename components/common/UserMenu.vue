<template>
  <div class="flex flex-col justify-between grow">
    <ul class="grow">
      <MenuCategory name="Menu" />
      <MenuItem name="Dashboard" tag="/dashboard" icon="fas fa-chart-pie" :url="dashboardUrl"
        :in-site-specific-route="false" />
      <MenuItem name="Map" tag="/site/map" icon="fas fa-map-marked-alt" url="/site/map"
        :in-site-specific-route="false" />
      <MenuItem name="All Sites" tag="/site/list" icon="fas fa-sitemap" url="/site/list"
        :in-site-specific-route="false" />
      <MenuItem name="Site Availability" tag="/site/availability" icon="fas fa-signal" url="/site/availability"
        :in-site-specific-route="false" />
      <MenuItem name="Site Overview" :in-site-specific-route="isVisitingSiteSpecificRoute" icon="fas fa-broadcast-tower"
        url="/site" />
      <MenuItem v-if="canAccessAcs" name="Manage Access" tag="/access/manage" icon="fas fa-user-lock"
        url="/access/manage" :in-site-specific-route="false" />
      <MenuItem v-if="isSuperUser || canAccessUserManagement" name="User Management" tag="/user/list"
        icon="fas fa-users" url="/user/list" />
      <MenuItem v-if="canAccessTelegram" name="Telegram" tag="/telegram" icon="fab fa-telegram-plane" url="/telegram"
        :in-site-specific-route="false" />

      <!-- <MenuItem
        v-if="!isReadOnlyUser"
        name="Tickets"
        tag="/ticket"
        icon="fas fa-clipboard-list"
        url="/ticket"
        :in-site-specific-route="false"
      /> -->
      <MenuItem name="Analytics" tag="/analytics" icon="fas fa-chart-bar" url="/analytics"
        :in-site-specific-route="false" />
      <MenuItem v-if="isSuperUser || isFinanceUser" name="Payment List" tag="/billing/list" icon="fas fa-coins"
        url="/billing/list" :in-site-specific-route="false" />
      <!-- <MenuItem name="Device Health" tag="health" icon="fas fa-microchip" url="/health" /> -->
    </ul>
    <audio ref="alarmSound" :src="alarmSource" loop="true"></audio>
    <button v-if="isEmergencyAlarmActive"
      class="flex items-center justify-center px-4 py-3 mx-5 my-4 space-x-2 text-white transition duration-300 bg-red-500 rounded shadow-lg cursor-pointer group hover:bg-red-600"
      @click="onAlarmSoundStop">
      <i class="fas fa-volume-mute"></i>
      <span class="text-xs font-medium">Stop Alarm Sound</span>
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  data() {
    return {
      isEmergencyAlarmActive: false,
      alarmSource: '/audio/danger-alarm.mp3',
      siteSpecificRoutes: [
        '/site',
        '/alarm',
        '/oem/data',
        '/access',
        '/mains',
        '/battery',
        '/generator',
        '/temperature',
        '/report',
        '/settings',
      ],
    }
  },
  computed: {
    ...mapGetters('user', ['allowedTenants']),

    isVisitingSiteSpecificRoute() {
      return this.siteSpecificRoutes.includes(this.$route.path)
    },
    dashboardUrl() {
      if (this.isReadOnlyUser) {
        return `/dashboard/${this.allowedTenants[0]}`
      } else {
        return '/dashboard/business'
      }
    },
    issclient() {
      return this.$a
    }
  },

  mounted() {
    this.$bus.$on('emergency-alarm', this.onEmergencyAlarmTrigger)
  },
  methods: {
    onAlarmSoundStop() {
      this.$refs.alarmSound.pause()
      this.isEmergencyAlarmActive = false
      this.$bus.$emit('drawer', 'close')
    },
    onEmergencyAlarmTrigger(event) {
      this.$refs.alarmSound.play()
      this.isEmergencyAlarmActive = true
    },
  },
}
</script>

<style lang="scss" scoped></style>
