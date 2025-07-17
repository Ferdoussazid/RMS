<template>
  <div class="grid w-full grid-cols-1 gap-5 p-4 md:grid-cols-2">
    <SiteLabeledInfo icon="/icon/tower.png" label="Generic Site ID" :title="siteName" />
    <SiteLabeledInfo :icon="companyLogo" :label="companyLabel" :title="dash.get(site, 'meta.towerco_site_id', '')" />
    <SiteLabeledInfo
      v-for="(tenant, i) in tenants"
      :key="i"
      :icon="getTenantIcon(tenant)"
      :label="getTenantSiteIDLabel(tenant)"
      :title="getTenantSiteID(tenant)"
    />
    <SiteLabeledInfo icon="/icon/location.png" label="Latitude, Longitude" :title="latLngTitle" />
    <SiteLabeledInfo icon="/icon/house.png" label="Address" :title="dash.get(site, 'place.address', '')" />
    <SiteLabeledInfo icon="/icon/zone.png" label="Thana, District, Division" :title="zoneTitle" />
    <SiteLabeledInfo icon="/icon/area-map.png" :label="clusterLabel" :title="clusterTitle" />
    <SiteLabeledInfo icon="/icon/tower.png" label="Site Type" :title="dash.get(site, 'meta.site_type', '')" />
    <SiteLabeledInfo
      icon="/icon/technical-support.png"
      label="Contact Person"
      :title="dash.get(site, 'contact.name', '')"
      :caption="dash.get(site, 'contact.phone', '')"
    />
    <SiteLabeledInfo icon="/icon/chip.png" label="Device ID" :title="dash.get(site, 'device_id', '')" />
    <SiteLabeledInfo icon="/icon/version.png" label="Device Version" :title="dash.get(site, 'device_version', '')" />
    <SiteLabeledInfo icon="/icon/inverter.png" label="Device Vendor" :title="deviceVendor" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCompanyLabel, getCompanyLogo, getDeviceVendorName, getTenantLabel, getTenantLogo } from '~/assets/js/Helper'
import { COMPANY } from '~/assets/js/Constant'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  mixins: [UserTypeChecker],
  props: {
    site: {
      type: Object,
      default: null,
    },
    showSingleTenant: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      dash: require('lodash'),
    }
  },

  computed: {
    ...mapGetters('user', ['rootUserUid', 'companyName']),
    ...mapGetters('site', ['focusedTenant']),
    ...mapGetters('device-vendor', ['device_vendors']),
    siteName() {
      return this._.get(this.site, 'meta.generic_site_id', '')
    },
    companyLogo() {
      return getCompanyLogo(this.companyName)
    },
    companyLabel() {
      return getCompanyLabel(this.companyName) + ' Site ID'
    },
    deviceVendor() {
      return getDeviceVendorName(this._.get(this.site, 'device_vendor', null), this.device_vendors)
    },
    telecomSiteIds() {
      return this._.get(this.site, 'meta.telecom_site_ids', [])
    },
    tenants() {
      if (this.showSingleTenant || this.isReadOnlyUser) {
        return [this.focusedTenant]
      }
      return this.telecomSiteIds.map(id => id.tenant)
    },
    zoneTitle() {
      const label = [
        this._.get(this.site, 'place.thana', ''),
        this._.get(this.site, 'place.district', ''),
        this._.get(this.site, 'place.division', ''),
      ]
        .filter(v => !!v.trim())
        .join(', ')
      return label || 'No Zone Found'
    },
    clusterLabel() {
      if (this.companyName === COMPANY.SUMMIT_TOWERS_LTD) {
        return 'RIO, SC'
      }
      return 'Cluster, Zone'
    },
    clusterTitle() {
      const cluster = this._.get(this.site, 'place.cluster', '')
      const zone = this._.get(this.site, 'place.zone', '')
      if (!cluster && !zone) {
        return 'No Cluster Found'
      }
      return `${cluster || 'N/A'}, ${zone || 'N/A'}`
    },
    latLngTitle() {
      const lat = this._.get(this.site, 'location.coordinates[1]', '')
      const lng = this._.get(this.site, 'location.coordinates[0]', '')
      if (!lng && !lng) {
        return 'No Lat/Long Found'
      }
      return `${lat || 'N/A'}, ${lng || 'N/A'}`
    },
  },
  methods: {
    getTenantIcon(tenant) {
      return getTenantLogo(tenant)
    },
    getTenantSiteIDLabel(tenant) {
      const label = `${getTenantLabel(tenant)} Site ID`
      return label
    },
    getTenantSiteID(tenant) {
      const siteID = this.telecomSiteIds.find(id => id.tenant === tenant)
      return siteID ? siteID.id : ''
    },
  },
}
</script>

<style lang="scss" scoped></style>
