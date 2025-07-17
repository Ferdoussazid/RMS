import { readOnlyUserEvents } from '~/assets/js/AlarmHelper'
import { RMS_USER, USER_TYPE } from '~/assets/js/Constant'
import { getSiteEventNameFromAlarm } from '~/assets/js/Helper'

export default {
  data() {
    return {
      companyRoles: [
        USER_TYPE.COMPANY,
        USER_TYPE.EMPLOYEE,
        USER_TYPE.READ_ONLY,
        USER_TYPE.SUPERUSER,
        USER_TYPE.FINANCE,
      ],
      adminRoles: [USER_TYPE.SUDO, USER_TYPE.SUPPORT],
      RmsUser: [RMS_USER.SUMMIT_COM],
    }
  },
  computed: {
    isCompanyUser() {
      return this.companyRoles.includes(this.$auth?.user?.type)
    },
    isRmsUser() {
      if (this.$auth.user?.meta && this.$auth.user.meta.accessRoles) {
        return !this.$auth.user.meta.accessRoles.includes('acs') && this.$auth.user.meta.accessRoles.includes('rms')
      }
    },
    isAdminUser() {
      return this.adminRoles.includes(this.$auth?.user?.type)
    },
    isScl() {
      // SCL = summit com
      return this.$auth?.user?.company_id === 30
    },
    isStl() {
      // SCL = summit com
      return this.$auth?.user?.company_id === 27
    },
    isSudoUser() {
      return this.$auth.user.type === USER_TYPE.SUDO
    },
    isOpsUser() {
      return this.$auth.user.type === USER_TYPE.SUPPORT
    },
    isSuperUser() {
      return this.$auth.user.type === USER_TYPE.SUPERUSER
    },
    isFinanceUser() {
      return this.$auth.user.type === USER_TYPE.FINANCE
    },
    isReadOnlyUser() {
      const userRole = this._.get(this.$auth.user, 'type', USER_TYPE.READ_ONLY)
      return userRole === USER_TYPE.READ_ONLY && this.readOnlyUserTenants && this.readOnlyUserTenants.length === 1
    },
    isSystemReadOnlyUser() {
      const userRole = this._.get(this.$auth.user, 'type', USER_TYPE.READ_ONLY)
      return userRole === USER_TYPE.READ_ONLY && !this.readOnlyUserTenants
    },
    readOnlyUserTenants() {
      return this._.get(this.$auth.user, 'tenants', null)
    },
    visibleTenants() {
      return this.$auth.user.tenants || 'all'
    },
    canAccessTelegram() {
      if (this.$auth.user?.meta && this.$auth.user.meta.accessRoles) {
        return this.$auth.user.meta.accessRoles.includes('telegram')
      }

      return false
    },
    canAccessAcs() {
      if (this.$auth.user.type === USER_TYPE.SUDO) return true
      if (this.$auth.user?.meta && this.$auth.user.meta.accessRoles) {
        return this.$auth.user.meta.accessRoles.includes('acs')
      }

      return false
    },
    canAccessRms() {
      if (this.$auth.user.type === USER_TYPE.SUDO) return true
      if (this.$auth.user?.meta && this.$auth.user.meta.accessRoles) {
        return this.$auth.user.meta.accessRoles.includes('rms')
      }

      return false
    },
    canAccessUserManagement() {
      if (this.$auth.user.type === USER_TYPE.SUDO) return true
      if (this.$auth.user?.meta && this.$auth.user.meta.accessRoles) {
        return this.$auth.user.meta.accessRoles.includes('manage_users')
      }

      return false
    },
    canAccessLegacyDashboard() {
      if (this.$auth.user?.meta && this.$auth.user.meta.accessRoles) {
        return this.$auth.user.meta.accessRoles.includes('legacy')
      }

      return false
    },
    canAccessAlarmSettings() {
      if (this.$auth.user.type === USER_TYPE.SUDO) return true
      if (this.$auth.user?.meta && this.$auth.user.meta.accessRoles) {
        return this.$auth.user.meta.accessRoles.includes('alarm_settings')
      }

      return false
    },
  },

  methods: {
    getPermissionStatus(action) {
      if (this.isSystemReadOnlyUser || this.isReadOnlyUser) {
        this.$toast.error(`Sorry! You don't have the necessary permission to ${action}.`)
        return false
      }
      return true
    },
    isReadOnlyAlarm(alarm) {
      const eventName = getSiteEventNameFromAlarm(alarm.id)
      return readOnlyUserEvents.includes(eventName)
    },
  },
}
