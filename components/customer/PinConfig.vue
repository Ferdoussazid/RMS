<template>
  <tr class="flex w-full space-x-4 px-4 text-left">
    <td class="w-24">
      <select v-model="info.pin_name"
        class="form-select w-full rounded border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm">
        <option value="am1">AM1</option>
        <option value="am2">AM2</option>
        <option value="am3">AM3</option>
        <option value="am4">AM4</option>
        <option value="am5">AM5</option>
        <option value="am6">AM6</option>
        <option value="am7">AM7</option>
        <option value="am8">AM8</option>
        <option value="am9">AM9</option>
        <option value="am10">AM10</option>
        <option value="am11">AM11</option>
        <option value="am12">AM12</option>
        <option value="am13">AM13</option>
        <option value="dm1">DM1</option>
        <option value="dm2">DM2</option>
        <option value="dm3">DM3</option>
        <option value="dm4">DM4</option>
        <option value="dm5">DM5</option>
        <option value="dm6">DM6</option>
        <option value="dm7">DM7</option>
        <option value="dm8">DM8</option>
        <option value="dm9">DM9</option>
        <option value="dm10">DM10</option>
        <option value="dm11">DM11</option>
        <option value="dm12">DM12</option>
        <option value="dm13">DM13</option>
        <option value="dm14">DM14</option>
      </select>
    </td>
    <td class="w-56">
      <select v-model="info.type"
        class="form-select w-full rounded border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm">
        <option value="">Select A Service</option>
        <option v-for="(item, i) in filteredPins" :key="i" :value="item.value">{{ item.label }}</option>
      </select>
    </td>
    <td class="w-40">
      <select v-model="info.tenant"
        class="form-select w-full rounded border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm">
        <option value="banglalink">Banglalink</option>
        <option value="robi">Robi</option>
        <option value="grameenphone">Grameenphone</option>
        <option value="teletalk">Teletalk</option>
        <option value="scom_rect_1">SComm Rect 1</option>
        <option value="scom_rect_2">SComm Rect 2</option>
        <option value="">No Operator</option>
      </select>
    </td>
    <td class="w-28">
      <input v-model="info.factor" type="text"
        class="w-full rounded-md border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
        placeholder="Factor" />
    </td>
    <td class="w-28">
      <input v-model="info.offset" type="text"
        class="w-full rounded-md border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
        placeholder="Offset" />
    </td>
    <td class="w-52">
      <input v-model="info.label" type="text"
        class="w-full rounded-md border-gray-200 bg-gray-50 px-4 py-2 text-xs font-normal text-gray-800 placeholder-gray-500 shadow-sm"
        placeholder="Optional Name" />
    </td>
    <td class="flex w-44 gap-2">
      <button v-if="needSaving"
        class="rounded bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600" @click="save">
        <i v-if="updating" class="fas fa-circle-notch fa-spin"></i>
        <i v-else class="fas fa-check"></i>
        Save
      </button>
      <button class="rounded bg-gray-300 px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-400"
        @click="remove">
        <i v-if="deleting" class="fas fa-circle-notch fa-spin"></i>
        <i v-else class="fas fa-times"></i>
        Delete
      </button>
    </td>
  </tr>
</template>

<script>
import { ANALOG_SERVICES, PIN_SERVICE_LIST, tenantRequiredPinTypes } from '~/assets/js/Constant';

export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    deleting: false,
    updating: false,
    info: {
      pin_name: '',
      type: '',
      tenant: '',
      factor: 1.0,
      offset: 0.0,
      label: '',
    },
    tenantRequiredPinTypes,
    needSaving: false,
    pins: PIN_SERVICE_LIST,
    filteredPins: PIN_SERVICE_LIST,
  }),
  watch: {
    info: {
      handler(val, old) {
        this.needSaving = true
        if (!this.info.pin_name) return
        //const filteredData = this.pins.filter(pin => val.pin_name.includes("dm") ? !this.isAnalogPin(pin.value) : this.isAnalogPin(pin.value))

        this.filteredPins = PIN_SERVICE_LIST
      },
      deep: true,
    },

  },
  mounted() {
    this.setupForm()
    setTimeout(() => {
      this.needSaving = false
    }, 300)
  },
  methods: {
    isAnalogPin(pin_name) {
      return ANALOG_SERVICES.includes(pin_name)
    },

    setupForm() {
      this.info = { ...this.config }
      if (this.config.type === 'main_phase' && this.config.priority === 'primary') {
        this.info.type = 'main_phase_a'
      } else if (this.config.type === 'main_phase' && this.config.priority === 'secondary') {
        this.info.type = 'main_phase_b'
      } else if (this.config.type === 'main_phase' && this.config.priority === 'tertiary') {
        this.info.type = 'main_phase_c'
      } else if (this.config.type === 'battery_current' && this.config.priority === 'critical') {
        this.info.type = 'battery_current_critical'
      } else if (this.config.type === 'battery_current' && this.config.priority === 'non-critical') {
        this.info.type = 'battery_current_non_critical'
      } else if (this.config.type === 'access_control' && this.config.priority === 'door') {
        this.info.type = 'door_status'
      } else if (this.config.type === 'access_control' && this.config.priority === 'lock') {
        this.info.type = 'lock_status'
      }
      if (this.config.tenant === null) {
        this.info.tenant = ''
      }
    },

    async save() {
      if (this.updating) return
      if (!this.info.type || !this.info.pin_name) {
        this.$toast.error('Please select a pin and service')
        return
      }
      if (this.tenantRequiredPinTypes.includes(this.info.type) && !this.info.tenant) {
        this.$toast.error('Please select tenant for power specific pins!')
        return
      }
      this.updating = true
      try {
        const res = await this.$store.dispatch('customer/savePinConfig', this.getFormattedData())
        this.$store.dispatch('customer/updatePinConfig', res)
        this.needSaving = false
      } catch (error) {
        this.$toast.error('Error updating the pin')
      }
      this.updating = false
    },

    async remove() {
      try {
        if (this.deleting) return
        if (confirm('Are you sure you want to remove this pin ?')) {
          this.deleting = true
          await this.$store.dispatch('customer/removePinConfig', this.config.id)
        }
      } catch (error) {
        this.$toast.error(error.response.message)
      }
      await this.$store.dispatch('customer/getSiteConfig', { site_uid: this.config.site_uid })
      this.deleting = false
    },
    getFormattedData() {
      const data = { ...this.info, priority: null }
      switch (data.type) {
        case 'main_phase_a':
          data.type = 'main_phase'
          data.priority = 'primary'
          break
        case 'main_phase_b':
          data.type = 'main_phase'
          data.priority = 'secondary'
          break
        case 'main_phase_c':
          data.type = 'main_phase'
          data.priority = 'tertiary'
          break
        case 'battery_current_critical':
          data.type = 'battery_current'
          data.priority = 'critical'
          break
        case 'battery_current_non_critical':
          data.type = 'battery_current'
          data.priority = 'non-critical'
          break
        case 'door_status':
          data.type = 'access_control'
          data.priority = 'door'
          break
        case 'lock_status':
          data.type = 'access_control'
          data.priority = 'lock'
          break
        default:
          break
      }
      return data
    },
  },
}
</script>

<style lang="scss" scoped></style>
