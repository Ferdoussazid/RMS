<template>
  <div class="flex flex-col w-full">
    <AppToolbar title="Settings"></AppToolbar>
    <SiteTabMenu class="mt-2" />
    <div class="flex flex-col w-full p-6 bg-white rounded-lg md:rounded-t-none">
      <span class="text-xs font-normal text-slate-600">Settings & Thresholds specific to this site</span>
      <div class="flex flex-col w-full mt-4 border divide-y rounded-md divide-slate-200 border-slate-200">
        <DCVoltageSetting />
        <DCCriticalSetting />
        <DCBackupSetting />
        <TemperatureSetting />
        <SMSAlertNumbersSetting />
        <LoadThresholdSetting v-for="(tenant, i) in tenants" :key="'threshold' + i" :tenant="tenant" />
        <INCStatusSetting v-for="(tenant, j) in tenants" :key="'inc' + j" :tenant="tenant" />
        <RectifierStatusSetting title="Rectifier-1 Integration Status" :rectifier="rectifier1" :position="1" />
        <RectifierStatusSetting title="Rectifier-2 Integration Status" :rectifier="rectifier2" :position="2" />
        <BMSStatusSetting />
        <BluetoothLockStatusSetting v-if="!isRmsUser" />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { SITE_TENANT } from '~/assets/js/Constant'
  import { filterAllowedTenantsOfSite } from '~/assets/js/SiteHelper'
  import UserTypeChecker from '~/mixins/UserTypeChecker'

  export default {
    mixins: [UserTypeChecker],
    middleware: ['auth', 'setup'],
    data: () => ({
      loading: true,

    }),
    computed: {
      ...mapGetters('site', ['siteConfig',]),
      ...mapGetters('user', ['rootUserUid', 'allowedTenants']),
      ...mapGetters('settings', ['siteSettings']),
      tenants() {
        const siteTenants = this._.uniq(
          this.siteConfig.pinConfigs
            .filter(p => p.type === 'battery_terminal')
            .map(p => p.tenant || SITE_TENANT.BANGLALINK)
        )
        return filterAllowedTenantsOfSite(siteTenants, this.allowedTenants)
      },
      rectifierOptions() {
        const rectifierData = this.siteSettings?.rectifier || {}
        const result = [];
        // Check for the first rectifier
        if (rectifierData.rectifier_type) {
          result.push({
            rectifier_type: rectifierData.rectifier_type,
            rectifier_version: rectifierData.rectifier_version,
            rectifier_tenant: rectifierData.rectifier_tenant,
            position: 1,
          });
        }
        // Check for the second rectifier
        if (rectifierData.rectifier_type_2) {
          result.push({
            rectifier_type: rectifierData.rectifier_type_2,
            rectifier_version: rectifierData.rectifier_version_2,
            rectifier_tenant: rectifierData.rectifier_tenant_2,
            position: 2,
          });
        }
        return result;

      },
      rectifier1() {
        return this.rectifierOptions.find(r => r.position === 1) || {}
      },
      rectifier2() {
        return this.rectifierOptions.find(r => r.position === 2) || {}
      },
    },
    mounted() {
      this.fetchSettings()
    },
    methods: {
      async fetchSettings() {
        this.loading = true
        try {
          const query = {
            site_uid: this.siteConfig.siteUid,
            user_uid: this.rootUserUid,
            page: 1,
            limit: 1,
          }
          await this.$store.dispatch('settings/fetchSiteSettings', query)
        } catch (error) {
          // console.log('error', error)
        }
        this.loading = false
      },
    },
  }
</script>

<style lang="scss" scoped></style>
