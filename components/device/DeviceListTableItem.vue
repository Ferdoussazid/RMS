<template>
  <tr class="hover:bg-gray-200">
    <td class="">
      <span class="flex items-center justify-center p-2 text-sm font-normal text-gray-900">{{ id }}</span>
    </td>
    <td class="">
      <span class="flex items-center py-3 px-1 text-sm font-semibold text-gray-900">{{ comId }}</span>
    </td>
    <td class="">
      <span class="flex items-center py-3 px-1 text-sm font-normal text-gray-900">{{ phone }}</span>
    </td>
    <td class="">
      <span class="flex items-center py-3 px-1 text-sm font-normal text-gray-900">{{ imei }}</span>
    </td>
    <td class="">
      <span class="flex items-center py-3 px-1 text-sm font-normal text-gray-900">{{ version }}</span>
    </td>
    <td class="">
      <span class="flex items-center py-3 px-1 text-sm font-normal text-gray-900">{{ creationTime }}</span>
    </td>
    <td class="">
      <span class="flex items-center py-3 px-1 text-sm font-medium text-gray-900">{{ site }}</span>
    </td>
    <td class="">
      <span class="flex items-center py-3 px-1 text-sm font-normal text-gray-900">{{ companyName }}</span>
    </td>
  </tr>
</template>

<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'

export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
    device: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('site', ['siteUid2Name']),
    site() {
      return this.siteUid2Name[this.device.site_uid] || ''
    },
    comId() {
      return this._.get(this.device, 'com_id', '')
    },
    phone() {
      return this._.get(this.device, 'phone', '')
    },
    imei() {
      return this._.get(this.device, 'imei', '')
    },
    version() {
      return this._.get(this.device, 'version', '')
    },
    companyName() {
      let company = this._.get(this.device, 'user.company.name', '')
      if (company.trim().toLowerCase() === 'american towerco (ktbl)') {
        company = 'KTBL'
      }
      return company
    },
    creationTime() {
      let time = this._.get(this.device, 'created_at', '')
      if (time) {
        time = format(new Date(time), 'h:mm aaa, d MMM yyyy')
      }
      return time
    },
  },
}
</script>

<style lang="scss" scoped></style>
