<template>
  <div class="flex w-full flex-col gap-2">
    <AppToolbar title="Site Create" :with-site-id="false" />
    <div class="flex min-h-[80vh] w-full flex-col items-center rounded bg-white p-4">
      <div class="flex w-full flex-col items-start justify-center gap-4 md:w-3/4 lg:w-7/12">
        <span class="mx-0 w-full text-base font-semibold lg:mx-auto">Create New Site</span>
        <div class="mx-0 grid w-full grid-cols-12 gap-4 lg:mx-auto">
          <FixedLabelInput
            v-model="form.name"
            label="Site Name"
            placeholder="Ex: Factory building 1"
            class="col-span-12 md:col-span-4"
          />
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4">
            <span class="text-xs font-medium text-gray-700">Company</span>
            <select
              v-model="company"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[company ? 'text-sm  text-gray-600' : 'text-sm font-light text-gray-400']"
            >
              <option value="" disabled selected>Select a Company</option>
              <option v-for="c in companies" :key="c.id" class="text-sm text-gray-800" :value="c">
                {{ c.name }}
              </option>
            </select>
          </div>
          <FixedLabelInput
            v-model="form.generic_id"
            label="Generic ID"
            placeholder="Ex: BN005"
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
            v-model="form.towerco_id"
            label="Towerco ID"
            placeholder="Ex: RMS_001"
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
                  v-if="index > 0"
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
              :class="[division_id ? 'text-sm text-gray-800' : 'text-sm font-light text-gray-400']"
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
              :class="[division_id ? 'text-sm text-gray-800' : 'text-sm font-light text-gray-400']"
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
          <div class="col-span-12 flex grow flex-col items-start space-y-1 md:col-span-4">
            <span class="text-xs font-medium text-gray-700">Site Type</span>
            <select
              v-model="form.site_type"
              class="form-select h-full w-full rounded-md border border-slate-300 bg-white px-4 py-2 shadow-sm"
              :class="[form.site_type ? 'text-sm text-gray-800' : 'text-sm font-light text-gray-400']"
            >
              <option value="">Select a Type</option>
              <option v-for="t in types" :key="t.id" class="text-sm text-gray-800" :value="t.value">
                {{ t.name }}
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
            <i v-if="saving" class="fas fa-circle-notch fa-spin"></i>
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
import { SCOMM_CLUSTERS, SCOMM_TENANTS, SCOMM_ZONES, SITE_TENANT } from '~/assets/js/Constant'
import { getTenantLabel } from '~/assets/js/Helper'
import UserTypeChecker from '~/mixins/UserTypeChecker'

export default {
  middleware: ['auth', 'setup', 'admin'],
  mixins: [UserTypeChecker],
  data: () => ({
    saving: false,
    userUid: null,
    SCOMM_CLUSTERS,
    SCOMM_ZONES,
    divisions,
    districts: [],
    upazilas: [],
    telecomIds: [{ id: '', tenant: '' }],
    company: '',
    form: {
      id: '',
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
    },

    thana_id: '',
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
    ...mapGetters('user', ['rootUserUid']),
    ...mapGetters('customer', ['companies']),
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

  async mounted() {
    await this.$store.dispatch('customer/getCompanyList')
  },

  methods: {
    isSummitCommCompany() {
      if (!this.company) return false
      return this.company.id === 30
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
      if (this.saving) return
      this.saving = true
      const div = divisions.find(d => d.id === this.division_id)
      this.form.division = this._.get(div, 'name', '')
      const dis = districts.find(d => d.id === this.district_id)
      this.form.district = this._.get(dis, 'name', '')
      this.userUid = this._.get(this.company, 'user_uid', null)
      this.form.telecom_ids = this.telecomIds.filter(telecomId => telecomId.id && telecomId.tenant)
      try {
        this.validateForm(this.form)
        await this.$store.dispatch('customer/saveSite', {
          user_uid: this.userUid,
          ...this.form,
        })
        this.$toast.success('Site created successfully')
        this.cancelForm()
      } catch (error) {
        this.$toast.error(error.message)
      }
      this.saving = false
    },

    validateForm({ name, lat, lng, thana, district, division, zone, cluster }) {
      if (!name) {
        throw new Error('Please enter a site name')
      }
      if (!this.userUid) {
        throw new Error('Please select a company')
      }
      if (!lat) {
        throw new Error('Please enter latitude')
      }
      if (!lng) {
        throw new Error('Please enter longitude')
      }
      if (!division) {
        throw new Error('Please select a division')
      }
      if (!district) {
        throw new Error('Please select a district')
      }
      if (!thana) {
        throw new Error('Please enter a thana name')
      }
      if (!zone) {
        throw new Error('Please enter a zone name')
      }
      if (!cluster) {
        throw new Error('Please enter a cluster name')
      }
      if (!this.telecomIds.filter(telecomId => telecomId.id && telecomId.tenant).length) {
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

    cancelForm() {
      this.$router.push('/customer/sites')
    },
  },
}
</script>

<style lang="scss" scoped></style>
