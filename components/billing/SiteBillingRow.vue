<template>
  <tr :class="theme">
    <td class="border border-gray-300 px-4 py-2">{{ row.site_name }}</td>
    <td class="border border-gray-300 px-4 py-2">{{ row.device_id }}</td>
    <td class="border border-gray-300 px-4 py-2">{{ formatDate(row.submission_at) }}</td>
    <td class="border border-gray-300 px-4 py-2">{{ formatDate(row.payment_at) }}</td>
    <td class="border border-gray-300 px-4 py-2">{{ row.amount }}</td>
    <td class="border border-gray-300 px-4 py-2">
      <span class="rounded-lg p-1 text-xs font-semibold uppercase" :class="statusTheme">
        {{ statusLabel }}
      </span>
    </td>
    <td class="border border-gray-300 px-4 py-2">{{ row.invoice || '' }}</td>
    <td class="border border-gray-300 px-4 py-2">{{ row.po || '' }}</td>
    <td v-if="isExtended" class="border border-gray-300 px-4 py-2">{{ row.issued_by || '' }}</td>
  </tr>
</template>

<script>
import { format } from 'date-fns'
import { PAYMENT_RESPONSE, PAYMENT_STATUS } from '~/assets/js/Constant'

export default {
  props: {
    row: {
      type: Object,
      required: true,
    },
    isExtended: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    theme() {
      switch (this.row?.response_status) {
        case PAYMENT_RESPONSE.UPDATED:
          return 'bg-green-100'
        case PAYMENT_RESPONSE.INVALID:
          return 'bg-red-100'
        case PAYMENT_RESPONSE.DUPLICATE:
          return 'bg-yellow-100'
        default:
          return 'bg-white'
      }
    },
    statusLabel() {
      switch (this.row?.status) {
        case PAYMENT_STATUS.PENDING:
          return 'Pending'
        case PAYMENT_STATUS.COMPLETE:
          return 'Complete'
        case PAYMENT_STATUS.FAILED:
          return 'Failed'
        default:
          return ''
      }
    },
    statusTheme() {
      switch (this.row?.status) {
        case PAYMENT_STATUS.PENDING:
          return 'border-2 border-orange-500 text-orange-500'
        case PAYMENT_STATUS.COMPLETE:
          return 'border-2 border-green-500 text-green-500'
        case PAYMENT_STATUS.FAILED:
          return 'border-2 border-red-500 text-red-500'
        default:
          return 'border-2 border-slate-500 text-slate-500'
      }
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return ''
      return format(new Date(date), 'd MMM Y')
    },
  },
}
</script>

<style lang="scss" scoped></style>
