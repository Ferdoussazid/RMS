<template>
  <div class="flex items-stretch py-1">
    <div class="flex w-1/12 items-center p-2">
      <span class="text-sm font-normal">{{ rectifierType }}</span>
    </div>
    <div class="flex w-1/12 items-center p-2">
      <span class="text-sm font-normal">{{ registerType }}</span>
    </div>
    <div class="flex w-1/12 items-center p-2">
      <span class="text-sm font-normal">{{ startLocation }}</span>
    </div>
    <div class="flex w-1/12 items-center p-2">
      <span class="text-sm font-normal">{{ endLocation }}</span>
    </div>
    <div class="flex w-1/12 items-center py-2 pl-4">
      <span class="text-sm font-normal">{{ receivedValue }}</span>
    </div>
    <div class="flex w-1/12 items-center p-2">
      <span class="text-sm font-normal">{{ proportion }}</span>
    </div>
    <div class="flex w-1/12 items-center p-2">
      <span class="text-sm font-normal">{{ calculatedValue }}</span>
    </div>

    <div class="flex w-2/12 items-center p-2">
      <span class="text-sm font-normal">{{ content }}</span>
    </div>
    <div class="flex w-1/12 items-center p-2">
      <span :class="[statusTextColor]" class="text-sm font-normal">{{ status }}</span>
    </div>
    <div class="flex w-2/12 items-center p-2">
      <span class="text-sm font-normal">{{ createdAt }}</span>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import { mapGetters } from 'vuex'

export default {
  middleware: ['auth'],
  props: {
    id: {
      type: Number,
      required: true,
    },
    record: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters('site', ['siteUid2Name']),
    content() {
      return this._.get(this.record, 'content', '')
    },
    receivedValue() {
      return this._.get(this.record, 'received_value', '')
    },
    proportion() {
      return this._.get(this.record, 'proportion', '')
    },
    calculatedValue() {
      return this._.get(this.record, 'calculated_value', '')
    },
    startLocation() {
      return this._.get(this.record, 'start_location', '')
    },
    endLocation() {
      return this._.get(this.record, 'end_location', '')
    },
    registerType() {
      return this._.get(this.record, 'register_type', '')
    },
    rectifierType() {
      return this._.get(this.record, 'rectifier_type', '')
    },
    status() {
      return this._.get(this.record, 'status', '')
    },
    statusTextColor() {
      if (this.status) {
        return +this.calculatedValue === 0 && this.registerType === 'cr' ? 'text-blue-500' : 'text-red-500'
      } else {
        return ''
      }
    },
    createdAt() {
      const time = this._.get(this.record, 'created_at', '')
      if (time) {
        return format(new Date(time), 'h:mm a, d MMM yy')
      } else {
        return time
      }
    },
  },
}
</script>
