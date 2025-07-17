<template>
  <div class="flex w-full flex-col gap-2">
    <AppToolbar title="Site Information Edit" :with-site-id="false" />
    <div class="flex min-h-[80vh] w-full flex-col items-center rounded bg-white p-4">
      <div v-if="loading" class="flex h-full w-full flex-col items-center justify-center md:w-3/4 lg:w-5/12">
        <CircularSpinner />
      </div>
      <div v-if="!loading" class="flex w-full flex-col items-start justify-center gap-4 md:w-3/4 lg:w-7/12">
        <span class="mx-0 w-full text-base font-semibold lg:mx-auto">Edit Site Information</span>
        <div class="mx-0 grid w-full grid-cols-12 gap-4 lg:mx-auto">
          <FixedLabelInput
            v-model="form.name"
            label="Site Name"
            placeholder="Ex: Factory building 1"
            class="col-span-12 md:col-span-4"
          />
          <FixedLabelInput
            v-model="form.generic_id"
            label="Generic ID"
            placeholder="Ex: BN005"
            class="col-span-12 md:col-span-4"
          />
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4">
            <span class="text-xs font-medium text-gray-700">Site Type</span>
            <select
              v-model="form.site_type"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[form.site_type ? 'text-sm font-medium text-gray-600' : 'text-sm font-light text-gray-400']"
            >
              <option value="" disabled selected>Select a Type</option>
              <option v-for="t in types" :key="t.id" class="text-sm text-gray-800" :value="t.value">
                {{ t.name }}
              </option>
            </select>
          </div>

          <FixedLabelInput
            v-model="form.towerco_id"
            label="Towerco ID"
            placeholder="Ex: RMS_001"
            class="col-span-12 md:col-span-4"
          />
          <FixedLabelInput
            v-model="form.lat"
            label="Latitude"
            placeholder="Ex: 23.837976"
            class="col-span-12 md:col-span-4"
          />
          <FixedLabelInput
            v-model="form.lng"
            label="Longitude"
            placeholder="Ex: 90.369762"
            class="col-span-12 md:col-span-4"
          />
          <FixedLabelInput
            v-model="form.device_id"
            label="Device ID"
            placeholder="Ex: RM-01-0001"
            class="col-span-12 md:col-span-4"
          />
          <FixedLabelInput
            v-model="form.device_version"
            label="Device Version"
            placeholder="Ex: 1.3.5"
            class="col-span-12 md:col-span-4"
          />
          <div class="col-span-12 flex flex-col space-y-1">
            <span class="text-xs font-medium text-gray-700">Telecom IDs</span>
            <div v-for="(telecomId, index) in telecomIds" :key="index" class="col-span-12 grid grid-cols-12 gap-4">
              <div
                class="relative col-span-12 grid grid-cols-12 gap-4 rounded-md border border-slate-300 bg-white/80 p-2 md:col-span-10"
              >
                <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-6">
                  <span class="text-xs font-medium text-gray-700">Tenant</span>
                  <select
                    v-if="!isSummitCommCompany()"
                    v-model="telecomId.tenant"
                    class="form-select col-span-4 h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
                    :class="[telecomId.tenant ? 'text-sm text-gray-800' : 'text-sm font-light text-gray-400']"
                  >
                    <option value="" disabled selected>Select Tenant</option>
                    <option v-for="t in tenants" :key="t.value" class="text-sm text-gray-800" :value="t.value">
                      {{ t.name }}
                    </option>
                  </select>
                  <select
                    v-else
                    v-model="telecomId.tenant"
                    class="form-select col-span-4 h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
                    :class="[telecomId.tenant ? 'text-sm text-gray-800' : 'text-sm font-light text-gray-400']"
                  >
                    <option value="" disabled selected>Select Tenant</option>
                    <option v-for="t in scomm_tenants" :key="t.value" class="text-sm text-gray-800" :value="t.value">
                      {{ t.name }}
                    </option>
                  </select>
                </div>

                <FixedLabelInput
                  v-model="telecomId.id"
                  :label="getTelecomIdLabel(telecomId.tenant)"
                  placeholder="Ex: BN_001"
                  class="col-span-12 md:col-span-6"
                />
                <button
                  v-if="telecomIds.length > 1"
                  class="absolute top-0.5 -right-1.5 cursor-pointer rounded-full bg-red-500 px-1 text-xs font-semibold text-white hover:bg-red-700"
                  @click="removeTelecomIdInput(index)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <button
                v-if="index === telecomIds.length - 1"
                class="col-span-1 cursor-pointer rounded-full p-2 text-2xl font-semibold text-green-500 hover:text-green-700"
                @click="addTelecomIdInput"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4">
            <span class="text-xs font-medium text-gray-700">Division</span>
            <select
              v-model="division_id"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[division_id ? 'text-sm font-medium text-gray-600' : 'text-sm font-light text-gray-400']"
            >
              <option value="" disabled selected>Select Division</option>
              <option v-for="d in divisions" :key="d.id" class="text-sm text-gray-800" :value="d.id">
                {{ d.name }}
              </option>
            </select>
          </div>
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4">
            <span class="text-xs font-medium text-gray-700">District</span>
            <select
              v-model="district_id"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[district_id ? 'text-sm font-medium text-gray-600' : 'text-sm font-light text-gray-400']"
            >
              <option value="" disabled selected>Select District</option>
              <option v-for="d in districts" :key="d.id" class="text-sm text-gray-800" :value="d.id">
                {{ d.name }}
              </option>
            </select>
          </div>
          <FixedLabelInput v-model="form.thana" label="Thana" placeholder="Thana" class="col-span-12 md:col-span-4" />

          <FixedLabelInput
            v-if="!isSummitCommCompany()"
            v-model="form.zone"
            label="Zone"
            placeholder="Ex: Dhaka"
            class="col-span-12 md:col-span-4"
          />
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4" v-else>
            <span class="text-xs font-medium text-gray-700">Zone</span>
            <select
              v-model="form.zone"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[division_id ? 'text-sm text-gray-800' : 'text-sm font-light text-gray-400']"
            >
              <option value="" disabled selected>Select Zone</option>
              <option v-for="d in SCOMM_ZONES" :key="d" class="text-sm text-gray-800" :value="d">
                {{ d }}
              </option>
            </select>
          </div>

          <FixedLabelInput
            v-if="!isSummitCommCompany()"
            v-model="form.cluster"
            label="Cluster"
            placeholder="Ex: Savar"
            class="col-span-12 md:col-span-4"
          />
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4" v-else>
            <span class="text-xs font-medium text-gray-700">Cluster</span>
            <select
              v-model="form.cluster"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[division_id ? 'text-sm text-gray-800' : 'text-sm font-light text-gray-400']"
            >
              <option value="" disabled selected>Select Cluster</option>
              <option v-for="d in SCOMM_CLUSTERS" :key="d" class="text-sm text-gray-800" :value="d">
                {{ d }}
              </option>
            </select>
          </div>
          <FixedLabelInput
            v-model="form.address"
            label="Full Address"
            placeholder="Type full address here"
            class="col-span-12"
          />
          <FixedLabelInput
            v-model="form.contact_person"
            label="Contact Person"
            placeholder="Ex: Mr. Lee"
            class="col-span-12 md:col-span-6"
          />
          <FixedLabelInput
            v-model="form.contact_number"
            label="Contact Number"
            placeholder="Ex: 017XXXXXXXX"
            class="col-span-12 md:col-span-6"
          />
        </div>
        <div class="flex flex-row items-center gap-x-4">
          <button
            class="rounded bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600"
            @click="save"
          >
            <i v-if="updating" class="fas fa-circle-notch fa-spin"></i>
            <i v-else class="fas fa-check"></i>
            Save
          </button>
          <button
            class="rounded bg-gray-300 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-400"
            @click="cancelForm"
          >
            <i class="fas fa-times"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { divisions, districts, upazilas } from '../../../assets/js/BDZones'
import { SITE_TENANT, SCOMM_CLUSTERS, SCOMM_ZONES, SCOMM_TENANTS } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper'

export default {
  middleware: ['auth', 'setup', 'admin'],
  data: () => ({
    divisions,
    updating: false,
    loading: true,
    siteUid: null,
    telecomIds: [{ id: '', tenant: '' }],
    form: {
      name: '',
      generic_id: '',
      telecom_ids: [],
      towerco_id: '',
      device_id: '',
      device_version: '',
      lat: '',
      lng: '',
      contact_person: '',
      contact_number: '',
      address: '',
      thana: '',
      division: '',
      district: '',
      zone: '',
      cluster: '',
      site_type: '',

      user_uid: null,
    },
    SCOMM_CLUSTERS,
    SCOMM_ZONES,
    district_id: '',
    division_id: '',
    types: [
      { id: 1, name: 'GF', value: 'GF' },
      { id: 2, name: 'RTT', value: 'RTT' },
      { id: 3, name: 'RTP', value: 'RTP' },
    ],
    tenants: [
      { id: 1, name: 'Banglalink', value: SITE_TENANT.BANGLALINK },
      { id: 2, name: 'Grameenphone', value: SITE_TENANT.GRAMEENPHONE },
      { id: 3, name: 'Robi', value: SITE_TENANT.ROBI },
      { id: 4, name: 'Teletalk', value: SITE_TENANT.TELETALK },
    ],
    scomm_tenants: Object.keys(SCOMM_TENANTS).map((item, index) => ({
      id: index + 1,
      name: SCOMM_TENANTS[item],
      value: item,
    })),
  }),
  computed: {
    ...mapGetters('site', ['sites']),
    ...mapGetters('user', ['rootUserUid']),
    districts() {
      return districts.filter(dis => +dis.division_id === +this.division_id)
    },
    upazilas() {
      return upazilas.filter(upa => +upa.district_id === +this.district_id)
    },
    site() {
      return this.sites.find(site => +site.uid === +this.$route.query.siteUid) || {}
    },
  },
  watch: {
    division_id(val, old) {
      const model = divisions.find(d => +d.id === +val)
      this.form.division = model.name
      this.districts = districts.filter(d => +d.division_id === +val)
      this.district_id = this.districts[0].id
    },
    district_id(val, old) {
      const model = this.districts.find(d => +d.id === +val)
      this.form.district = model.name
      this.upazilas = upazilas.filter(d => +d.district_id === +val)
      this.thana_id = this.upazilas[0].id
    },
  },
  mounted() {
    this.siteUid = +this.$route.query.siteUid
    this.fillupForm()
  },

  methods: {
    isSummitCommCompany() {
      if (!this.site.user_uid) return false
      return this.site.user_uid === 61288
    },
    getTelecomIdLabel(tenant) {
      return `ID ${tenant ? ` (${getTenantLabel(tenant, false)})` : ''}`
    },
    addTelecomIdInput() {
      this.telecomIds.push({ id: '', tenant: '' })
    },
    removeTelecomIdInput(index) {
      this.telecomIds.splice(index, 1)
    },
    async save() {
      if (this.updating) return
      this.updating = true
      const div = divisions.find(d => d.id === this.division_id)
      this.form.division = this._.get(div, 'name', '')
      const dis = districts.find(d => d.id === this.district_id)
      this.form.district = this._.get(dis, 'name', '')
      this.form.telecom_ids = [...this.telecomIds]
      try {
        this.validateForm()
        await this.$store.dispatch('customer/updateSite', {
          ...this.form,
          site_uid: this.siteUid,
        })
        this.$toast.success('Site updated successfully')
        this.cancelForm()
        await this.updateSiteStatus()
      } catch (error) {
        this.$toast.error(error.message)
      }

      this.updating = false
    },

    async updateSiteStatus() {
      await this.$store.dispatch('site/updateSite', this.siteUid)
    },

    fillupForm() {
      this.loading = true
      this.form = {
        name: this._.get(this.site, 'name', ''),
        generic_id: this._.get(this.site, 'meta.generic_site_id', '') || '',
        telecom_ids: this._.get(this.site, 'meta.telecom_site_ids', '') || [],
        towerco_id: this._.get(this.site, 'meta.towerco_site_id', '') || '',
        device_id: this._.get(this.site, 'device_id', '') || '',
        device_version: this._.get(this.site, 'device_version', '') || '',
        lat: this._.get(this.site, 'location.coordinates[1]', '') + '',
        lng: this._.get(this.site, 'location.coordinates[0]', '') + '',
        contact_person: this._.get(this.site, 'contact.name', '') || '',
        contact_number: this._.get(this.site, 'contact.phone', '') || '',
        address: this._.get(this.site, 'place.address', '') || '',
        thana: this._.get(this.site, 'place.thana', '') || '',
        zone: this._.get(this.site, 'place.zone', ''),
        cluster: this._.get(this.site, 'place.cluster', ''),
        site_type: this._.get(this.site, 'meta.site_type', ''),
      }

      if (this.form.telecom_ids.length) {
        this.telecomIds = [...this.form.telecom_ids]
      }

      const district = this._.get(this.site, 'place.district', '')
      const division = this._.get(this.site, 'place.division', '')

      const matchedDivision = divisions.find(d => d.name === division)
      const matchedDistrict = districts.find(d => d.name === district)

      if (matchedDivision) this.division_id = matchedDivision.id + ''
      if (matchedDistrict)
        setTimeout(() => {
          this.district_id = matchedDistrict.id + ''
        }, 100)
      this.loading = false
    },

    cancelForm() {
      this.$router.push('/customer/sites')
    },

    validateForm() {
      if (!this.form.name) {
        throw new Error('Please enter a site name')
      }
      if (!this.form.lat) {
        throw new Error('Please enter latitutde')
      }
      if (!this.form.lng) {
        throw new Error('Please enter longitude')
      }
      if (!this.form.division) {
        throw new Error('Please select a division')
      }
      if (!this.form.district) {
        throw new Error('Please select a district')
      }
      if (!this.form.thana) {
        throw new Error('Please enter a thana name')
      }
      if (!this.form.zone) {
        throw new Error('Please enter a zone name')
      }
      if (!this.form.cluster) {
        throw new Error('Please enter cluster name')
      }
      if (!this.form.telecom_ids.filter(telecom => telecom.id && telecom.tenant).length) {
        throw new Error('Please add atleast one telecom id')
      }
      if (!this.form.device_id) {
        throw new Error('Please enter a device id')
      }
      if (!this.form.device_version) {
        throw new Error('Please enter a device version')
      }
      const tenantCount = this.telecomIds.reduce((acc, telecom) => {
        if (telecom.id && telecom.tenant) {
          acc[telecom.tenant] = acc[telecom.tenant] ? acc[telecom.tenant] + 1 : 1
        }
        return acc
      }, {})
      for (const key in tenantCount) {
        if (Object.hasOwnProperty.call(tenantCount, key)) {
          if (tenantCount[key] > 1) {
            throw new Error('Duplicate tenant found')
          }
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
