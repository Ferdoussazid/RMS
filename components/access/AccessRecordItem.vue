<template>
  <div class="flex w-full flex-row items-start space-x-2 px-4 py-3">
    <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-teal-500 to-teal-300 p-1.5 shadow-lg">
      <img src="/icon/simcard.png" alt="" />
    </div>
    <div class="flex flex-col space-y-0.5">
      <span class="text-xs font-semibold text-gray-600">{{ cardHolderName }}</span>
      <span class="text-xs font-semibold text-purple-600"><i class="far fa-id-card mr-1"></i> {{ record.card_number }}</span>
      <span class="text-xs font-normal text-gray-500"><i class="far fa-clock mr-1"></i> {{ accessTime }}</span>
    </div>
  </div>
</template>

<script>
import { get } from 'lodash'
import { format } from 'date-fns'

export default {
  props: {
    record: {
      type: Object,
      required: true,
    },
  },
  computed: {
    cardHolderName() {
      return get(this.record, 'card.name', 'Unregistered User')
    },
    accessTime() {
      const time = new Date(this.record.time)
      return format(time, 'h:mm aaa, d MMM yyyy')
    },
  },
}
</script>

<style lang="scss" scoped></style>
