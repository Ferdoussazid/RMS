<template>
  <EventListItem
    :event="event"
    theme="from-green-500 to-green-300"
    icon="/icon/door-lock7.svg"
    :show-site-name="showSiteName"
  >
    <div class="flex flex-col">
      <span>Security Breach Clear</span>
      <span class="font-normal text-gray-500">{{ senderName }}</span>
      <span class="font-light text-gray-500">{{ senderPhone }}</span>
    </div>
    <template #extra>
      <div v-if="isExpanded" class="grid grid-cols-12 gap-2 p-2 transition duration-300 ease-in-out">
        <div class="col-span-12 flex flex-col justify-center">
          <span class="text-[0.6rem] font-normal">Note</span
          ><span class="text-xs font-medium text-gray-600">{{ event.meta?.note || 'No notes provided' }}</span>
        </div>
      </div>
    </template>
    <template #meta>
      <div class="flex items-center gap-1">
        <div v-if="event.meta?.note" class="flex cursor-pointer justify-center">
          <span
            v-if="!isExpanded"
            class="flex w-full items-center justify-center gap-0.5 rounded bg-gray-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-teal-600"
            @click="isExpanded = true"
          >
            <i class="fas fa-expand-arrows-alt pr-px"></i>More
          </span>
          <span
            v-if="isExpanded"
            class="flex w-full items-center justify-center gap-0.5 rounded bg-gray-100 px-1.5 py-0.5 text-[0.65rem] font-medium text-teal-600"
            @click="isExpanded = false"
          >
            <i class="fas fa-compress-arrows-alt pr-px"></i>Less
          </span>
        </div>
      </div>
    </template>
  </EventListItem>
</template>

<script>
import { get } from 'lodash'
import BaseSiteEvent from '~/mixins/BaseSiteEvent'

export default {
  mixins: [BaseSiteEvent],
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
    }
  },
  computed: {
    senderName() {
      const senderName = get(this.event, 'meta.name', '')
      return senderName
    },
    senderPhone() {
      const senderPhone = get(this.event, 'meta.phone', '')
      return senderPhone
    },
  },
}
</script>

<style lang="scss" scoped></style>
